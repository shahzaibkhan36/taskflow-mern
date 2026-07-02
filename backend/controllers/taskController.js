const Task = require('../models/Task');
const Board = require('../models/Board');

const checkBoardAccess = async (boardId, userId) => {
  const board = await Board.findById(boardId);
  if (!board) return null;
  const authorized = board.owner.equals(userId) || board.members.some((m) => m.equals(userId));
  return authorized ? board : false;
};

// @desc   Create task
// @route  POST /api/tasks
const createTask = async (req, res, next) => {
  try {
    const { title, description, board, columnId, priority, deadline, assignees, labels } = req.body;

    if (!title || !title.trim()) return res.status(400).json({ message: 'Task title is required' });
    if (!board || !columnId) return res.status(400).json({ message: 'Board and column are required' });

    const access = await checkBoardAccess(board, req.user._id);
    if (!access) return res.status(403).json({ message: 'Not authorized for this board' });

    const count = await Task.countDocuments({ board, columnId });

    const task = await Task.create({
      title: title.trim(),
      description: description?.trim() || '',
      board,
      columnId,
      order: count,
      priority: priority || 'medium',
      deadline: deadline || null,
      assignees: assignees || [],
      labels: labels || [],
      createdBy: req.user._id,
    });

    const populated = await Task.findById(task._id)
      .populate('assignees', 'name email avatarColor')
      .populate('createdBy', 'name email avatarColor');

    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
};

// @desc   Update task fields
// @route  PUT /api/tasks/:id
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const access = await checkBoardAccess(task.board, req.user._id);
    if (!access) return res.status(403).json({ message: 'Not authorized for this board' });

    const allowedFields = ['title', 'description', 'priority', 'deadline', 'assignees', 'labels'];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) task[field] = req.body[field];
    });

    await task.save();
    const populated = await Task.findById(task._id)
      .populate('assignees', 'name email avatarColor')
      .populate('createdBy', 'name email avatarColor');

    res.json(populated);
  } catch (err) {
    next(err);
  }
};

// @desc   Move/reorder task (drag and drop)
// @route  PATCH /api/tasks/:id/move
const moveTask = async (req, res, next) => {
  try {
    const { columnId, order } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const access = await checkBoardAccess(task.board, req.user._id);
    if (!access) return res.status(403).json({ message: 'Not authorized for this board' });

    const sourceColumn = task.columnId;
    const targetColumn = columnId ?? sourceColumn;
    const targetOrder = order ?? task.order;

    if (sourceColumn === targetColumn) {
      // Reordering within same column
      if (targetOrder > task.order) {
        await Task.updateMany(
          { board: task.board, columnId: targetColumn, order: { $gt: task.order, $lte: targetOrder } },
          { $inc: { order: -1 } }
        );
      } else if (targetOrder < task.order) {
        await Task.updateMany(
          { board: task.board, columnId: targetColumn, order: { $gte: targetOrder, $lt: task.order } },
          { $inc: { order: 1 } }
        );
      }
    } else {
      // Moving to a different column
      await Task.updateMany(
        { board: task.board, columnId: sourceColumn, order: { $gt: task.order } },
        { $inc: { order: -1 } }
      );
      await Task.updateMany(
        { board: task.board, columnId: targetColumn, order: { $gte: targetOrder } },
        { $inc: { order: 1 } }
      );
    }

    task.columnId = targetColumn;
    task.order = targetOrder;
    await task.save();

    res.json(task);
  } catch (err) {
    next(err);
  }
};

// @desc   Delete task
// @route  DELETE /api/tasks/:id
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const access = await checkBoardAccess(task.board, req.user._id);
    if (!access) return res.status(403).json({ message: 'Not authorized for this board' });

    await Task.updateMany(
      { board: task.board, columnId: task.columnId, order: { $gt: task.order } },
      { $inc: { order: -1 } }
    );
    await task.deleteOne();

    res.json({ message: 'Task deleted successfully', _id: req.params.id });
  } catch (err) {
    next(err);
  }
};

module.exports = { createTask, updateTask, moveTask, deleteTask };
