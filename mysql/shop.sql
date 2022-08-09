create database shop CHARACTER SET utf8 COLLATE utf8_general_ci;
use shop;
show databases;

create table shop.customers (
	id INT NOT NULL AUTO_INCREMENT,
    name varchar(20) NOT NULL,
    age INT unsigned not null,
    sex varchar(20) not null,
    joined_date datetime not null default now(),
    primary key(id)
    )
default charset = utf8mb4
engine = InnoDB;

create table shop.purchase (
	id INT NOT NULL AUTO_INCREMENT,
    customer_id int not null,
    book_name varchar(20) NOT NULL,
    purchase_date datetime not null default now(),
    primary key(id),
    foreign key(customer_id)
    references shop.customers(id)
    on delete cascade
    on update cascade
    )
default charset = utf8mb4
engine = InnoDB;
