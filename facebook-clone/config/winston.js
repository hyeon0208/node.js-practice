/*
morgan을 이용시 서버가 재시작되면 console.log, console.error 등의 기록은 사라지게 되는데
이것을 기록해주는 역할을 하는 것이 winston 이다.
단 AWS 서비스에선 서버가 재시작되도 로그가 기록에 남는 서비스를 제공하기 때문에 이때엔 사용할 필요가 없다.
*/

const winston = require('winston')

    // logger를 생성하고 로거의 레벨 info에 대해 정의
    // 로거의 레벨은 총 7가지로 높을수록 위험하거나 중요한 로그라는 뜻.
    // error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
const logger = winston.createLogger({

    // console.log 대신 winston.info(출력할 정보) 형태로 사용할 수 있다.
    level: 'info',
    
    format: winston.format.json(),

    // 로그를 어디 저장할지 설정하는 부분.( 여러 옵션 지정 가능 )
    transports: [
        // level 이 'error'로그일 때는 legs/error.log에 저장.
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),

        // combined.log라는 이름으로 info로그를 저장
        new winston.transports.File({ filename: 'logs/combined.log' })
    ]
});

// production 모드로 실행하지 않았을 경우 단순히 콘솔에만 간략한 포멧으로 출력. 
    //( 개발 환경에서는 사용자의 IP등 자세한 로그가 필요없기 때문)
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}

module.exports = logger

/*
'winston-daily-rotate-file' 
이라는 모듈을 이용해 하루 단위로 새 로그 파일을 생성해주거나
로그 파일의 크기와 저장 파일 개수 등을 설정할 수 있다.
*/