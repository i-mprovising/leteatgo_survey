const express = require("express"); // 기본 양식 const = 변수선언
const app = express(); // 기본 양식
app.use(express.urlencoded({ extended: true }));
const MongoClient = require("mongodb").MongoClient; //npm install mongodb
app.set("view engine", "ejs"); //ejs 사용 양식
const methodOverride = require("method-override"); //PUT 메소드 사용
app.use(methodOverride("_method")); //PUT 메소드 사용
const crypto = require("crypto");
require("dotenv").config();
const moment = require("moment"); // moment method
const { query } = require("express");

const createHashedPassword = (password) => {
  return crypto.createHash("sha512").update(password).digest("base64");
};

app.use("/public", express.static("public")); //static 파일(css) 보관하기 위해 public폴더를 쓸 것이다

var mysql = require("mysql");
var connection = mysql.createConnection({
  host: "leteatgo.cuom1ib1jx9z.ap-northeast-2.rds.amazonaws.com", // 호스트 주소
  user: "admin", // mysql user
  password: process.env.DB_PASSWORD, // mysql password
  database: "leteatgo", // mysql 데이터베이스
});
connection.connect();

app.listen(process.env.PORT, function () {
  console.log("listening on 3306");
});

var logcheck = 0;
app.get("/survey", function (req, res) {
  if (!req.query.id) {
    res.render("survey.ejs");
  } else if (req.query.id == "1") {
    res.render("select.ejs", {
      id: "2",
      qdat: req.query.sex,
    });
  } else if (req.query.id == "2") {
    var seldat = "222:333:444:555";

    res.render("select.ejs", {
      id: "3",
      qdat: res.query.qdat + ":" + seldat,
    });
  }
});

app.get("/goodbye", function (req, res) {
  res.render("goodbye.ejs");
});
