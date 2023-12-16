const express = require('express');
const router = express.Router();
const moment = require('moment');
const pool = require('../dbConnection');

router.get('/', async (req, res, next) => {
  try {
    const query = 'SELECT B.board_id, B.user_id, B.title, COALESCE(U.user_name, \'名無し\') AS user_name, TO_CHAR(B.created_at, \'YYYY年MM月DD日 HH24時MI分SS秒\') AS created_at FROM board B LEFT OUTER JOIN users U ON B.user_id = U.user_id ORDER BY B.created_at DESC';

    const client = await pool.connect();
    const result = await client.query(query);

    res.render('index', {
      title: 'はじめてのNode.js',
      boardList: result.rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('内部サーバーエラー');
  }
});

router.post('/', async (req, res, next) => {
  try {
    const id = req.body.id;
    const update = req.body.update;
    const title = req.body.title;
    const userId = req.session.user_id || 0;
    const createdAt = moment().format('YYYY-MM-DD HH:mm:ss');

    const insertQuery = 'INSERT INTO board (user_id, title, created_at) VALUES ($1, $2, $3)';
    const updateQuery = 'UPDATE board SET title = $1 WHERE board_id = $2';

    const client = await pool.connect();

    if (!update) {
      await client.query(insertQuery, [userId, title, createdAt]);
    } else {
      await client.query(updateQuery, [title, id]);
    }

    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('内部サーバーエラー');
  }
});

module.exports = router;