const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const app = express();

// 포트 설정
app.set('port', process.env.PORT || 8080);

// 가상 데이터 객체 생성
let fakeUser = {
    username: 'shj',
    password: '12341234'
}

// 미들웨어 
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser('passportExample'));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'passportExample',
    cookie: {
        httpOnly: true,
        secure: false
    }
}));

// passport 미들웨어 
app.use(passport.initialize()); // passport 초기화 부분
app.use(passport.session()); // passport session 연동 ( express session을 내부적으로 사용한단 의미)
// req.session에 passport 관련 정보를 저장하게 된다.
// passport는 세션을 내부적으로 사용하기 때문에 반드시 세션을 활성화하는 코드 다음에 위치해야한다.


// 세션 처리 - 로그인에 성공했을 경우 딱 한번 호출되어 사용자의 식별자를 session에 저장
passport.serializeUser(function (user, done) {
    console.log('serializeUser', user);
    done(null, user.username);
});

// 세션 처리 - 로그인 후 페이지 방문 마다 사용자의 실제 데이터 주입
passport.deserializeUser(function (id, done) {
    console.log('deserializeUser', id);
    done(null, fakeUser); // req.user에 전달
});

passport.use(new LocalStrategy(
    function (username, password, done) {
        if (username === fakeUser.username) { // username OK
            if (password === fakeUser.password) { // password OK
                return done(null, fakeUser);
                // done(오류 여부, 결과 값, 실패했을 경우)
            } else {
                return done(null, false, { message: "password incorrect" });
            }
        } else {
            return done(null, false, { message: "username incorrect" });
        }
    }
));

// 라우터 설정 
app.get('/', (req, res) => {
    if (!req.user) { // 로그인 아직 하지 않았을 때
        res.sendFile(__dirname + '/index.html');
    } else { // 로그인 성공시 세션에 req.user 저장
        const user = req.user.username;
        const html = `
        <!DOCTYPE html>
        <html lang="ko">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
        </head>
        <body>
            <p>${user}님 안녕하세요!</p>
            <button type="button" onclick="location.href='/logout'">Log Out</button>
        </body>
        </html>
        `
        res.send(html);
    }
});

/* Passport Login : Strategy-Local */
/* Authenticate Requests */
app.post('/login',
    // '/login' 엔드포인트에서 로그인에 실패했을 시 failureRedirect로 '/' 엔드포인트로 리다이렉션
     
    // passport.authenticate(local, ) 를 통해 local 전략을 사용할 것을 알림
    passport.authenticate('local', { failureRedirect: '/' }),
    function(req,res){
        req.session.save(function(){
          res.redirect('/');      
        });
    });
    // 로그아웃
// app.get('/logout', function (req, res) {
//     req.logout(); // req.session에 담긴 사용자의 정보를 삭제한다.
//     res.redirect('/');
// });

app.get('/logout', function (req,res) {
    req.logout();
    req.session.save(function(){
      res.redirect('/');
    })
  });

// 404 에러처리 
app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 해당 주소가 없습니다.`);
    error.status = 404;
    next(error);
});

// 에러처리 미들웨어 
app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'development' ? err : {};
    res.status(err.status || 500);
    res.send('error Occurred');
});

// 서버와 포트 연결.. 
app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 서버 실행 중 ..')
});