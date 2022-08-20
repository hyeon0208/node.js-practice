const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const cookieParser = require('cookie-parser');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const socket = require("socket.io");
const dotenv = require("dotenv");

    // req 객체에 req.flash라는 프로퍼티를 새성하고 req.flash(key, value) 형태로 키에 매칭된 값을 설정하고 req.flash(key)로 불러와 사용.
const flash = require("connect-flash");
const Post = require("./models/Post");
const User = require("./models/User");

const port = process.env.PORT || 3000;

    // 채팅 기능을 위해 user의 정보를 담을 객체 생성.
const onlineChatUsers = {};

    // process.env를 통해 .env 파일의 변수를 사용할 수 있도록 해주는 구문.
dotenv.config();

    // 게시글 관련 라우터 불러오기
const postRoutes = require("./routes/posts");

    //사용자에 관한 라우터 불러오기.
const userRoutes = require("./routes/users");

const app = express();

    // ejs를 사용해 view를 구성할 것이라는 것을 나타냄
app.set("view engine", "ejs");

/* Middleware */
app.use(cookieParser(process.env.SECRET))
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
})
);
    // connect-flash 미들웨어로, 내부적으로 cookie-parser와 express-session 뒤에 작성해줘야한다
app.use(flash());

/* Passport setup */
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/* Middleware */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
    // 정적 파일들을 서비스할 폴더를 public 폴더로 지정.
app.use(express.static("public"));

/* MongoDB Connection */
    // 몽구스를 사용해 Mongo DB 연결
mongoose
    .connect("mongodb://127.0.0.1:27017/facebook_clone", {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.log(err);
    });

/* Template 파일에 변수 전송 */
app.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.login = req.isAuthenticated();
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

/* Routers */
app.use("/", userRoutes);
app.use("/", postRoutes);

const server = app.listen(port, () => {
    console.log("App is running on port " + port);
});

/* WebSocket setup */
const io = socket(server);

const room = io.of("/chat");
room.on("connection", socket => {
    console.log("new user : ", socket.id);

    room.emit("newUser", { socketID: socket.id });

        // 새 user가 들어왔을 때
    socket.on("newUser", data => {
        if (!(data.name in onlineChatUsers)) {
            onlineChatUsers[data.name] = data.socketID;
            socket.name = data.name;
            room.emit("updateUserList", Object.keys(onlineChatUsers));
            console.log("Online users: " + Object.keys(onlineChatUsers));
        }
    });

        // user가 나갔을 때
    socket.on("disconnect", () => {
        delete onlineChatUsers[socket.name];
        room.emit("updateUserList", Object.keys(onlineChatUsers));
        console.log(`user ${socket.name} disconnected`);
    });

        // 사용자들이 메세지를 보냈을 때.
    socket.on("chat", data => {
        console.log(data);
        if (data.to === "Global Chat") {
            room.emit("chat", data);
        } else if (data.to) {
            room.to(onlineChatUsers[data.name]).emit("chat", data);
            room.to(onlineChatUsers[data.to]).emit("chat", data);
        }
    });
});