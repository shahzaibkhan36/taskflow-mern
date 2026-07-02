const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true, maxlength: 50 },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: { type: String, required: [true, 'Password is required'], minlength: 6, select: false },
    avatarColor: { type: String, default: () => randomColor() },
    avatar: { type: String, default: null }, // base64 image string
    bio: { type: String, maxlength: 200, default: '' },
  },
  { timestamps: true }
);

function randomColor() {
  const colors = ['#6366F1', '#0EA5E9', '#F59E0B', '#EC4899', '#10B981', '#8B5CF6', '#EF4444', '#F97316'];
  return colors[Math.floor(Math.random() * colors.length)];
}

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model('User', userSchema);
