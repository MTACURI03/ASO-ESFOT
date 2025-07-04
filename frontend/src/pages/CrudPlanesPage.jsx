import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CrudPlanesPage = () => {
  const [planes, setPlanes] = useState([]);
  const [form, setForm] = useState({
    titulo: '',
    beneficios: '',
    imagen: '',
    precio: ''
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetch('https://aso-esfot-backend.onrender.com/api/planescrud')
      .then(res => res.json())
      .then(data => setPlanes(data));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const beneficiosArray = form.beneficios.split(',').map(item => item.trim());
    const planData = {
      titulo: form.titulo,
      beneficios: beneficiosArray,
      imagen: form.imagen,
      precio: Number(form.precio)
    };

    if (editId) {
      await fetch(`https://aso-esfot-backend.onrender.com/api/planescrud/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(planData)
      });
    } else {
      await fetch('https://aso-esfot-backend.onrender.com/api/planescrud', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(planData)
      });
    }

    fetch('https://aso-esfot-backend.onrender.com/api/planescrud')
      .then(res => res.json())
      .then(data => setPlanes(data));
    setForm({ titulo: '', beneficios: '', imagen: '', precio: '' });
    setEditId(null);
  };

  const handleEdit = (plan) => {
    setForm({
      titulo: plan.titulo,
      beneficios: plan.beneficios.join(', '),
      imagen: plan.imagen,
      precio: plan.precio
    });
    setEditId(plan._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este plan?')) {
      await fetch(`https://aso-esfot-backend.onrender.com/api/planescrud/${id}`, { method: 'DELETE' });
      setPlanes(planes.filter(p => p._id !== id));
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* ENCABEZADO */}
      <header className="bg-esfot text-white py-3 px-4 d-flex justify-content-between align-items-center">
        <img src="/imagenes_asoesfot/logo.png" alt="ESFOT" style={{ height: '60px' }} />
        <div>
          <Link to="/adminpage" className="nav-link-custom me-3" style={{ fontSize: '1.25rem' }}>
            Menú
          </Link>
          <Link to="/adminpage/crudpage" className="nav-link-custom me-3" style={{ fontSize: '1.25rem' }}>
            Gestionar Planes
          </Link>
          <Link to="/adminpage/usuariospage" className="nav-link-custom me-3" style={{ fontSize: '1.25rem' }}>
            Gestión de Usuarios
          </Link>
          <Link to="/adminpage/reportespage" className="nav-link-custom me-3" style={{ fontSize: '1.25rem' }}>
            Gestionar Aportantes
          </Link>
          <Link to="/adminpage/finanzaspage" className="nav-link-custom me-3" style={{ fontSize: '1.25rem' }}>
            Finanzas
          </Link>
          <Link to="/admin/solicitudes" className="nav-link-custom me-3" style={{ fontSize: '1.25rem' }}>
            Solicitudes de Actualización
          </Link>
        </div>
      </header>

      {/* Cuerpo */}
      <main className="flex-grow-1 container py-5">
        <h2 className="text-center mb-4">Gestión de Planes de Aportaciones</h2>

        <form onSubmit={handleSubmit} className="card p-4 mb-5 shadow-sm">
          <div className="mb-3">
            <label htmlFor="titulo" className="form-label">Título del Plan</label>
            <input
              id="titulo"
              type="text"
              name="titulo"
              className="form-control"
              value={form.titulo}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="beneficios" className="form-label">Beneficios (separados por coma)</label>
            <textarea
              id="beneficios"
              name="beneficios"
              className="form-control"
              value={form.beneficios}
              onChange={handleChange}
              rows={3}
              required
            ></textarea>
          </div>

          <div className="mb-3">
            <label htmlFor="imagen" className="form-label">Imagen</label>
            <input
              id="imagen"
              type="file"
              accept="image/*"
              className="form-control"
              onChange={async (e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setForm(prev => ({ ...prev, imagen: reader.result }));
                  };
                  reader.readAsDataURL(file);
                }
              }}
              required={!editId}
            />
            {form.imagen && (
              <div className="mt-2">
                <img src={form.imagen} alt="Vista previa" style={{ height: '80px' }} />
              </div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="precio" className="form-label">Precio</label>
            <input
              id="precio"
              type="number"
              name="precio"
              className="form-control"
              value={form.precio}
              onChange={handleChange}
              required
              min="0"
            />
          </div>

          <button type="submit" className="btn btn-danger">
            {editId ? 'Actualizar Plan' : 'Agregar Plan'}
          </button>
        </form>

        {/* Tabla */}
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Imagen</th>
                <th>Título</th>
                <th>Beneficios</th>
                <th>Precio</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {planes.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-muted">
                    No hay planes registrados.
                  </td>
                </tr>
              ) : (
                planes.map((plan, index) => (
                  <tr key={plan._id}>
                    <td>{index + 1}</td>
                    <td>
                      <img
                        src={plan.imagen}
                        alt={plan.titulo}
                        style={{ height: '80px' }}
                      />
                    </td>
                    <td>{plan.titulo}</td>
                    <td>
                      <ul>
                        {plan.beneficios.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </td>
                    <td>${plan.precio}</td>
                    <td>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => handleEdit(plan)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(plan._id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-esfot text-white text-center py-3">
        &copy; 2025 ASO-ESFOT. Todos los derechos reservados.
      </footer>
    </div>
  );
};

export default CrudPlanesPage;