const express = require('express');
const {
  getBoards, getBoard, createBoard, updateBoard,
  addMember, updateMemberRole, removeMember, deleteBoard
} = require('../controllers/boardController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();
router.use(protect);

router.route('/').get(getBoards).post(createBoard);
router.route('/:id').get(getBoard).put(updateBoard).delete(deleteBoard);
router.post('/:id/members', addMember);
router.put('/:id/members/:userId', updateMemberRole);
router.delete('/:id/members/:userId', removeMember);

module.exports = router;
