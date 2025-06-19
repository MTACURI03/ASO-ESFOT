const express = require('express');
const router = express.Router();
const Plan = require('../models/Plan');

// Obtener todos los planes
router.get('/', async (req, res) => {
  const planes = await Plan.find();
  res.json(planes);
});

// Crear un plan
router.post('/', async (req, res) => {
  const { titulo, beneficios, imagen, precio } = req.body;
  const plan = new Plan({ titulo, beneficios, imagen, precio });
  await plan.save();
  res.json(plan);
});

// Actualizar un plan
router.put('/:id', async (req, res) => {
  const { titulo, beneficios, imagen, precio } = req.body;
  const plan = await Plan.findByIdAndUpdate(
    req.params.id,
    { titulo, beneficios, imagen, precio },
    { new: true }
  );
  res.json(plan);
});

// Eliminar un plan
router.delete('/:id', async (req, res) => {
  await Plan.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

module.exports = router;