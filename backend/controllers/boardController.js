const Board = require('../models/Board');
const Task = require('../models/Task');

const defaultColumns = [
  { id: 'todo', title: 'To Do', order: 0 },
  { id: 'inprogress', title: 'In Progress', order: 1 },
  { id: 'review', title: 'In Review', order: 2 },
  { id: 'done', title: 'Done', order: 3 },
];

const getUserRole = (board, userId) => {
  if (board.owner._id.equals(userId) || board.owner.equals?.(userId)) return 'owner';
  const member = board.members.find((m) => m.user._id?.equals(userId) || m.user.equals?.(userId));
  return member ? member.role : null;
};

// @desc   Get all boards for logged-in user
// @route  GET /api/boards
const getBoards = async (req, res, next) => {
  try {
    const boards = await Board.find({
      $or: [{ owner: req.user._id }, { 'members.user': req.user._id }],
    })
      .populate('owner', 'name email avatarColor avatar')
      .populate('members.user', 'name email avatarColor avatar')
      .sort({ updatedAt: -1 });
    res.json(boards);
  } catch (err) { next(err); }
};

// @desc   Get single board with tasks
// @route  GET /api/boards/:id
const getBoard = async (req, res, next) => {
  try {
    const board = await Board.findById(req.params.id)
      .populate('owner', 'name email avatarColor avatar')
      .populate('members.user', 'name email avatarColor avatar');

    if (!board) return res.status(404).json({ message: 'Board not found' });

    const role = getUserRole(board, req.user._id);
    if (!role) return res.status(403).json({ message: 'Not authorized to view this board' });

    const tasks = await Task.find({ board: board._id })
      .populate('assignees', 'name email avatarColor avatar')
      .populate('createdBy', 'name email avatarColor avatar')
      .sort({ order: 1 });

    res.json({ board, tasks, myRole: role });
  } catch (err) { next(err); }
};

// @desc   Create board
// @route  POST /api/boards
const createBoard = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    if (!title?.trim()) return res.status(400).json({ message: 'Board title is required' });

    const board = await Board.create({
      title: title.trim(),
      description: description?.trim() || '',
      owner: req.user._id,
      members: [],
      columns: defaultColumns,
    });
    const populated = await board.populate('owner', 'name email avatarColor avatar');
    res.status(201).json(populated);
  } catch (err) { next(err); }
};

// @desc   Update board title/description (owner or admin)
// @route  PUT /api/boards/:id
const updateBoard = async (req, res, next) => {
  try {
    const board = await Board.findById(req.params.id);
    if (!board) return res.status(404).json({ message: 'Board not found' });
    const role = getUserRole(board, req.user._id);
    if (role !== 'owner' && role !== 'admin')
      return res.status(403).json({ message: 'Only admins can edit this board' });

    const { title, description } = req.body;
    if (title !== undefined) board.title = title.trim();
    if (description !== undefined) board.description = description.trim();
    await board.save();
    await board.populate(['owner', 'members.user']);
    res.json(board);
  } catch (err) { next(err); }
};

// @desc   Add member to board (owner or admin)
// @route  POST /api/boards/:id/members
const addMember = async (req, res, next) => {
  try {
    const { userId, role = 'member' } = req.body;
    if (!userId) return res.status(400).json({ message: 'userId is required' });

    const board = await Board.findById(req.params.id);
    if (!board) return res.status(404).json({ message: 'Board not found' });

    const myRole = getUserRole(board, req.user._id);
    if (myRole !== 'owner' && myRole !== 'admin')
      return res.status(403).json({ message: 'Only admins can add members' });

    if (board.owner.equals(userId))
      return res.status(400).json({ message: 'This user is already the board owner' });

    const already = board.members.find((m) => m.user.equals(userId));
    if (already) return res.status(400).json({ message: 'User is already a member of this board' });

    if (!['admin', 'member'].includes(role))
      return res.status(400).json({ message: 'Role must be admin or member' });

    board.members.push({ user: userId, role });
    await board.save();
    await board.populate('members.user', 'name email avatarColor avatar');
    res.json(board.members);
  } catch (err) { next(err); }
};

// @desc   Update member role (owner only)
// @route  PUT /api/boards/:id/members/:userId
const updateMemberRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const board = await Board.findById(req.params.id);
    if (!board) return res.status(404).json({ message: 'Board not found' });

    if (!board.owner.equals(req.user._id))
      return res.status(403).json({ message: 'Only the board owner can change member roles' });

    const member = board.members.find((m) => m.user.equals(req.params.userId));
    if (!member) return res.status(404).json({ message: 'Member not found on this board' });

    if (!['admin', 'member'].includes(role))
      return res.status(400).json({ message: 'Role must be admin or member' });

    member.role = role;
    await board.save();
    await board.populate('members.user', 'name email avatarColor avatar');
    res.json(board.members);
  } catch (err) { next(err); }
};

// @desc   Remove member (owner, admin, or self-leave)
// @route  DELETE /api/boards/:id/members/:userId
const removeMember = async (req, res, next) => {
  try {
    const board = await Board.findById(req.params.id);
    if (!board) return res.status(404).json({ message: 'Board not found' });

    const myRole = getUserRole(board, req.user._id);
    const isSelf = req.params.userId === req.user._id.toString();

    if (!isSelf && myRole !== 'owner' && myRole !== 'admin')
      return res.status(403).json({ message: 'Not authorized to remove members' });

    if (board.owner.equals(req.params.userId))
      return res.status(400).json({ message: 'Cannot remove the board owner' });

    board.members = board.members.filter((m) => !m.user.equals(req.params.userId));
    await board.save();
    res.json({ message: 'Member removed', userId: req.params.userId });
  } catch (err) { next(err); }
};

// @desc   Delete board (owner only)
// @route  DELETE /api/boards/:id
const deleteBoard = async (req, res, next) => {
  try {
    const board = await Board.findById(req.params.id);
    if (!board) return res.status(404).json({ message: 'Board not found' });
    if (!board.owner.equals(req.user._id))
      return res.status(403).json({ message: 'Only the board owner can delete this board' });

    await Task.deleteMany({ board: board._id });
    await board.deleteOne();
    res.json({ message: 'Board deleted', _id: req.params.id });
  } catch (err) { next(err); }
};

module.exports = { getBoards, getBoard, createBoard, updateBoard, addMember, updateMemberRole, removeMember, deleteBoard };
