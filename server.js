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

var foodArr;
var sqlConn = mysql.createConnection(db_info);

const promise = new Promise((resolve, reject) => {
  sqlConn.connect();
  sqlConn.query("SELECT foodid, name, image FROM food ORDER BY RAND() LIMIT 60", // 랜덤으로 60개 받아오기
    function (err, results) {
      if (err) console.log(err + "this is error");
      foodArr = results;
      if(foodArr){
        resolve();
      }
      else{
        reject();
      }
      
    }
  );
});

app.get("/survey", function (req, res) {
  promise
  .then(()=>{
    res.render("survey.ejs");
  })
  .catch((err)=>{
    console.error(err);
  })
});

app.post("/survey/select", function (req, res) {
  const qry = req.body;
  const id = parseInt(qry.id);
  if (id >= 1 && id <= 5) {
    var chkdat = "";
    if (id > 1 && qry.chk) {
      if (!Array.isArray(qry.chk)) qry.chk = [qry.chk];
      for (var i = 0; i < qry.chk.length; i++) chkdat += ":" + qry.chk[i];
    }
    var foodList = foodArr.slice((id - 1) * 12, id * 12); //12개씩 복사
    res.render("select.ejs", {
      id: id,
      qdat: qry.qdat + chkdat,
      postList: foodList,
    });
    //    console.log(qry);
    //    console.log("qdat=" + qry.qdat + chkdat);
  } else if (id == 6) {
    //데이터 :로 분할하고 db저장
    var chkdat = "";
    if (id > 1 && qry.chk) {
      if (!Array.isArray(qry.chk)) qry.chk = [qry.chk];
      for (var i = 0; i < qry.chk.length; i++) chkdat += ":" + qry.chk[i];
    }
    //console.log("chdkat ",chkdat);
    qry.qdat += chkdat;
    //console.log("datARR: ",qry.qdat);
    var datArr = qry.qdat.split(":");
    var sex = datArr[0];
    var chkd_list = qry.qdat.substr(2); //qry.qdat.substr(qry.qdat.indexOf(":") + 1);
    var notchkd_list = "";
    for (var i = 0; i < foodArr.length; i++) {
      var ch = 0;
      for (var j = 1; j < datArr.length; j++) {
        if (foodArr[i].foodid == datArr[j]) {
          ch = 1;
          break;
        }
      }
      if (ch == 0) {
        notchkd_list += ":" + foodArr[i].foodid;
      }
    }
    notchkd_list = notchkd_list.substr(1);
    //console.log("sex =" + sex + " chkd_list =" + chkd_list, " notchkd_list =" + notchkd_list);

    const sql =
      "insert into eval (user_id, sex, chkd, not_chkd) values(0, b?, ?, ?)";
    sqlConn.query(sql, [sex, chkd_list, notchkd_list], function (err, result) {
      if (err) throw err;
      res.redirect("/survey/finish");
    });
    console.log("save!!!!!!!!!!!");
  }
});

app.get("/survey/finish", function (req, res) {
  res.render("goodbye.ejs");
});
