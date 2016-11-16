const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/ferris_acres';

const client = new pg.Client(connectionString);
client.connect();
const query = client.query(
  'CREATE TABLE IF NOT EXISTS users(' +
    'id SERIAL PRIMARY KEY,' +
    'first_name VARCHAR(40) NOT NULL,' +
    'last_name VARCHAR(40) NOT NULL,' +
    'email VARCHAR(100) NOT NULL,' +
    'phone VARCHAR(10) NOT NULL)'
);
query.on('end', () => {client.end(); });
