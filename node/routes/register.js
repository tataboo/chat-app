const express = require('express');
const router = express.Router();
const moment = require('moment');
const bcrypt = require('bcrypt');
const pool = require('../dbConnection');

router.get('/', function (req, res, next) {
  res.render('register', {
    title: '新規会員登録'
  });
});

router.post('/', async function (req, res, next) {
  try {
    const userName = req.body.user_name;
    const email = req.body.email;
    const password = req.body.password;
    const createdAt = moment().format('YYYY-MM-DD HH:mm:ss');

    const emailExistsQuery = 'SELECT * FROM users WHERE email = $1 LIMIT 1';
    const registerQuery = 'INSERT INTO users (user_name, email, password, created_at) VALUES ($1, $2, $3, $4)';

    const client = await pool.connect();

    // 既に登録されているメールアドレスかどうかを確認
    const emailExists = await client.query(emailExistsQuery, [email]);

    if (emailExists.rows.length) {
      res.render('register', {
        title: '新規会員登録',
        emailExists: '既に登録されているメールアドレスです'
      });
    } else {
      // パスワードのハッシュ化
      const hashedPassword = await bcrypt.hash(password, 10);

      // ユーザーの新規登録
      await client.query(registerQuery, [userName, email, hashedPassword, createdAt]);

      res.redirect('/login');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('内部サーバーエラー');
  }
});

module.exports = router;
