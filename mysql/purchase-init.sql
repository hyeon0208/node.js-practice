insert into shop.purchase(customer_id, book_name) values('1', 'DevOps 기초');
insert into shop.purchase(customer_id, book_name) values('2', 'Node.js 입문');
insert into shop.purchase(customer_id, book_name) values('3', 'Javascripts 공부하기');
insert into shop.purchase(customer_id, book_name) values('3', '머신러닝 입문하기');
insert into shop.purchase(customer_id, book_name) values('4', 'CS면접 공부하기');

select * from purchase;

/* 원하는 값만 조회하기

select name, age from customers;

select name from customers where age >30;

/*