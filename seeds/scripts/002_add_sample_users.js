module.exports = {
  up: async (queryInterface) => {
    await queryInterface.query(`
      INSERT INTO users (username, email, password_hash) VALUES 
        ('admin2', 'admin2@example.com', 'hashed_password_4'),
        ('user5', 'user5@example.com', 'hashed_password_5'),
        ('user6', 'user6@example.com', 'hashed_password_6');
    `);
  },
  down: async (queryInterface) => {
    await queryInterface.query(`
      DELETE FROM users 
      WHERE username IN ('admin2', 'user5', 'user6');
    `);
  }
}; 