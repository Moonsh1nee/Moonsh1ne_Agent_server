import express from 'express';
import Table from '../models/table.js';

const router = express.Router();

// Create a new table
router.post('/tables', async (req, res) => {
  const { name, columns } = req.body;
  if (!name || !columns || !Array.isArray(columns)) {
    return res.status(400).json({ error: 'Name and columns array are required' });
  }
  if (!columns.every((col) => col.name && col.type)) {
    return res.status(400).json({ error: 'Columns must have name and type' });
  }

  try {
    const table = new Table({ name, columns });
    await table.save();
    res.status(201).json(table);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a element to a table row
router.post('/tables/:tableId/rows', async (req, res) => {
  const { tableId } = req.params;
  const { data } = req.body;

  if (!data || typeof data !== 'object') {
    return res.status(400).json({ error: 'Data object is required' });
  }

  try {
    const table = await Table.findById(tableId);
    if (!table) return res.status(404).json({ error: 'Table not found' });

    table.rows.push({ data });
    await table.save();
    res.status(201).json(table);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a column from a table
router.patch('/tables/:tableId/columns', async (req, res) => {
  const { tableId } = req.params;
  const { columnName } = req.body;

  if (!columnName) {
    return res.status(400).json({ error: 'Column name is required' });
  }

  try {
    const table = await Table.findById(tableId);
    if (!table) return res.status(404).json({ error: 'Table not found' });

    // Check if column exists
    const columnExists = table.columns.some((col) => col.name === columnName);
    if (!columnExists) {
      return res.status(404).json({ error: 'Column not found' });
    }

    // Remove column from columns array and data from rows
    table.columns = table.columns.filter((col) => col.name !== columnName);
    table.rows = table.rows.map((row) => {
      const newData = { ...row.data };
      delete newData[columnName];
      return { data: newData };
    });

    await table.save();
    res.json(table);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all tables
router.get('/tables', async (req, res) => {
  const { limit = 10, skip = 0 } = req.query;

  try {
    const tables = await Table.find()
      .sort({ createdAt: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit));
    const total = await Table.countDocuments();

    res.json({ data: tables, total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
