const express = require("express");
const morgan = require("morgan");
const winston = require('./config/winston');
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
const User = require("./models/User.js");

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

/* 미들웨어 */
    // production 환경으로 실행시
if (process.env.NODE_ENV === 'production') {
    // app.enable('trust proxy');
    app.use(morgan('combined'));
    app.use(helmet({ contentSecurityPolicy: false }));
    app.use(hpp());
} else {
    // dev 환경으로 실행시
    app.use(morgan('dev'));
}

app.use(cookieParser(process.env.SECRET))
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
})
);

    /* 
    connect-flash 미들웨어로, 내부적으로 cookie-parser와 express-session 뒤에 작성해줘야한다
    coneect-flash는 req 객체에 req.flash라는 프로퍼티를 생성하고 req.flash(key, value) 형태로
    키에 매칭된 값을 설정하고 req.flash(key)로 불러와 사용한다.
    */
app.use(flash());

/* Passport setup */
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/* 미들웨어 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

    // 정적 파일들을 서비스할 폴더를 public 폴더로 지정.
app.use(express.static("public"));

/* MongoDB Connection */
    // 몽구스를 사용해 Mongo DB 연결
mongoose    
    .connect("mongodb://127.0.0.1:27017/facebook_clone", {
        // connect 옵션
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        // winston 모듈을 연결해 다음과 같이 console.log를 대체 할 수 있다.
        // console.log를 winston.info 나 wisnton.error 형태로 바꾸면 로그 파일에 로그를 기록할 수 있다. 
        winston.error(err);
    });

/* Template 파일에 변수 전송 */
    // 템플릿 파일에 user와 Authentication, flash와 관련한 변수를 전송해주는 부분.
app.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.login = req.isAuthenticated();
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

/* Routers 장착 */
app.use("/", userRoutes);
app.use("/", postRoutes);

/* 서버 연결 */
const server = app.listen(port, () => {
    console.log(`App is running on ${port}`);
});

/* 
    WebSocket 설정
    socket.io를 이용해 websocket 통신을 구현하고 http통신을 하는 express 서버와 연결. 
*/
const io = socket(server);

    // Room은 Namespace의 하위 개념.(NameSpace -> Room -> Socket )
    // Namespace안에 있는 소켓들을 또 다시 Room으로 나눌 수 있다.
    // NameSpace란 같은 Namespace에 있는 소켓 끼리만 통신 하는 개념
    // io.of("/chat") 을 통해 room이라는 namespace를 생성함.
const room = io.of("/chat");
room.on("connection", socket => {
    // winston 모듈을 연결해 다음과 같이 console.log를 대체 할 수 있다.
    winston.info("new user : ", socket.id);

    room.emit("newUser", { socketID: socket.id });

        // 새 user가 들어왔을 때
    socket.on("newUser", data => {
        if (!(data.name in onlineChatUsers)) {
            onlineChatUsers[data.name] = data.socketID;
            socket.name = data.name;
            room.emit("updateUserList", Object.keys(onlineChatUsers));
            winston.info("Online users: " + Object.keys(onlineChatUsers));
        }
    });

        // user가 나갔을 때
    socket.on("disconnect", () => {
        delete onlineChatUsers[socket.name];
        room.emit("updateUserList", Object.keys(onlineChatUsers));
        winston.info(`user ${socket.name} disconnected`);
    });

        // 사용자들이 메세지를 보냈을 때.
    socket.on("chat", data => {
        winston.info(data);
        if (data.to === "Global Chat") {
            room.emit("chat", data);
        } else if (data.to) {
            room.to(onlineChatUsers[data.name]).emit("chat", data);
            room.to(onlineChatUsers[data.to]).emit("chat", data);
        }
    });
});