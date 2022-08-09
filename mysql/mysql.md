## DATABASE

- 데이터베이스 목록 표시
SHOW databases;

- 데이터베이스 생성
CREATE DATABASE [DB명];

- 데이터베이스 삭제
DROP DATABASE [삭제할 DB명];

- 데이터베이스에 접근(선택)
USE [선택할 DB명];

## TABLE

- 테이블 목록 표시
SHOW TABLES;

- 테이블 설계 정보 확인
DESC [테이블명];

- 테이블 생성
CREATE TABLE [table명] (
  [column1] [datatype] [option],
  [column2] [datatype] [option],
  [column3] [datatype] [option],
  ...
  PRIMARY KEY ([PK로 지정할 column명]),
  FOREIGN KEY ([FK로 지정할 column명]) REFERENCES [참조할 table명] ([참조할 PK명])
);

- 테이블 삭제
DROP TABLE [table명];

- 테이블에 column 추가
ALTER TABLE [table명] ADD [추가할 column명] [type] [필요한 option];

- column의 type 변경
ALTER TABLE [table명] MODIFY [column명] [변경할 type];

## Records (Row, Data)

- 테이블 내의 전체 데이터 조회
SELECT * from [조회할 table명];

- 테이블 내의 전체 데이터를 목록 형태로 조회
SELECT * from [조회할 table명]\G
> 데이터가 길어서 표가 깨져서 가독성이 좋지 않을 때
;대신 \G라는 meta command를 사용하면 데이터를 표가 아닌 목록 형태로 표시할 수 있다.

- 특정 테이블 내의 특정 데이터만 조회
SELECT * FROM [table명] WHERE [column명][연산자][값];

- 지정 column의 전체 데이터 조회
SELECT [column명] FROM [table명];

- 데이터 추가
INSERT INTO [table명] ([column명]) VALUES ([값]);

- 데이터 값 수정
UPDATE [table명] SET [column명]=[수정할 값] WHERE [조건식];

- 데이터 삭제
DELETE FROM [table명] WHERE [조건식];

- Foreign Key 추가
ALTER TABLE [table명] ADD FOREIGN KEY ([FK로 설정할 column명]) REFERENCES [참조할 table명(참조할 PK명)];