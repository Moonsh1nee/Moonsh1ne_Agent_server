import mongoose from 'mongoose';

// Schema for column
const columnSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: {
    type: String,
    required: true,
    enum: ['text', 'number', 'date', 'select', 'checkbox', 'relation'],
  },
  options: [{ type: String }], // For select type
  required: { type: Boolean, default: false }, // Required field
});

// Schema for row
const rowSchema = new mongoose.Schema({
  data: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    required: true,
    validate: {
      validator: function (value) {
        const table = this.parent();
        const columnNames = table.columns.map((column) => column.name);
        const requiredColumns = table.columns
          .filter((column) => column.required)
          .map((column) => column.name);

        // Check if all keys in data are valid column names
        const dataKeys = [...value.keys()];
        const hasValidKeys = dataKeys.every((key) => columnNames.includes(key));

        // Check if all required columns are present
        const hasRequiredKeys = requiredColumns.every((key) => dataKeys.includes(key));

        return hasValidKeys && hasRequiredKeys;
      },
      message: 'Row data must match table columns and include all required fields',
    },
  },
});

// Schema for table
const tableSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true }, // Table name
  columns: {
    type: [columnSchema],
    validate: {
      validator: function (columns) {
        // Check column have name and type
        return columns.some((col) => col.name === 'name' && col.type === 'text');
      },
      message: 'Table must include a "name" column with type "text"',
    },
  },
  rows: [rowSchema],
  createdAt: { type: Date, default: Date.now, index: true },
});

// Add a pre-save hook to ensure all columns of tables have a "name" column
tableSchema.pre('save', function (next) {
  if (this.isNew) {
    const hasNameColumn = this.columns.some((col) => col.name === 'name' && col.type === 'text');
    if (!hasNameColumn) {
      this.columns.push({ name: 'name', type: 'text', required: true });
    }
  }
  next();
});

export default mongoose.model('Table', tableSchema);
