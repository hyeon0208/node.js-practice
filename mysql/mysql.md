## DATABASE

- 데이터베이스 목록 표시<br>
SHOW databases;<br>

- 데이터베이스 생성<br>
CREATE DATABASE [DB명];<br>

- 데이터베이스 삭제<br>
DROP DATABASE [삭제할 DB명];<br>

- 데이터베이스에 접근(선택)<br>
USE [선택할 DB명];<br>

## TABLE

- 테이블 목록 표시<br>
SHOW TABLES;<br>

- 테이블 설계 정보 확인<br>
DESC [테이블명];<br>

- 테이블 생성<br>
CREATE TABLE [table명] (
  [column1] [datatype] [option],
  [column2] [datatype] [option],
  [column3] [datatype] [option],
  ...
  PRIMARY KEY ([PK로 지정할 column명]),
  FOREIGN KEY ([FK로 지정할 column명]) REFERENCES [참조할 table명] ([참조할 PK명])
);<br>

- 테이블 삭제<br>
DROP TABLE [table명];<br>

- 테이블에 column 추가<br>
ALTER TABLE [table명] ADD [추가할 column명] [type] [필요한 option];<br>

- column의 type 변경<br>
ALTER TABLE [table명] MODIFY [column명] [변경할 type];<br>

## Records (Row, Data)

- 테이블 내의 전체 데이터 조회<br>
SELECT * from [조회할 table명];<br>

- 테이블 내의 전체 데이터를 목록 형태로 조회<br>
SELECT * from [조회할 table명]\G<br>
> 데이터가 길어서 표가 깨져서 가독성이 좋지 않을 때
;대신 \G라는 meta command를 사용하면 데이터를 표가 아닌 목록 형태로 표시할 수 있다.

- 특정 테이블 내의 특정 데이터만 조회<br>
SELECT * FROM [table명] WHERE [column명][연산자][값];<br>

- 지정 column의 전체 데이터 조회<br>
SELECT [column명] FROM [table명];<br>

- 데이터 추가<br>
INSERT INTO [table명] ([column명]) VALUES ([값]);<br>

- 데이터 값 수정<br>
UPDATE [table명] SET [column명]=[수정할 값] WHERE [조건식];<br>

- 데이터 삭제<br>
DELETE FROM [table명] WHERE [조건식];<br>

- Foreign Key 추가<br>
ALTER TABLE [table명] ADD FOREIGN KEY ([FK로 설정할 column명]) REFERENCES [참조할 table명(참조할 PK명)];<br>

## Operators

- LIKE<br>
SELECT [column명] FROM [table명] WHERE [table명.column명] LIKE [pattern];<br>
> LIKE 연산자를 사용하면, 특정 column에 문자열을 검색할 수 있다.
SQL에서는 LIKE 연산자에 %와 _라는 와일드 카드를 사용하여 임의의 패턴에 일치하는 문자열을 찾을 수 있다.