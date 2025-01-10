const up = async (queryInterface) => {
  // First add the columns without default values
  await queryInterface.query(`
    ALTER TABLE users
    ADD COLUMN display_name VARCHAR(255),
    ADD COLUMN avatar_url VARCHAR(1024),
    ADD COLUMN theme_preference VARCHAR(50) DEFAULT 'light',
    ADD COLUMN language_preference VARCHAR(10) DEFAULT 'en',
    ADD COLUMN notification_preferences JSON,
    ADD COLUMN bio TEXT;
  `);

  // Then set the default value for notification_preferences
  await queryInterface.query(`
    UPDATE users 
    SET notification_preferences = '{"email": true, "push": true}'
    WHERE notification_preferences IS NULL;
  `);
};

const down = async (queryInterface) => {
  await queryInterface.query(`
    ALTER TABLE users
    DROP COLUMN display_name,
    DROP COLUMN avatar_url,
    DROP COLUMN theme_preference,
    DROP COLUMN language_preference,
    DROP COLUMN notification_preferences,
    DROP COLUMN bio;
  `);
};

module.exports = {
  up,
  down
}; 