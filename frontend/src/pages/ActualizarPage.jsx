import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ActualizarPage = () => {
  const [usuario, setUsuario] = useState(null);
  const [telefono, setTelefono] = useState('');
  const [carrera, setCarrera] = useState('');
  const [semestre, setSemestre] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Obtén el usuario del localStorage
    const user = JSON.parse(localStorage.getItem('usuario'));
    setUsuario(user);
    if (user) {
      setTelefono(user.telefono || '');
      setCarrera(user.carrera || '');
      setSemestre(user.semestre || '');
    }
  }, []);

  const handleActualizar = async (e) => {
    e.preventDefault();
    setMensaje('');
    if (!usuario || usuario.activo) {
      setMensaje('Solo puedes actualizar tus datos si tu cuenta está inactiva.');
      return;
    }
    try {
      const res = await fetch('https://aso-esfot-backend.onrender.com/api/usuarios/solicitar-actualizacion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: usuario.id,
          telefono,
          carrera,
          semestre,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setShowSuccessModal(true);
        setTimeout(() => {
          setShowSuccessModal(false);
          navigate('/');
        }, 2500);
      } else {
        setMensaje(data.mensaje || 'Error al solicitar actualización.');
      }
    } catch {
      setMensaje('Error de red.');
    }
  };

  if (!usuario) {
    return <div className="container py-5">Debes iniciar sesión para actualizar tus datos.</div>;
  }

  if (usuario.activo) {
    setTimeout(() => {
      navigate('/landing'); // Redirige al landing
    }, 4000); // Espera 2 segundos antes de redirigir
    return (
      <div className="container py-5">
        <div className="alert alert-info">
          Tu cuenta está activa. Solo puedes actualizar datos si tu cuenta está inactiva.Volveras el Menu....
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4" style={{ color: '#e94c4c' }}>Actualizar Datos Personales</h2>
      <form onSubmit={handleActualizar} style={{ maxWidth: 400 }}>
        <div className="mb-3">
          <label className="form-label">Teléfono</label>
          <input
            type="text"
            className={`form-control ${telefono && !/^\d{10}$/.test(telefono) ? 'is-invalid' : ''}`}
            value={telefono}
            onChange={e => setTelefono(e.target.value)}
            required
          />
          <div className="form-text">Debe tener exactamente 10 dígitos.</div>
          {telefono && !/^\d{10}$/.test(telefono) && (
            <div className="invalid-feedback d-block">
              El teléfono debe tener exactamente 10 dígitos.
            </div>
          )}
        </div>
        <div className="mb-3">
          <label className="form-label">Carrera</label>
          <select
            className="form-select"
            value={carrera}
            onChange={e => setCarrera(e.target.value)}
            required
          >
            <option value="">Selecciona una carrera</option>
            <option value="Software">Desarrollo de Software</option>
            <option value="Agua y Saneamiento Ambiental">Agua y Saneamiento Ambiental</option>
            <option value="Electromecánica">Electromecánica</option>
            <option value="Redes y Telecomunicaciones">Redes y Telecomunicaciones</option>
            <option value="Procesamiento de Alimentos">Procesamiento de Alimentos</option>
            <option value="Procesamiento Industrial de Madera">Procesamiento Industrial de Madera</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Semestre</label>
          <select
            className="form-select"
            value={semestre}
            onChange={e => setSemestre(e.target.value)}
            required
          >
            <option value="">Selecciona un semestre</option>
            <option value="Nivelación">Nivelación</option>
            <option value="Primer semestre">Primer semestre</option>
            <option value="Segundo semestre">Segundo semestre</option>
            <option value="Tercer semestre">Tercer semestre</option>
            <option value="Cuarto semestre">Cuarto semestre</option>
            <option value="Quinto semestre">Quinto semestre</option>
          </select>
        </div>
        <button type="submit" className="btn" style={{ background: '#e94c4c', color: '#fff', fontWeight: 'bold' }}>
          Solicitar actualización
        </button>
        {mensaje && <div className="mt-3 alert alert-info">{mensaje}</div>}
      </form>

      {/* Modal de éxito */}
      {showSuccessModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
        }}>
          <div style={{
            background: 'white', padding: 32, borderRadius: 12, minWidth: 300, textAlign: 'center', boxShadow: '0 2px 16px #0002'
          }}>
            <h4 style={{ color: '#e94c4c' }}>¡Datos actualizados correctamente!</h4>
            <p>Serás redirigido al inicio de sesión.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActualizarPage;