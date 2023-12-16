const express = require('express');
const router = express.Router();
const moment = require('moment');
const pool = require('../dbConnection');

router.get('/:board_id', async (req, res, next) => {
  try {
    const boardId = req.params.board_id;
    const getBoardQuery = 'SELECT * FROM board WHERE board_id = $1';
    const getMessagesQuery = 'SELECT M.message, COALESCE(U.user_name, \'名無し\') AS user_name, TO_CHAR(M.created_at, \'YYYY年MM月DD日 HH24時MI分SS秒\') AS created_at FROM messages M LEFT OUTER JOIN users U ON M.user_id = U.user_id WHERE M.board_id = $1 ORDER BY M.created_at ASC';

    const client = await pool.connect();
    const boardResult = await client.query(getBoardQuery, [boardId]);
    const messagesResult = await client.query(getMessagesQuery, [boardId]);

    if (boardResult.rows.length === 0) {
      // ボードが見つからない場合の処理
      return res.status(404).send('ボードが見つかりません');
    }

    res.render('boards', {
      title: boardResult.rows[0].title,
      board: boardResult.rows[0],
      messageList: messagesResult.rows
    });

  } catch (error) {
    console.error(error);
    res.status(500).send('内部サーバーエラー');
  }
});

router.post('/:board_id', async (req, res, next) => {
  try {
    const message = req.body.message;
    const boardId = req.params.board_id;
    const userId = req.session.user_id || 0;
    const createdAt = moment().format('YYYY-MM-DD HH:mm:ss');

    const insertQuery = 'INSERT INTO messages (message, board_id, user_id, created_at) VALUES ($1, $2, $3, $4)';
    const client = await pool.connect();

    await client.query(insertQuery, [message, boardId, userId, createdAt]);

    res.redirect('/boards/' + boardId);
  } catch (error) {
    console.error(error);
    res.status(500).send('内部サーバーエラー');
  }
});

module.exports = router;
