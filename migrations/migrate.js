const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');
const config = require('./config');
require('dotenv').config();

function showHelp() {
  console.log(`
MySQL Migration Tool - Available Commands:

  npm run migrate                       - Run all pending migrations
  npm run migrate:down                  - Roll back all migrations
  npm run migrate:rollback -- <version> - Roll back to specific version
                                          Example: npm run migrate:rollback -- 001
  npm run migrate:help                  - Show this help message
`);
  process.exit(0);
}

async function migrate(direction = 'up', targetVersion = null) {
  // Show help if requested
  if (direction === '--help' || direction === '-h') {
    showHelp();
    return;
  }

  let initialConnection;
  let connection;

  try {
    // First phase: Ensure database exists
    // Connect without selecting a database to create it if needed
    initialConnection = await mysql.createConnection({
      host: config.development.host,
      user: config.development.user,
      password: config.development.password,
      port: config.development.port
    });

    // Create database if it doesn't exist
    await initialConnection.execute(
      `CREATE DATABASE IF NOT EXISTS ${config.development.database}`
    );
  } catch (error) {
    console.error('Failed to create database:', error);
    process.exit(1);
  } finally {
    // Close initial connection after database creation
    if (initialConnection) await initialConnection.end();
  }

  try {
    // Second phase: Run migrations
    // Connect to the specific database
    connection = await mysql.createConnection(config.development);
    
    // Create a wrapper for database queries
    const queryInterface = {
      query: (...args) => connection.execute(...args)
    };

    // Create migrations table to track which migrations have been run
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Get all migration files from the scripts directory
    let migrationFiles = await fs.readdir(path.join(__dirname, 'scripts'));
    migrationFiles.sort();  // Sort to ensure consistent order

    // Get list of already executed migrations from database
    const [executedMigrations] = await connection.execute('SELECT name FROM migrations');
    const executedMigrationNames = executedMigrations.map(m => m.name);

    // Handle rollback to specific version
    if (direction === 'rollback' && targetVersion) {
      // Find the index of target version in migration files
      const targetIndex = migrationFiles.findIndex(file => file.startsWith(targetVersion));
      if (targetIndex === -1) {
        throw new Error(`Target version ${targetVersion} not found`);
      }

      // Get all migrations that need to be rolled back
      // (everything after target version that has been executed)
      const migrationsToRollback = migrationFiles
        .slice(targetIndex + 1)          // Get all migrations after target
        .filter(file => executedMigrationNames.includes(file))  // Only include executed ones
        .reverse();                      // Reverse order for proper rollback

      // Roll back each migration
      for (const file of migrationsToRollback) {
        const migration = require(path.join(__dirname, 'scripts', file));
        await migration.down(queryInterface);
        await connection.execute('DELETE FROM migrations WHERE name = ?', [file]);
        console.log(`Rolled back migration: ${file}`);
      }
      
      console.log(`Successfully rolled back to version ${targetVersion}`);
      return;
    }

    // Handle regular up/down migrations
    if (direction === 'down') {
      migrationFiles.reverse();  // Reverse order for down migrations
    }

    // Process each migration file
    for (const file of migrationFiles) {
      const migration = require(path.join(__dirname, 'scripts', file));
      
      try {
        // Run 'up' migration if it hasn't been executed yet
        if (direction === 'up' && !executedMigrationNames.includes(file)) {
          await migration.up(queryInterface);
          await connection.execute('INSERT INTO migrations (name) VALUES (?)', [file]);
          console.log(`Migrated up: ${file}`);
        } 
        // Run 'down' migration if it has been executed
        else if (direction === 'down' && executedMigrationNames.includes(file)) {
          await migration.down(queryInterface);
          await connection.execute('DELETE FROM migrations WHERE name = ?', [file]);
          console.log(`Migrated down: ${file}`);
        }
      } catch (error) {
        console.error(`Failed to migrate ${file}:`, error);
        throw error;
      }
    }
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    // Always close the database connection
    if (connection) await connection.end();
  }
}

// Update the command line parsing
const command = process.argv[2];
if (command === 'help') {
  showHelp();
} else {
  const direction = command === 'down' ? 'down' : 
                   command === 'rollback' ? 'rollback' : 'up';
  const targetVersion = process.argv[3];
  migrate(direction, targetVersion);
} 