const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../dbConnection');

router.get('/', function (req, res, next) {
  if (req.session.user_id) {
    res.redirect('/');
  } else {
    res.render('login', {
      title: 'ログイン'
    });
  }
});

router.post('/', async function (req, res, next) {
  try {
    const email = req.body.email;
    const password = req.body.password;

    // パスワードのハッシュをデータベースから取得
    const query = 'SELECT user_id, password FROM users WHERE email = $1 LIMIT 1';
    const client = await pool.connect();
    const result = await client.query(query, [email]);

    if (result.rows.length > 0) {
      const user = result.rows[0];
      const userId = user.user_id;

      // パスワードの比較
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        req.session.user_id = userId;
        res.redirect('/');
      } else {
        res.render('login', {
          title: 'ログイン',
          noUser: 'メールアドレスとパスワードが一致するユーザーはいません'
        });
      }
    } else {
      res.render('login', {
        title: 'ログイン',
        noUser: 'メールアドレスとパスワードが一致するユーザーはいません'
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('内部サーバーエラー');
  }
});

module.exports = router;
