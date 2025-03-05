import express from 'express';
import Table from '../models/table.js';

const router = express.Router();

// Создание новой таблицы
router.post('/tables', async (req, res) => {
  const { name, columns } = req.body;
  if (!name || !columns || !Array.isArray(columns)) {
    return res.status(400).json({ error: 'Name and columns array are required' });
  }

  try {
    const table = new Table({ name, columns });
    await table.save();
    res.status(201).json(table);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Добавление строки
router.post('/tables/:tableId/rows', async (req, res) => {
  const { tableId } = req.params;
  const { data } = req.body;

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

// Удаление столбца
router.patch('/tables/:tableId/columns', async (req, res) => {
  const { tableId } = req.params;
  const { columnName } = req.body;

  try {
    const table = await Table.findById(tableId);
    if (!table) return res.status(404).json({ error: 'Table not found' });

    // Удаляем столбец из метаданных
    table.columns = table.columns.filter((col) => col.name !== columnName);

    // Фильтруем данные в rows, удаляя указанный ключ
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

export default router;
