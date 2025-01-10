module.exports = {
  up: async (queryInterface) => {
    await queryInterface.query(`
      INSERT INTO users (username, email, password_hash) VALUES 
        ('admin', 'admin@example.com', 'hashed_password_1'),
        ('user1', 'user1@example.com', 'hashed_password_2'),
        ('user2', 'user2@example.com', 'hashed_password_3');
    `);
  },
  down: async (queryInterface) => {
    await queryInterface.query(`
      DELETE FROM users 
      WHERE username IN ('admin', 'user1', 'user2');
    `);
  }
}; 