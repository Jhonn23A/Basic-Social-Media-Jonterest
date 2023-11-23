//App.js
import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import UserContext, { initialState } from './UserContext';
import Register from './Register';
import VerifyEmail from './VerifyEmail';
import UploadProfileImage from './UploadProfileImage';
import Login from './Login';
import Home from './Home';
import PinForm from './PinForm';
import PinDetails from './PinDetails';
import Navbar from './Navbar';
import UserProfile from './UserProfile';
import PinGallery from './PinGallery';


function App() {
  const [user, setUser] = useState(localStorage.getItem("user") !== "undefined" ? JSON.parse(localStorage.getItem("user")) : null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [boards, setBoards] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (token && user) {
      setToken(token);
      setUser(user);
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      const user = localStorage.getItem('user');
      if (token) {
        setIsAuthenticated(true);
        if (user) {
          setUser(JSON.parse(user));
        }
      } else {
        setIsAuthenticated(false);
      }
    };

    checkUser();
  }, [token]);

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await fetch('/api/boards');
        const data = await response.json();
        setBoards(data);
      } catch (error) {
        console.error('Error al obtener los tableros:', error);
      }
    };

    fetchBoards();
  }, []);

  return (
    <UserContext.Provider value={{ ...initialState, user, setUser, setToken, setIsAuthenticated }}>
      <Router>
        {isAuthenticated && <Navbar searchResults={searchResults} setSearchResults={setSearchResults} />}
        <Routes>
          <Route path="/pin-creation-tool" element={<PinForm />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/upload-profile-image" element={<UploadProfileImage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/pin/:id" element={<PinDetails />} />
          <Route
            path="/:username"
            element={<UserProfile boards={boards} />}
          />
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <div>
                  <Home searchResults={searchResults} boards={boards} />
                </div>
              ) : (
                <Login />
              )
            }
          />
          <Route path="/:username/:boardname" element={<PinGallery />} />
        </Routes>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
