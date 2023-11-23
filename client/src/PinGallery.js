//PinGallery.js

import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import UserContext from './UserContext';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Masonry from 'react-masonry-css';
function PinGallery() {
  const { user } = useContext(UserContext);
  const { username, boardname } = useParams();
  const [pins, setPins] = useState([]);

  useEffect(() => {
    const fetchPins = async () => {
      try {
        const response = await axios.get(`/api/boards/${boardname}/pins`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        console.log(response.data);
        setPins(response.data);
      } catch (error) {
        console.error('Error al obtener los pines:', error);
      }
    };
  
    fetchPins();
  }, [boardname]);

  if (!pins || pins.length === 0) {
    return <p>No se encontraron pines.</p>;
  }

  const breakpointColumnsObj = {
    default: 5,
    1200: 4,
    1100: 3,
    863: 2,
    620: 1,
  };

  return (
    <div className="container-fluid px-5 py-5" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1>{boardname}</h1>
      <Masonry
      breakpointCols={breakpointColumnsObj}
      className="my-masonry-grid d-flex" // Añade la propiedad d-flex aquí
      columnClassName="my-masonry-grid_column"
      columnWidth={200}
      horizontalOrder={true}
      verticalGutter={0}
    >
{pins.map((pin) => (
  <div key={pin.id} style={{ margin: '10px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <Link to={`/pin/${pin.id}`}>
      {pin.media.endsWith('.mp4') ? (
        <video
          src={pin.media}
          alt={pin.title}
          style={{ width: '100%', objectFit: 'cover', borderRadius: '15px' }}
          controls
        />
      ) : (
        <img
          src={pin.media}
          alt={pin.title}
          style={{ width: '100%', objectFit: 'cover', borderRadius: '15px' }}
        />
      )}
    </Link>
    <h4 style={{ marginTop: '5px' }}>{pin.title}</h4>
  </div>
))}

    </Masonry>
    
    </div>
    
    );
    
    
}

export default PinGallery;
