const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mysql = require("mysql");
const PORT = process.env.port || 8000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createConnection({
  //mysql db에 접속
  host: "localhost",
  user: "root",
  password: "1234",
  database: "reactboard",
});

db.connect((err) => {
  //db에 연결
  if (err) throw err;
  console.log("연결됨!");
});
app.get("/boardlist", (req, res) => {
  //모든 전체 게시글을 조회 요청 처리
  db.query("select * from boardlist", (err, rows, fields) => {
    res.send(rows);
  });
});
app.get(`/boardlist/:id`, (req, res) => {
  //해당 게시글의 내용 읽기 위한 처리
  db.query(`select * from boardlist where boardno=${req.params.id}`);
  //db.query(`update boardlist set viewcount + 1 where boardno=${req.params.id}`);
});

app.post("/boardWrite", (req, res) => {
  // 게시글작성을 위한 처리
  const { category, title, description, author } = req.body;
  const offset = 1000 * 60 * 60 * 9;
  let day = new Date();
  day = new Date(day.getTime() - day.getTimezoneOffset() * 60000)
    .toISOString()
    .split("T")[0];
  // let day = new Date(new Date().getTime() + offset);
  // day = day.toISOString().split("T")[0]; //작성날짜
  const sql =
    "insert into boardlist(category,title,description,author,date) values(?,?,?,?,?)";
  // console.log(req.body);
  db.query(
    sql,
    [category, title, description, author, day],
    (err, rows, fields) => {
      if (err) console.log(err);
    }
  );
});

app.delete("/boardlist/delete/:id", (req, res) => {
  // 해당 게시글 삭제 처리
  db.query(
    `delete from boardlist where boardno=${req.params.id}`,
    (err, rows, fields) => {
      if (err) console.log(err);
      res.send(rows);
    }
  );
});

app.put("/boardupdate/:id", (req, res) => {
  // 해당 게시글 수정처리
  const { id, category, title, description } = req.body;
  const sql =
    "update boardlist set category=?, title=?, description=? where boardno=?";
  db.query(sql, [category, title, description, id], (err, rows, fields) => {
    if (err) console.log(err);
    res.send(rows);
  });
});

// app.post("/search", (req, res) => {
//   // console.log(req.body);
//   const { category, searchWord } = req.body;
//   if (category === "작성자") {
//     const sql = "select * from boardlist where author=?";
//     db.query(sql, [searchWord], (err, rows) => {
//       if (err) console.log(err);
//     });
//   } else {
//     const sql = "select * from boardlist where title like ?";
//     db.query(sql, [searchWord], (err, rows) => {
//       if (err) console.log(err);
//       res.send(rows);
//     });
//   }
// });
// mysql.escape();
// app.get("/", (req, res) => {
//   const sqlQuery = "INSERT INTO requested (rowno) values (1)";
//   db.query(sqlQuery, (err, result) => {
//     if (err) {
//       res.send("에러발생");
//       console.log(err);
//     } else {
//       res.send("쿼리전달성공!");
//     }
//   });
// });
app.listen(PORT, () => {
  console.log(`running on port ${PORT}`);
});
// db.connect((err) => {
//     if(err) throw err;
//     console.log('db연결됨')
// })
