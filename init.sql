-- Rob Russo 2016
--
-- CAUTION
-- Running this script will reset the database to its initial state
-- YOU WILL LOSE DATA
--

-- Create database
CREATE DATABASE ferris_acres ENCODING 'utf-8';

-- Reset DB
DROP TABLE users CASCADE;
DROP TABLE orders CASCADE;
DROP TABLE cakes CASCADE;

DROP TYPE CAKE_TYPE;
DROP TYPE CAKE_SIZE;
DROP TYPE COLOR;

-- Enums
CREATE TYPE CAKE_TYPE AS ENUM ('Basic', 'Premium');
CREATE TYPE CAKE_SIZE AS ENUM ('6_Round', '8_Round', '10_Round', 'Sheet', 'Heart');
CREATE TYPE COLOR AS ENUM (
  'Red',
  'Orange',
  'Royal Blue',
  'Sky Blue',
  'Purple',
  'Teal',
  'Dark Green',
  'Lime Green',
  'Pastel Pink',
  'Hot Pink',
  'Yellow',
  'Black'
);

-- Tables
CREATE TABLE IF NOT EXISTS users(
  user_id SERIAL PRIMARY KEY,
  name VARCHAR(64) NOT NULL,
  email VARCHAR(140) NOT NULL UNIQUE,
  phone INT
);

CREATE TABLE IF NOT EXISTS cakes(
  cake_id SERIAL PRIMARY KEY,
  cake_number INT,
  cake_name VARCHAR(64),
  type CAKE_TYPE NOT NULL,
  size CAKE_SIZE NOT NULL,
  fillings VARCHAR(32) ARRAY[10],
  art_description VARCHAR(1024),
  color_one COLOR,
  color_two COLOR,
  writing VARCHAR(140),
  writing_color COLOR,
  CHECK(
    writing IS NULL AND writing_color IS NULL OR
    writing IS NOT NULL AND writing_color IS NOT NULL
  ),
  price MONEY NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS orders(
  order_id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(user_id),
  placed timestamp NOT NULL DEFAULT current_timestamp,
  pickup timestamp NOT NULL,
  cake_id INT NOT NULL REFERENCES cakes(cake_id),
  instructions VARCHAR(1000),
  paid BOOLEAN NOT NULL DEFAULT FALSE,
  ready BOOLEAN NOT NULL DEFAULT FALSE
);
