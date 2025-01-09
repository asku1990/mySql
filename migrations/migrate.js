const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');
const config = require('./config');
require('dotenv').config();

async function migrate(direction = 'up') {
  let initialConnection;
  let connection;

  try {
    // First connect without database to ensure it exists
    initialConnection = await mysql.createConnection({
      host: config.development.host,
      user: config.development.user,
      password: config.development.password,
      port: config.development.port
    });

    await initialConnection.execute(
      `CREATE DATABASE IF NOT EXISTS ${config.development.database}`
    );
  } catch (error) {
    console.error('Failed to create database:', error);
    process.exit(1);
  } finally {
    if (initialConnection) await initialConnection.end();
  }

  try {
    // Then connect with the database selected
    connection = await mysql.createConnection(config.development);
    
    // Create a queryInterface wrapper for the connection
    const queryInterface = {
      query: (...args) => connection.execute(...args)
    };

    // Create migrations table if it doesn't exist
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Get all migration files
    let migrationFiles = await fs.readdir(path.join(__dirname, 'scripts'));
    migrationFiles.sort();

    // If running down migrations, reverse the order
    if (direction === 'down') {
      migrationFiles.reverse();
    }

    // Get executed migrations
    const [executedMigrations] = await connection.execute('SELECT name FROM migrations');
    const executedMigrationNames = executedMigrations.map(m => m.name);

    for (const file of migrationFiles) {
      const migration = require(path.join(__dirname, 'scripts', file));
      
      try {
        if (direction === 'up' && !executedMigrationNames.includes(file)) {
          // Run migration
          await migration.up(queryInterface);
          await connection.execute('INSERT INTO migrations (name) VALUES (?)', [file]);
          console.log(`Migrated up: ${file}`);
        } else if (direction === 'down' && executedMigrationNames.includes(file)) {
          // Rollback migration
          await migration.down(queryInterface);
          await connection.execute('DELETE FROM migrations WHERE name = ?', [file]);
          console.log(`Migrated down: ${file}`);
        }
      } catch (error) {
        console.error(`Failed to migrate ${file}:`, error);
        throw error; // Re-throw to stop migration process
      }
    }
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
}

// Run migrations based on command line argument
const direction = process.argv[2] === 'down' ? 'down' : 'up';
migrate(direction); 