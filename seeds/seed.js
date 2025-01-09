const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');
const config = require('../migrations/config');

async function seed(direction = 'up') {
  let connection;

  try {
    connection = await mysql.createConnection(config.development);
    
    const queryInterface = {
      query: (...args) => connection.execute(...args)
    };

    // Create seeds table if it doesn't exist
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS seeds (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Get all seed files
    let seedFiles = await fs.readdir(path.join(__dirname, 'scripts'));
    seedFiles.sort();

    if (direction === 'down') {
      seedFiles.reverse();
    }

    // Get executed seeds
    const [executedSeeds] = await connection.execute('SELECT name FROM seeds');
    const executedSeedNames = executedSeeds.map(s => s.name);

    for (const file of seedFiles) {
      const seed = require(path.join(__dirname, 'scripts', file));
      
      try {
        if (direction === 'up' && !executedSeedNames.includes(file)) {
          await seed.up(queryInterface);
          await connection.execute('INSERT INTO seeds (name) VALUES (?)', [file]);
          console.log(`Seeded up: ${file}`);
        } else if (direction === 'down' && executedSeedNames.includes(file)) {
          await seed.down(queryInterface);
          await connection.execute('DELETE FROM seeds WHERE name = ?', [file]);
          console.log(`Seeded down: ${file}`);
        }
      } catch (error) {
        console.error(`Failed to seed ${file}:`, error);
        throw error;
      }
    }
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
}

const direction = process.argv[2] === 'down' ? 'down' : 'up';
seed(direction); 