import mongoose from 'mongoose';

const columnSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true, enum: ['text', 'number', 'date', 'select'] },
  options: [{ type: String }],
});

const rowSchema = new mongoose.Schema({
  data: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    required: true,
    validate: {
      validator: function (value) {
        const table = this.parent();
        const columnNames = table.columns.map((column) => column.name);
        return [...value.keys()].every((key) => columnNames.includes(key));
      },
      message: 'Invalid column name in row data',
    },
  },
});

const tableSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  columns: [columnSchema],
  rows: [rowSchema],
  createdAt: { type: Date, default: Date.now, index: true },
});

export default mongoose.model('Table', tableSchema);
