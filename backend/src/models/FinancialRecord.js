const mongoose = require('mongoose');

const financialRecordSchema = new mongoose.Schema({
  amount: { type: Number, required: true, min: 0.01 },
  type: { type: String, required: true, enum: ['income', 'expense'] },
  category: { type: String, required: true, trim: true, maxlength: 50 },
  date: { type: Date, required: true, default: Date.now },
  description: { type: String, trim: true, maxlength: 500 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

financialRecordSchema.index({ date: -1 });
financialRecordSchema.index({ type: 1 });
financialRecordSchema.index({ category: 1 });

module.exports = mongoose.model('FinancialRecord', financialRecordSchema);