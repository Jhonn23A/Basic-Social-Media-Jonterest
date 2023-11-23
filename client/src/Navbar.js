//Navbar.js
import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import UserContext from './UserContext';
import { Search, Notifications, ChatBubble, ExitToApp } from '@mui/icons-material';
import { Avatar, ListItemIcon } from '@mui/material';
import { Dropdown } from 'react-bootstrap';
import './Navbarstyles.css';
import logo from './Pinazul.jpg';
import axios from 'axios';
import MenuIcon from '@mui/icons-material/Menu';

function Navbar({ searchResults, setSearchResults }) {
  const { user, setUser, setIsAuthenticated } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Crea un estado para almacenar los resultados de la búsqueda


  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    setToken(null); // Añade esta línea para eliminar el token del estado
    navigate('/login'); // Cambia esta línea para redirigir a /login
  };

  const handleProfileClick = () => {
    navigate(`/${user.name}`);
  };

  // Función para manejar la búsqueda
  const handleSearch = async (event) => {
    event.preventDefault();
    const query = document.querySelector('input[name="search"]').value;
    const response = await axios.get(`/api/search?query=${query}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    setSearchResults(response.data);
  };
  
  

  return (
    <nav className="navbar navbar-expand-lg ml-auto bg-light mt-2" style={{ paddingLeft: '2px' }}>
      <ul className="navbar-nav d-none d-md-flex">


      <li className="nav-item ml-2 responsive-icon" style={{ marginLeft: '2rem' }}>
        <Avatar alt="Logo" src={logo} />
      </li>
  
        <li className={`nav-item ml-10 ${location.pathname === '/' ? 'active' : ''}`}>
          <Link to="/" className="nav-link" style={{ marginLeft: '2rem', height: '100%', display: 'flex', alignItems: 'center', width: '60px', justifyContent: 'center', borderRadius: '10px' }}>
            Inicio
          </Link>
        </li>
        <li className={`nav-item ml-5 ${location.pathname === '/explorar' ? 'active' : ''}`}>
          <Link to="/explorar" className="nav-link" style={{ marginLeft: '2rem', height: '100%', display: 'flex', alignItems: 'center', width: '70px', justifyContent: 'center', borderRadius: '10px' }}>
            Explorar
          </Link>
        </li>
        <li className={`nav-item ml-3 ${location.pathname === '/pin-creation-tool' ? 'active' : ''}`}>
          <Link to="/pin-creation-tool" className="nav-link" style={{ marginLeft: '2rem', height: '100%', display: 'flex', alignItems: 'center', width: '60px', justifyContent: 'center', borderRadius: '10px' }}>
            Crear
          </Link>
        </li>
      </ul>
      <form className="form-inline my-2 my-lg-0 position-relative ml-5 d-flex align-items-center" onSubmit={handleSearch}>
        <div style={{ position: 'relative', marginLeft: '2rem', display: 'flex', alignItems: 'center' }}>
          <input type="text" name="search" className="form-control rounded-pill" placeholder="Buscar" style={{ paddingLeft: '30px', height: '50px', width: '550px', backgroundColor: '#D3D3D3', color: '#808080' }} />
          <button onClick={handleSearch} style={{ background: 'none', border: 'none' }}>
            <Search sx={{ color: 'black', position: 'absolute', top: '50%', left: '10px', transform: 'translateY(-50%)' }} />
          </button>
        </div>
      </form>
      <ul className="navbar-nav ml-auto">
        <li className="nav-item ml-3 responsive-icon" style={{ marginLeft: '2rem' }}>
          <a href="#" className="nav-link">
            <Notifications className="icon" sx={{ color: 'black' }} />
          </a>
        </li>
        <li className="nav-item ml-3 responsive-icon" style={{ marginLeft: '2rem' }}>
          <a href="#" className="nav-link">
            <ChatBubble className="icon" sx={{ color: 'black' }} />
          </a>
        </li>
        <li className="nav-item ml-3 always-show responsive-icon" style={{ marginLeft: '2rem' }}>
          <button onClick={handleLogout} className="btn btn-primary responsive-button">
            <span className="button-text">Cerrar sesión</span>
            <ExitToApp sx={{ color: 'white', marginLeft: '10px' }} />
          </button>
        </li>
        <li className="nav-item always-show ml-3" style={{ marginLeft: '2rem' }}>
          <button onClick={handleProfileClick} className="nav-link" style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '0' }}>
            <Avatar alt="Foto de perfil" src={`http://localhost:8000/storage/${user?.profile_image}`} />
          </button>
        </li>
        {/* Aquí es donde se agregan los elementos al menú desplegable */}
        <li className="nav-item ml-3 responsive-icon d-lg-none" style={{ marginLeft: '2rem' }}>
        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            <MenuIcon />
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item href="/">Inicio</Dropdown.Item>
            <Dropdown.Item href="/explorar">Explorar</Dropdown.Item>
            <Dropdown.Item href="/pin-creation-tool">Crear</Dropdown.Item>

            {/* Elemento de "Cerrar sesión" */}
            <Dropdown.Item onClick={handleLogout}>
              Cerrar sesión
              <ExitToApp sx={{ color: 'white', marginLeft: '10px' }} />
            </Dropdown.Item>

            {/* Elemento de "Foto de perfil" */}
            <Dropdown.Item onClick={handleProfileClick}>
              Perfil
              <Avatar alt="Foto de perfil" src={`http://localhost:8000/storage/${user?.profile_image}`} />
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </li>
      </ul>
    </nav>
  );
  
};

export default Navbar;