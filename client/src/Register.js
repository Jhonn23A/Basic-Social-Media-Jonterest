//Register.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    const user = { name, email, password, password_confirmation: confirmPassword };
    try {
      const response = await axios.post('/api/pre-register', user, { withCredentials: true });
      navigate('/verify-email');
    } catch (error) {
      console.error('Error durante la solicitud:', error);
    }
  };
  
  
  
  

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="p-5 bg-white rounded shadow">
        <h2 className="text-center mb-4 font-weight-bold">Te damos la bienvenida a Jonterest</h2>
        <p className="text-center mb-4">Encuentra nuevas ideas para experimentar</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre</label>
            <input type="text" className="form-control" placeholder="Nombre" value={name} onChange={e => setName(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" className="form-control" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" className="form-control" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Confirmar Password</label>
            <input type="password" className="form-control" placeholder="Confirmar Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
          </div>

          <button type="submit" className="btn btn-danger w-100 mt-3 font-weight-bold">
            Continuar
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
