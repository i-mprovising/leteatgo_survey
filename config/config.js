const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  development: {
    user: "admin",
    password: process.env.DB_PASSWORD,
    database: "leteatgo",
    host: "leteatgo.cuom1ib1jx9z.ap-northeast-2.rds.amazonaws.com",
    dialect: "mysql",
    multipleStatements: true, // 여러 쿼리를 ';'를 기준으로 한번에 보낼 수 있게한다.
    dateStrings: "date",
  },
};
