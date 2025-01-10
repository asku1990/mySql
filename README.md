# mySql
Testing sgl migrations
# MySQL Database Migration Tool

A simple Node.js tool for managing MySQL database migrations.

## Features

- Easy migration management
- JavaScript-based scripts
- Supports rollbacks

## Prerequisites

- Node.js (v14+)
- MySQL Server
- npm or yarn

## Setup

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Configure your database:**

   Create a `.env` file in the root directory:

   ```plaintext
   DB_HOST=localhost
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_NAME=your_database
   ```

## Usage

### Create a Migration

1. Add a new file in `migrations/scripts` (e.g., `003_new_migration.js`).
2. Use this template:

   ```javascript
   module.exports = {
       up: async (queryInterface) => {
           // Migration code
       },
       down: async (queryInterface) => {
           // Rollback code
       }
   };
   ```

### Run Migrations

- **To run all migrations:**

  ```bash
  npm run migrate
  ```

- **To rollback the last migration:**

  ```bash
  npm run migrate:down
  ```

### Seed Data Management

1. Add a new seed file in `seeds/scripts` (e.g., `001_add_sample_users.js`).
2. Use this template:

   ```javascript
   module.exports = {
       up: async (queryInterface) => {
           // Seed data insertion
       },
       down: async (queryInterface) => {
           // Remove seed data
       }
   };
   ```

### Run Seeds

- **To run all seeds:**

  ```bash
  npm run seed
  ```

- **To run a specific seed file:**

  ```bash
  npm run seed <filename>
  ```

  Example:
  ```bash
  npm run seed 001_add_sample_users.js
  ```

- **To remove all seeded data:**

  ```bash
  npm run seed:down
  ```

- **To remove specific seeded data:**

  ```bash
  npm run seed:down <filename>
  ```

  Example:
  ```bash
  npm run seed:down 001_add_sample_users.js
  ```

## Understanding Migrations

### Why Migrations?

Migrations are like version control for your database. They help you:
- Track database changes over time
- Share database schema changes with team members
- Maintain consistent database states across different environments
- Rollback changes if something goes wrong

### Migration Naming Convention

Migrations should follow a sequential naming pattern:
```
001_create_users_table.js
002_add_email_column.js
003_create_products_table.js
```

The numeric prefix (001, 002, etc.) is crucial because:
- It determines the order of execution
- Helps track which migrations have been run
- Ensures consistent database state across all environments

### Migration Process Explained

1. **Creating a Migration:**
   ```javascript
   // migrations/scripts/001_create_users_table.js
   module.exports = {
       up: async (queryInterface) => {
           // This runs when migrating forward
           await queryInterface.query(`
               CREATE TABLE users (
                   id INT PRIMARY KEY AUTO_INCREMENT,
                   name VARCHAR(255),
                   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
               )
           `);
       },
       down: async (queryInterface) => {
           // This runs when rolling back
           await queryInterface.query('DROP TABLE users');
       }
   };
   ```

2. **Migration States:**
   - Each migration can be in either an 'up' or 'down' state
   - The system tracks which migrations have been run in a migrations table
   - Running `npm run migrate` executes all pending migrations in order
   - Running `npm run migrate:down` reverts migrations in reverse order

3. **Best Practices:**
   - Always write both `up` and `down` methods
   - Keep migrations small and focused
   - Make migrations reversible when possible
   - Test migrations in development before production
   - Never modify an existing migration file after it's been committed



