const express = require('express');
const router = express.Router();
const pool = require('../dbConnection');

router.post('/', async function (req, res, next) {
  try {
    const boardId = req.body.id;
    const query = 'SELECT board_id, title FROM board WHERE board_id = $1';
    const client = await pool.connect();

    const result = await client.query(query, [boardId]);

    if (result.rows.length > 0) {
      const board = result.rows[0];
      res.render('update', {
        id: board.board_id,
        title: board.title,
      });
    } else {
      res.status(404).send('ボードが見つかりません');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('内部サーバーエラー');
  }
});

module.exports = router;
