//Login.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import UserContext from './UserContext';
import { useNavigate } from 'react-router-dom';


function Login() {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Usar el contexto de usuario
  const { user, setUser, token, setToken } = useContext(UserContext);
  
  const navigate = useNavigate();


  const handleLogin = async () => {
    try {
      const user = { email, password };
      const response = await axios.post('/api/login', user);
  
      // Registrar response.data en la consola
      console.log(response.data);
  
      if (response.data.name && response.data.profile_image) {
        const user = {
          name: response.data.name,
          profile_image: response.data.profile_image
        };
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', response.data.token);
        setToken(response.data.token);
        setUser(user);
      } else {
        console.log('no existe user')
      }
      
  
      navigate('/');
    } catch (error) {
      console.error(error);
      setError('Error al iniciar sesión. Por favor, verifica tus credenciales.');
    }
  };
  
  

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token]);


  const handleSubmit = (e) => {

    e.preventDefault();


    setError('');


    handleLogin();
  };


  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="p-5 bg-white rounded shadow">
        <h2 className="text-center mb-4 font-weight-bold">Bienvenido de nuevo a Jonterest</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" className="form-control" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" className="form-control" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>

          <button type="submit" className="btn btn-danger w-100 mt-3 font-weight-bold">
            Iniciar sesión
          </button>
        </form>
      </div>
    </div>
  );
}


export default Login;
