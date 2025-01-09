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
       up: async (connection) => {
           // Migration code
       },
       down: async (connection) => {
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
  npm run migrate:rollback
  ```

## Project Structure
