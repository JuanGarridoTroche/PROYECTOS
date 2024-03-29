CREATE DATABASE IF NOT EXISTS lineage;
USE lineage;

DROP TABLE IF EXISTS descends;
DROP TABLE IF EXISTS items;
DROP TABLE IF EXISTS lineages;
DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS users (
	id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
	email VARCHAR(100) UNIQUE NOT NULL,
	password VARCHAR(100) NOT NULL,
	role ENUM('admin', 'mod', 'user') DEFAULT 'user' NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name1 VARCHAR(100) NOT NULL,
    last_name2 VARCHAR(100) NOT NULL,
	registrationCode VARCHAR(100),
	recoverPassCode VARCHAR(20),
	active BOOLEAN DEFAULT false,
	createdAt TIMESTAMP NOT NULL,
	modifiedAt TIMESTAMP);
    
CREATE TABLE IF NOT EXISTS lineages (
	id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
	lineage VARCHAR(100) UNIQUE NOT NULL,
	description VARCHAR(900),	
	shield VARCHAR(100),
	createdAt TIMESTAMP NOT NULL,
	modifiedAt TIMESTAMP);

CREATE TABLE IF NOT EXISTS items (
	id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    id_lineage INT UNSIGNED NOT NULL,
	FOREIGN KEY (id_lineage) REFERENCES lineages(id),
	name VARCHAR(100) NOT NULL,
	createdAt TIMESTAMP NOT NULL,
	modifiedAt TIMESTAMP);
    
CREATE TABLE IF NOT EXISTS descends (
	id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    id_lineage INT UNSIGNED NOT NULL,
	FOREIGN KEY (id_lineage) REFERENCES lineages(id),
	id_user INT UNSIGNED NOT NULL,
	FOREIGN KEY (id_user) REFERENCES users(id),
	createdAt TIMESTAMP NOT NULL,
	modifiedAt TIMESTAMP);


