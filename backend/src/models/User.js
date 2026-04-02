const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 50 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'] },
  password: { type: String, required: true, minlength: 6, select: false },
  role: { type: String, enum: ['viewer', 'analyst', 'admin'], default: 'viewer' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.set('toJSON', { transform: (doc, ret) => { delete ret.password; return ret; } });

module.exports = mongoose.model('User', userSchema);