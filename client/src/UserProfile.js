// UserProfile.js
import React, { useContext, useEffect, useState } from 'react';
import { Avatar, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import UserContext from './UserContext';
import axios from 'axios';
import Masonry from 'react-masonry-css';

function UserProfile() {
  const { user } = useContext(UserContext);
  const [boards, setBoards] = useState([]);
  const [firstPins, setFirstPins] = useState([]);
  const [view, setView] = useState('boards'); // Nuevo estado para la vista
  const [pins, setPins] = useState([]);
  
  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/boards', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        console.log(response.data);
        setBoards(response.data);
  
        // Llama a fetchFirstPins aquí, después de setBoards
        const responses = await Promise.all(
          response.data.map((board) =>
            axios.get(`http://localhost:8000/api/boards/${board.id}/firstPin`, {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            }).catch((error) => {
              console.error(`Error al obtener el primer pin del tablero ${board.id}:`, error);
              return null; // Devuelve null si hay un error
            })
          )
        );
        setFirstPins(responses.map((response) => response ? response.data : null));
      } catch (error) {
        console.error('Error al obtener los tableros:', error);
      }
    };
  
    fetchBoards();
  }, []);
  



  useEffect(() => {
    const fetchUserPins = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/user/pins`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setPins(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error al obtener los pines del usuario:', error);
      }
    };
  
    if (view === 'pins') {
      fetchUserPins();
    }
  }, [user.id, view]);
  

  const handleViewChange = (newView) => {
    setView(newView);
  };

  const breakpointColumnsObj = {
    default: 5,
    1200: 4,
    1100: 3,
    863: 2,
    620: 1,
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <Avatar
        alt={user.name}
        src={`/storage/${user?.profile_image}`}
        style={{ margin: '0 auto', width: '100px', height: '100px' }} // Aumenta el tamaño de la foto de perfil
      />
      <h3 style={{ margin: '10px 0' }}>{user.name}</h3>
      <Button 
  onClick={() => handleViewChange('boards')} 
  style={view === 'boards' ? {fontWeight: 'bold', borderBottom: '2px solid red', color: 'black'} : {fontWeight: 'bold', color: 'black'}}
>
  Guardados
</Button> {/* Botón para ver los tableros */}
<Button 
  onClick={() => handleViewChange('pins')} 
  style={view === 'pins' ? {fontWeight: 'bold', borderBottom: '2px solid red', color: 'black'} : {fontWeight: 'bold', color: 'black'}}
>
  Creado
</Button> {/* Botón para ver los pines */}



      {view === 'boards' ? (
      // Muestra los tableros si la vista es 'boards'
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid d-flex"
      >
       {boards.map((board, index) => (
          <div key={board.id} style={{ margin: '10px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Link to={`/${user.name}/${board.title}`}>
              {firstPins[index] ? (
                firstPins[index].media.endsWith('.mp4') ? (
                  <video
                    src={firstPins[index]?.media}
                    alt={firstPins[index]?.title}
                    style={{ width: '100px', height: 'auto', borderRadius: '15px' }}
                    controls
                  />
                ) : (
                  <img
                    src={firstPins[index]?.media}
                    alt={firstPins[index]?.title}
                    style={{ width: '100px', height: 'auto', borderRadius: '15px' }}
                  />
                )
              ) : (
                <div style={{ width: '100px', height: '100px', borderRadius: '15px', backgroundColor: 'lightgray' }} />
              )}
            </Link>
            <h4 style={{ marginTop: '5px' }}>{board.title}</h4>
          </div>
        ))}

      </Masonry>
    ) : (
        // Muestra los pines si la vista es 'pins'
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid d-flex"
        >
          {pins.map((pin) => (
            <div key={pin.id} style={{ margin: '10px', textAlign: 'center' }}>
              <Link to={`/pin/${pin.id}`}>
                {pin.media.endsWith('.mp4') ? (
                  <video
                    src={pin?.media}
                    alt={pin?.title}
                    style={{ width: '100px', height: 'auto', borderRadius: '15px' }}
                    controls
                  />
                ) : (
                  <img
                    src={pin?.media}
                    alt={pin?.title}
                    style={{ width: '100px', height: 'auto', borderRadius: '15px' }}
                  />
                )}
              </Link>
              <h4 style={{ marginTop: '5px' }}>{pin?.title.substring(0, 30)}</h4>
            </div>
          ))}
        </Masonry>
      )}
    </div>
  );
}

export default UserProfile;
               