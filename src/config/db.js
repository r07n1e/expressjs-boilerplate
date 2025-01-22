require("dotenv").config();
const { Sequelize } = require("sequelize");

const db = new Sequelize(
  `${process.env.DB_CONNECTION}://${process.env.DB_USER}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`
);

const db_connection = async () => {
  await db
    .authenticate()
    .then(() => {
      console.log("Connection has been established successfully.");
    })
    .catch((err) => {
      console.error("Unable to connect to the database:", err);
    });

  await db
    .sync()
    .then(() => {
      console.log("Database & tables created!");
    })
    .catch((err) => {
      console.error("Error creating tables:", err);
    });
};

module.exports = {
  db,
  db_connection,
};
