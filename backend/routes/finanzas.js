const express = require('express');
const router = express.Router();
const Finanza = require('../models/Finanza');
const Gasto = require('../models/Gasto');

// Obtener saldo actual
router.get('/saldo', async (req, res) => {
  let finanza = await Finanza.findOne();
  if (!finanza) finanza = await Finanza.create({ saldo: 0 });
  res.json({ saldo: finanza.saldo });
});

// Sumar aportación pagada
router.post('/sumar', async (req, res) => {
  const { monto } = req.body;
  let finanza = await Finanza.findOne();
  if (!finanza) finanza = await Finanza.create({ saldo: 0 });
  finanza.saldo += monto;
  await finanza.save();
  res.json({ saldo: finanza.saldo });
});

// Obtener gastos
router.get('/gastos', async (req, res) => {
  const gastos = await Gasto.find().sort({ fecha: -1 });
  res.json(gastos.map(g => ({
    descripcion: g.descripcion,
    monto: g.monto,
    fecha: g.fecha.toISOString().split('T')[0]
  })));
});

// Registrar gasto
router.post('/gastar', async (req, res) => {
  const { descripcion, monto } = req.body;
  if (!descripcion || !monto) return res.status(400).json({ mensaje: 'Datos incompletos' });
  let finanza = await Finanza.findOne();
  if (!finanza) finanza = await Finanza.create({ saldo: 0 });
  finanza.saldo -= Number(monto);
  await finanza.save();
  await Gasto.create({ descripcion, monto: Number(monto) });
  res.json({ saldo: finanza.saldo });
});

module.exports = router;