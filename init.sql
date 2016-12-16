-- Rob Russo 2016
-- rrusso44@gmail.com
--
-- CAUTION
-- Running this script will reset the database to its initial state
-- YOU WILL LOSE DATA
--

-- Reset DB
DROP TRIGGER IF EXISTS price_added_cakes ON cakes;
DROP TRIGGER IF EXISTS price_added_ice_cream ON ice_cream;

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

-- Enums
CREATE TYPE CAKE_TYPE AS ENUM ('Basic', 'Premium');
CREATE TYPE CAKE_SIZE AS ENUM ('6_Round', '8_Round', '10_Round', 'Sheet', 'Heart');
CREATE TYPE COLOR AS ENUM ('Red','Orange','Royal Blue','Sky Blue','Purple','Teal','Dark Green','Lime Green','Pastel Pink','Hot Pink','Yellow','Black');
CREATE TYPE ICE_CREAM_SIZE AS ENUM('Pint', 'Quart');
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
  ice_cream_id SERIAL PRIMARY KEY,
  size ICE_CREAM_SIZE NOT NULL,
  flavor FLAVOR NOT NULL,
  quantity INT NOT NULL,
  price MONEY NOT NULL,
  CHECK(
    quantity > 0 AND price::numeric > 0
  )
);

CREATE TABLE IF NOT EXISTS orders(
  order_id SERIAL PRIMARY KEY,
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

-- PROCEDURES
CREATE OR REPLACE FUNCTION calculate_price_cakes()
RETURNS trigger AS $price_added_cakes$
  BEGIN
    NEW.price = (SELECT price FROM cake_size_prices AS c WHERE c.type = NEW.type AND c.size = NEW.size);
    NEW.price = NEW.price + (SELECT SUM(p.price) FROM filling_prices AS p WHERE p.filling = ANY(NEW.fillings));
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


-- TRIGGERS
CREATE TRIGGER price_added_cakes
  BEFORE INSERT OR UPDATE ON cakes
  FOR EACH ROW EXECUTE PROCEDURE calculate_price_cakes();

CREATE TRIGGER price_added_ice_cream
  BEFORE INSERT OR UPDATE ON ice_cream
  FOR EACH ROW EXECUTE PROCEDURE calculate_price_ice_cream();
