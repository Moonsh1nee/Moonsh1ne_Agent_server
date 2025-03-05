import mongoose from 'mongoose';

const columnSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true, enum: ['text', 'number', 'date', 'select'] },
  options: [String],
});

const rowSchema = new mongoose.Schema({
  data: mongoose.Schema.Types.Mixed,
});

const tableSchema = new mongoose.Schema({
  name: { type: String, required: true },
  columns: [columnSchema],
  rows: [rowSchema],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Table', tableSchema);
