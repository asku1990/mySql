const up = `
  INSERT INTO users (username, email, password_hash) VALUES 
    ('admin', 'admin@example.com', 'hashed_password_1'),
    ('user1', 'user1@example.com', 'hashed_password_2'),
    ('user2', 'user2@example.com', 'hashed_password_3');
`;

const down = `
  DELETE FROM users 
  WHERE username IN ('admin', 'user1', 'user2');
`;

module.exports = {
  up,
  down
}; 