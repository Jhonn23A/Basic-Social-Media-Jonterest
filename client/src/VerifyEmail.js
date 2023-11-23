//VerifyEmail.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function VerifyEmail() {
  const [verificationCode, setVerificationCode] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/verify-code', { verification_code: verificationCode }, { withCredentials: true });
      console.log('Token:', response.data.token);
  
      // Almacena el token en el almacenamiento local
      localStorage.setItem('token', response.data.token);
  
      navigate('/upload-profile-image');
    } catch (error) {
      console.error('Error durante la verificación:', error);
    }
  };
  

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="p-5 bg-white rounded shadow">
        <h2 className="text-center mb-4 font-weight-bold">Verificación de Email</h2>
        <p className="text-center mb-4">Por favor, introduce el código de verificación que hemos enviado a tu email</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Código de Verificación</label>
            <input type="text" className="form-control" placeholder="Código de Verificación" value={verificationCode} onChange={e => setVerificationCode(e.target.value)} required />
          </div>

          <button type="submit" className="btn btn-danger w-100 mt-3 font-weight-bold">
            Verificar
          </button>
        </form>
      </div>
    </div>
  );
}

export default VerifyEmail;


