// CreateBoard.js
import React, { useState } from 'react';
import axios from 'axios';

function CreateBoard() {
  const [title, setTitle] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await axios.post('/api/boards', { title }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      alert('Tablero creado exitosamente');
    } catch (error) {
      console.error('Error al crear el tablero:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título del tablero" required />
      <button type="submit">Crear Tablero</button>
    </form>
  );
}

export default CreateBoard;


