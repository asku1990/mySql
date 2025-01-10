const up = async (queryInterface) => {
  await queryInterface.query(`
    CREATE TABLE IF NOT EXISTS jobs (
      id INT PRIMARY KEY AUTO_INCREMENT,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      company VARCHAR(255) NOT NULL,
      location VARCHAR(255),
      salary_range VARCHAR(100),
      job_type ENUM('FULL_TIME', 'PART_TIME', 'CONTRACT', 'FREELANCE') NOT NULL,
      experience_level VARCHAR(50),
      posted_by_user_id INT NOT NULL,
      status ENUM('OPEN', 'CLOSED', 'DRAFT') DEFAULT 'DRAFT',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (posted_by_user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);
};

const down = async (queryInterface) => {
  await queryInterface.query(`
    DROP TABLE IF EXISTS jobs;
  `);
};

module.exports = {
  up,
  down
}; 