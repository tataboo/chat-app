const express = require('express');
const router = express.Router();
const pool = require('../dbConnection');

router.post('/', async (req, res, next) => {
  try {
    const boardId = req.body.id;
    const query = 'DELETE FROM board WHERE board_id = $1';

    const client = await pool.connect();
    await client.query(query, [boardId]);

    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('内部サーバーエラー');
  }
});

module.exports = router;