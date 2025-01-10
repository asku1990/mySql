# mySql
Testing sgl migrations
# MySQL Database Migration Tool

A simple Node.js tool for managing MySQL database migrations.

## Features

- Easy migration management
- JavaScript-based scripts
- Supports rollbacks to specific versions
- Seed data management

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

- **To rollback all migrations:**

  ```bash
  npm run migrate:down
  ```

- **To rollback to a specific version:**

  ```bash
  npm run migrate:rollback -- 001
  ```
  This will keep version 001 and roll back everything after it.

### Migration Examples

1. **Creating a new table:**

   ```javascript
   // migrations/scripts/001_create_users_table.js
   module.exports = {
       up: async (queryInterface) => {
           await queryInterface.query(`
               CREATE TABLE users (
                   id INT PRIMARY KEY AUTO_INCREMENT,
                   name VARCHAR(255)
               )
           `);
       },
       down: async (queryInterface) => {
           await queryInterface.query('DROP TABLE users');
       }
   };
   ```

2. **Adding columns:**

   ```javascript
   // migrations/scripts/002_add_user_email.js
   module.exports = {
       up: async (queryInterface) => {
           await queryInterface.query(`
               ALTER TABLE users
               ADD COLUMN email VARCHAR(255)
           `);
       },
       down: async (queryInterface) => {
           await queryInterface.query(`
               ALTER TABLE users
               DROP COLUMN email
           `);
       }
   };
   ```

### Understanding Rollbacks

The migration system supports three types of operations:

1. **Full Migration (up)**

   ```bash
   npm run migrate
   ```
   - Runs all pending migrations in order
   - Updates migrations table to track applied migrations

2. **Full Rollback (down)**

   ```bash
   npm run migrate:down
   ```
   - Rolls back all migrations in reverse order
   - Removes entries from migrations table

3. **Partial Rollback (to specific version)**

   ```bash
   npm run migrate:rollback -- 001
   ```
   - Keeps the specified version (e.g., 001)
   - Rolls back all migrations after that version
   - Useful for reverting to a known good state

### Best Practices

1. **Migration Naming:**

   - Use sequential numbering (001, 002, etc.)
   - Include descriptive names
   - Example: `001_create_users_table.js`

2. **Writing Migrations:**

   - Always include both `up` and `down` methods
   - Make migrations atomic (one focused change)
   - Test rollbacks in development
   - Don't modify existing migrations after deployment

3. **Rollback Safety:**

   - Always backup database before rolling back in production
   - Test rollback procedures in development
   - Consider data preservation when writing `down` migrations

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



