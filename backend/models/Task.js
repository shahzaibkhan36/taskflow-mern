const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, trim: true, maxlength: 2000, default: '' },
    board: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true },
    columnId: { type: String, required: true },
    order: { type: Number, required: true, default: 0 },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    deadline: { type: Date, default: null },
    assignees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    labels: [{ type: String, trim: true }],
  },
  { timestamps: true }
);

taskSchema.index({ board: 1, columnId: 1, order: 1 });

module.exports = mongoose.model('Task', taskSchema);
