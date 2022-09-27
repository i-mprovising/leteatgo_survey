const express = require("express"); // 기본 양식 const = 변수선언
const httpd = require("http");
const app = express(); // 기본 양식
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs"); //ejs 사용 양식
const methodOverride = require("method-override"); //PUT 메소드 사용
app.use(methodOverride("_method")); //PUT 메소드 사용
const crypto = require("crypto");
require("dotenv").config();
const moment = require("moment"); // moment method
const { query } = require("express");

app.use("/public", express.static("public")); //static 파일(css) 보관하기 위해 public폴더를 쓸 것이다

const mysql = require("mysql");
var db_info = {
  host: "leteatgo.cuom1ib1jx9z.ap-northeast-2.rds.amazonaws.com", // 호스트 주소
  port: process.env.PORT,
  user: "admin", // mysql user
  password: process.env.DB_PASSWORD, // mysql password
  database: "develop", // mysql 데이터베이스
  multipleStatements: true,
};

app.listen(8880, function () {
  console.log("listening on 8880");
});

app.get("/survey", function (req, res) {
  const qry = req.query;
  console.log(req);
  const id = parseInt(qry.id);
  if (!id) {
    res.render("survey.ejs");
  } else if (id >= 1 && id <= 5) {
    var sqlConn = mysql.createConnection(db_info);
    sqlConn.connect();
    var start = 12 * (id - 1);
    var sql = "select foodid, name, image from food LIMIT " + start + ",12";
    //db에서 랜덤으로 받아오는 부분
    var chkdat = "";
    if (id == 1) {
      qry.qdat = qry.sex;
    } else {
      for (var i = 0; i < qry.chk.length; i++) chkdat += ":" + qry.chk[i];
    }
    sqlConn.query(sql, function (err, results, fields) {
      if (err) {
        console.log(err);
      }
      res.render("select.ejs", {
        id: id,
        qdat: qry.qdat + chkdat,
        postList: results,
      });
    });

    sqlConn.end();
  } else if (id == 6) {
    //데이터 :로 분할하고 db저장
    res.render("goodbye.ejs");
  }
});
