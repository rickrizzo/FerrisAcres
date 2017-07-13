-- Rob Russo 2016
-- rrusso44@gmail.com
--
-- CAUTION
-- Running this script will reset the database to its initial state
-- YOU WILL LOSE DATA
--

-- Reset DB
DROP EXTENSION IF EXISTS pgcrypto;

DROP TRIGGER IF EXISTS price_added_cakes ON cakes;
DROP TRIGGER IF EXISTS price_added_ice_cream ON ice_cream;

DROP SEQUENCE random_int_seq;

DROP TABLE IF EXISTS cake_size_prices;
DROP TABLE IF EXISTS ice_cream_size_prices;
DROP TABLE IF EXISTS filling_prices;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS cakes CASCADE;
DROP TABLE IF EXISTS ice_cream CASCADE;

DROP TYPE IF EXISTS CAKE_TYPE;
DROP TYPE IF EXISTS CAKE_SIZE;
DROP TYPE IF EXISTS COLOR;
DROP TYPE IF EXISTS ICE_CREAM_SIZE;
DROP TYPE IF EXISTS FLAVOR;
DROP TYPE IF EXISTS FILLING;

-- Extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Enums
CREATE TYPE CAKE_TYPE AS ENUM ('Basic', 'Premium');
CREATE TYPE CAKE_SIZE AS ENUM ('6_Round', '8_Round', '10_Round', 'Sheet', 'Heart');
CREATE TYPE COLOR AS ENUM ('Red','Orange','Royal Blue','Sky Blue','Purple','Teal','Dark Green','Lime Green','Pastel Pink','Hot Pink','Yellow','Black');
CREATE TYPE ICE_CREAM_SIZE AS ENUM('Pint', 'Quart', 'Half Gallon', 'Tub');
CREATE TYPE FILLING AS ENUM('Cake Crunch', 'Oreos', 'Chocolate Chunks', 'Fudge', 'Mini Chips', 'Peanut Butter Cups', 'Nut Filling');
CREATE TYPE FLAVOR AS ENUM(
  'Bad Habit',
  'Bada Bing',
  'Cake Batter',
  'Campfire',
  'Chocolate',
  'Chocolate Chip',
  'Coc Choc Chunk',
  'Coffee Almond Fudge',
  'Cookie Dough',
  'Cookie Jar',
  'Cookies and Creme',
  'Cow Trax',
  'Dark Chocolate Espresso',
  'Elvis Dream',
  'Grasshopper',
  'MJ Rell',
  'Mocha Mayhem',
  'Paradise Found',
  'PBC Squared',
  'Razz Swirl Chip',
  'Route 302 Choc. Moo',
  'Salty Cow',
  'Strawberry',
  'Sweet Cream',
  'Vanilla'
);

-- Tables
CREATE TABLE IF NOT EXISTS users(
  user_id INTEGER PRIMARY KEY DEFAULT make_random_id(),
  name VARCHAR(64) NOT NULL,
  email VARCHAR(160) UNIQUE,
  phone INT UNIQUE,
  password VARCHAR(72)
);

CREATE TABLE IF NOT EXISTS cakes(
  cake_id INTEGER PRIMARY KEY DEFAULT make_random_id(),
  cake_number INT,
  cake_name VARCHAR(64),
  type CAKE_TYPE NOT NULL,
  size CAKE_SIZE NOT NULL,
  fillings FILLING ARRAY[10],
  art_description VARCHAR(1024),
  color_one COLOR,
  color_two COLOR,
  flavor_one FLAVOR NOT NULL DEFAULT 'Vanilla',
  flavor_two FLAVOR NOT NULL DEFAULT 'Chocolate',
  writing VARCHAR(140),
  writing_color COLOR,
  price MONEY NOT NULL,
  CHECK(
    writing IS NULL AND writing_color IS NULL OR
    writing IS NOT NULL AND writing_color IS NOT NULL AND
    price::numeric >= 0
  )
);

CREATE TABLE IF NOT EXISTS ice_cream(
  ice_cream_id INTEGER PRIMARY KEY DEFAULT make_random_id(),
  size ICE_CREAM_SIZE NOT NULL,
  flavor FLAVOR NOT NULL,
  quantity INT NOT NULL,
  price MONEY NOT NULL,
  CHECK(
    quantity > 0 AND price::numeric > 0
  )
);

CREATE TABLE IF NOT EXISTS orders(
  order_id INTEGER PRIMARY KEY DEFAULT make_random_id(),
  user_id INT NOT NULL REFERENCES users(user_id),
  placed timestamp NOT NULL DEFAULT current_timestamp,
  pickup timestamp NOT NULL,
  cake_id INT ARRAY[10],
  ice_cream_id INT ARRAY[10],
  instructions VARCHAR(1000),
  paid BOOLEAN NOT NULL DEFAULT FALSE,
  ready BOOLEAN NOT NULL DEFAULT FALSE,
  CHECK(
    array_length(cake_id, 1) > 0 OR array_length(ice_cream_id, 1) > 0
  )
);

CREATE TABLE IF NOT EXISTS cake_size_prices(
  size CAKE_SIZE NOT NULL,
  type CAKE_TYPE NOT NULL,
  price MONEY NOT NULL
);

CREATE TABLE IF NOT EXISTS ice_cream_size_prices(
  size ICE_CREAM_SIZE NOT NULL,
  price MONEY NOT NULL
);

CREATE TABLE IF NOT EXISTS filling_prices(
  filling FILLING NOT NULL,
  price MONEY NOT NULL
);

-- COPYS
\COPY cake_size_prices FROM 'pricing/cakeprices.csv' CSV;
\COPY ice_cream_size_prices FROM 'pricing/icecreamprices.csv' CSV;
\COPY filling_prices FROM 'pricing/fillingprices.csv' CSV;

-- SEQUENCES
create sequence random_int_seq;

-- PROCEDURES
CREATE OR REPLACE FUNCTION calculate_price_cakes()
RETURNS trigger AS $price_added_cakes$
  BEGIN
    NEW.price = (SELECT price FROM cake_size_prices AS c WHERE c.type = NEW.type AND c.size = NEW.size);
    -- Fillings
    IF NEW.fillings IS NOT NULL THEN
      NEW.price = NEW.price + (SELECT SUM(p.price) FROM filling_prices AS p WHERE p.filling = ANY(NEW.fillings));
    END IF;
    -- Art
    IF NEW.art_description IS NOT NULL THEN
      IF NEW.art_description <> '' THEN
        NEW.price = NEW.price + MONEY(5);
      END IF;
    END IF;
  RETURN NEW;
  END;
$price_added_cakes$  LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION calculate_price_ice_cream()
RETURNS trigger AS $price_added_ice_cream$
  BEGIN
    NEW.price = (SELECT price FROM ice_cream_size_prices AS c WHERE c.size = NEW.size) * NEW.quantity;
    RETURN NEW;
  END;
$price_added_ice_cream$  LANGUAGE plpgsql;

-- Feistel Cipher taken from http://wiki.postgresql.org/wiki/Pseudo_encrypt
CREATE OR REPLACE FUNCTION pseudo_encrypt(VALUE int) RETURNS bigint AS $$
DECLARE
l1 int;
l2 int;
r1 int;
r2 int;
i int:=0;
BEGIN
  l1:= (VALUE >> 16) & 65535;
  r1:= VALUE & 65535;
  WHILE i < 3 LOOP
    l2 := r1;
    r2 := l1 # ((((1366.0 * r1 + 150889) % 714025) / 714025.0) * 32767)::int;
    l1 := l2;
    r1 := r2;
    i := i + 1;
  END LOOP;
  RETURN ((l1::bigint << 16) + r1);
END;
$$ LANGUAGE plpgsql strict immutable;

CREATE OR REPLACE FUNCTION make_random_id() RETURNS bigint as $$
  select pseudo_encrypt(nextval('random_int_seq')::int)
$$ language sql;

CREATE OR REPLACE FUNCTION hash_password()
RETURNS trigger as $hashed_password$
  BEGIN
    IF NEW.password IS NOT NULL THEN
      NEW.password = crypt(NEW.password, gen_salt('bf', 8));
    END IF;
  RETURN NEW;
  END;
$hashed_password$  LANGUAGE plpgsql;

-- TRIGGERS
CREATE TRIGGER price_added_cakes
  BEFORE INSERT OR UPDATE ON cakes
  FOR EACH ROW EXECUTE PROCEDURE calculate_price_cakes();

CREATE TRIGGER price_added_ice_cream
  BEFORE INSERT OR UPDATE ON ice_cream
  FOR EACH ROW EXECUTE PROCEDURE calculate_price_ice_cream();

CREATE TRIGGER hashed_password
  BEFORE INSERT OR UPDATE ON users
  FOR EACH ROW EXECUTE PROCEDURE hash_password();
