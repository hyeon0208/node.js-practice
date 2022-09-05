const express = require("express");
const User = require("../models/User");
const passport = require("passport");


/*
텍스트 데이터는 urlencoded로 처리했지만,
텍스트가 아닌 이미지,동영상, 등의 파일 데이터는 multer 모듈을 이용해야한다.
*/
const multer = require("multer");

const cloudinary = require("cloudinary");
const router = express.Router();

    // csrf 모듈 추가.
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });


/* Multer setup */
    // multer를 이용해 저장 경로와 파일명을 처리하기 위해 diskStorage() 메서드를 사용.
    // cloudaniary 모듈을 사용해 파일을 저장할 것이므로 저장 경로는 따로 지정하지 않고, filename만 지정.
const storage = multer.diskStorage({
    filename: (req, file, callback) => {
        callback(null, Date.now() + file.originalname);
    }
});

    // imageFilter : 파일의 확장자가 jpg, jpeg, png인지 확인하는 부분.
const imageFilter = (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/i)) {
        return callback(new Error("Only image files are allowed!"), false);
    }
    callback(null, true);
};

    // multe 인스턴스 생성 ( storage -> 파일이 저장될 위치, fileFilter -> 어떤 파일을 허용할지 제어 )
const upload = multer({ storage: storage, fileFilter: imageFilter });

/* Cloudinary setup */
    // 이미지를 업로드하고 불러올 공간을 빌리기 위해 SaaS 서비스인 cloudinary를 사용. ( 작은 규모 프로젝트 )
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

/* Middleware */
    // 로그인 하지 않은 사용자 체크
const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("/user/login");
};

/* Routers */

/* User Routers */
router.post("/user/register", upload.single("image"), (req, res) => {
    if (
        req.body.username &&
        req.body.firstname &&
        req.body.lastname &&
        req.body.password
    ) {
        let newUser = new User({
            username: req.body.username,
            firstName: req.body.firstname,
            lastName: req.body.lastname
        });
        if (req.file) {
            cloudinary.uploader.upload(req.file.path, result => {
                newUser.profile = result.secure_url;
                return createUser(newUser, req.body.password, req, res);
            });
        } else {
            newUser.profile = process.env.DEFAULT_PROFILE_PIC;
            return createUser(newUser, req.body.password, req, res);
        }
    }
});

    /* 
    /user/register 라우터에서 받은 newUser 객체와 비밀번호를 인자로 받아 User모델에 이를 넣고
    passport를 통해authenticate()로 인증을 수행.
    */
function createUser(newUser, password, req, res) {
    User.register(newUser, password, (err, user) => {
        if (err) {
            req.flash("error", err.message);
            res.redirect("/");
        } else {
            passport.authenticate("local")(req, res, function () {
                console.log(req.user);
                req.flash(
                    "success",
                    "Success! You are registered and logged in!"
                );
                res.redirect("/");
            });
        }
    });
}

/* Login 라우터 생성. */

    /*
    get 방식을 통해 views/users/login.ejs 파일을 렌더링

    --- 기존 코드 ----
      router.get("/user/login", csrfProtection, (req, res) => {
        res.render("users/login");
    }); 에서 => csrf 모듈 추가로 다음과 같이 수정.
    */
    router.get("/user/login", csrfProtection, (req, res) => {
        res.render("users/login", { csrfToken: req.csrfToken() });
    });
    

    // post 방식을 통해 passport 인증을 수행.
    /*
    --- 기존 코드 ---
router.post(
    "/user/login",
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/user/login"
    }),
    (req, res) => { }
);     밑은 => csrf 를 추가한 코드
    */
router.post(
    "/user/login",
    csrfProtection,
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/user/login"
    }),
    (req, res) => { }
);


/* 로그인한 모든 사용자를 보여주는 라우터 생성 */
router.get("/user/all", isLoggedIn, (req, res) => {
    // 모든 사용자를 User.find() 함수를 통해 조회
    User.find({}, (err, users) => {
        if (err) {
            console.log(err);
            req.flash(
                "error",
                "There has been a problem getting all users info."
            );
            res.redirect("/");
        } else {
            // views/users/users.ejs 파일을 렌더링하고, users 객체를 보내준다.
            res.render("users/users", { users: users });
        }
    });
});

// Logout
router.get("/user/logout", (req, res) => {
    req.logout();
    res.redirect("back");
});

/* 사용자 User Profile 생성 */
router.get("/user/:id/profile", isLoggedIn, (req, res) => {
    User.findById(req.params.id)
    // mongoose의 populate 메서드를 통해  아 래 필드들의 Document를 조회.
    // pupulate는 Document가 다른 Document의 objectID를 사용할 경우 실제 객체가 어떤 것인지 찾아 바꿔주는 역할을 한다.
        .populate("friends")
        .populate("friendRequests")
        .populate("posts")

        // exec() 를 이용해 결과인 user를 콜백으로 넘겨준다.
        .exec((err, user) => {
            if (err) {
                console.log(err);
                req.flash("error", "There has been an error.");
                res.redirect("back");
            } else {
                console.log(user);
                // views/users/user.ejs를 렌더링하고 user 객체를 내보낸다.
                res.render("users/user", { userData: user });
            }
        });
});

/* 친구 추가 기능 라우터 */
router.get("/user/:id/add", isLoggedIn, (req, res) => {
     // 이미 친구인 경우
    User.findById(req.user._id, (err, user) => {
        if (err) {
            console.log(err);
            req.flash(
                "error",
                "There has been an error adding this person to your friends list"
            );
            res.redirect("back");
        } else {
            // 해당 사용자의 아이디를 찾을 수 없을 경우.
            User.findById(req.params.id, (err, foundUser) => {
                if (err) {
                    console.log(err);
                    req.flash("error", "Person not found");
                    res.redirect("back");
                } else {
                    // 이미 친구추가 요청을 보낸 경우.
                    if (
                        foundUser.friendRequests.find(o =>
                            o._id.equals(user._id)
                        )
                    ) {
                        req.flash(
                            "error",
                            `You have already sent a friend request to ${user.firstName
                            }`
                        );
                        return res.redirect("back");
                    } else if (
                             // 이미 친구인 경우
                        foundUser.friends.find(o => o._id.equals(user._id))
                    ) {
                        req.flash(
                            "error",
                            `The user ${foundUser.firstname
                            } is already in your friends list`
                        );
                        return res.redirect("back");
                    }
                    let currUser = {
                        _id: user._id,
                        firstName: user.firstName,
                        lastName: user.lastName
                    };

                    // 조건에 맞는 경우 요청을 보낸 foundUser를 friendRequests에 추가
                    foundUser.friendRequests.push(currUser);
                    foundUser.save();
                    req.flash(
                        "success",
                        `Success! You sent ${foundUser.firstName
                        } a friend request!`
                    );
                    res.redirect("back");
                }
            });
        }
    });
});

/* 친구 추가 요청 수락 라우터 */
router.get("/user/:id/accept", isLoggedIn, (req, res) => {
    User.findById(req.user._id, (err, user) => {
        if (err) {
            console.log(err);
            req.flash(
                "error",
                "There has been an error finding your profile, are you connected?"
            );
            res.redirect("back");
        } else {
            // findById()를 통해 요청한 친구의 id를 user 콜렉션에서 조회하고
            User.findById(req.params.id, (err, foundUser) => {
                let r = user.friendRequests.find(o =>
                    o._id.equals(req.params.id)
                );
                if (r) {
                    let index = user.friendRequests.indexOf(r);
                    user.friendRequests.splice(index, 1);
                    let friend = {
                        _id: foundUser._id,
                        firstName: foundUser.firstName,
                        lastName: foundUser.lastName
                    };
                    user.friends.push(friend);
                    user.save();

                    let currUser = {
                        _id: user._id,
                        firstName: user.firstName,
                        lastName: user.lastName
                    };
                    // 해당 사용자의 friends 키 값에 추가한 친구를 현재 유저(currUser)에 업데이트
                    foundUser.friends.push(currUser);
                    foundUser.save();
                    req.flash(
                        "success",
                        `You and ${foundUser.firstName} are now friends!`
                    );
                    res.redirect("back");
                } else {
                    req.flash(
                        "error",
                        "There has been an error, is the profile you are trying to add on your requests?"
                    );
                    res.redirect("back");
                }
            });
        }
    });
});

/* 친구 추가 요청 거절 라우터 */
router.get("/user/:id/decline", isLoggedIn, (req, res) => {
    User.findById(req.user._id, (err, user) => {
        if (err) {
            console.log(err);
            req.flash("error", "There has been an error declining the request");
            res.redirect("back");
        } else {
            User.findById(req.params.id, (err, foundUser) => {
                if (err) {
                    console.log(err);
                    req.flash(
                        "error",
                        "There has been an error declining the request"
                    );
                    res.redirect("back");
                } else {
                    // remove request
                    let r = user.friendRequests.find(o =>
                        o._id.equals(foundUser._id)
                    );
                    if (r) {
                        let index = user.friendRequests.indexOf(r);
                        user.friendRequests.splice(index, 1);
                        user.save();
                        req.flash("success", "You declined");
                        res.redirect("back");
                    }
                }
            });
        }
    });
});

/* Chat Routers 채팅 로직을 구현하는 부분. */
router.get("/chat", isLoggedIn, (req, res) => {
    // User 콜렉션에서 user를 찾는다.
    // 해당 user의 friends 값을 populate를 통해 접근한다.
    User.findById(req.user._id)
        .populate("friends")
        .exec((err, user) => {
            if (err) {
                console.log(err);
                req.flash(
                    "error",
                    "There has been an error trying to access the chat"
                );
                res.redirect("/");
            } else {
                // 가져온 데이터를 /views/users/chat.ejs에 보내주고 렌더링한다.
                res.render("users/chat", { userData: user });
            }
        });
});

module.exports = router;