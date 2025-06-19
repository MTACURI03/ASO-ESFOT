import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import RegistroPage from '../pages/RegistroPage';
import VisualizarPage from '../pages/VisualizarPage';
import CrearPasswordPage from '../pages/CrearPasswordPage';
import AdminPage from '../pages/AdminPage';
import CrudPlanesPage from '../pages/CrudPlanesPage';
import ReportesPage from '../pages/ReportesPage';
import FinanzasPage from '../pages/FinanzasPage';
import VerificarCuenta from '../pages/VerificarCuenta';
const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/registro" element={<RegistroPage />} />
      <Route path="/visualizar" element={<VisualizarPage />} />
      <Route path="/crear-password" element={<CrearPasswordPage />} />
      <Route path="/adminpage" element={<AdminPage/>} />
      <Route path="/adminpage/crudpage" element={<CrudPlanesPage/>} />
      <Route path="/adminpage/reportespage" element={<ReportesPage/>} />
      <Route path="/adminpage/finanzaspage" element={<FinanzasPage/>} />
      <Route path="/verificar/:token" element={<VerificarCuenta />} />
    </Routes>
  </BrowserRouter>
);

export default AppRouter;


