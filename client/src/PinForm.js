// PinForm.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import CreateBoard from './CreateBoard';

function PinForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [media, setMedia] = useState(null);
  const [link, setLink] = useState('');
  const [boardId, setBoardId] = useState('');
  const [boards, setBoards] = useState([]);
  const [showCreateBoard, setShowCreateBoard] = useState(false);

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await axios.get('/api/boards', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setBoards(response.data);
      } catch (error) {
        console.error('Error al obtener los tableros:', error);
      }
    };

    fetchBoards();
  }, []);

  useEffect(() => {
    if (boardId === 'new') {
      setShowCreateBoard(true);
    } else {
      setShowCreateBoard(false);
    }
  }, [boardId]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (showCreateBoard) return;

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('media', media);
    formData.append('link', link);
    formData.append('board_id', boardId);

    try {
      await axios.post('/api/pins', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      alert('Pin creado exitosamente');
    } catch (error) {
      console.error('Error al crear el pin:', error);
    }
  };

  const onDrop = useCallback((acceptedFiles) => {
    setMedia(acceptedFiles[0]);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginLeft: '200px' }}>
      <div {...getRootProps()} style={{ flexBasis: '30%', marginRight: '20px', border: '1px solid black', padding: '10px', height: '500px', width: '200px', borderRadius: '15px', backgroundColor: '#D3D3D3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <input {...getInputProps()} style={{ display: 'none' }} />
        {
          media ?
            media.type.startsWith('video') ?
              <video src={URL.createObjectURL(media)} alt="Preview" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', borderRadius: '15px' }} muted autoPlay loop /> :
              <img src={URL.createObjectURL(media)} alt="Preview" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain', borderRadius: '15px' }} /> :
            isDragActive ?
              <p>Suelta los archivos aquí...</p> :
              <p>Arrastra y suelta algunos archivos aquí, o haz clic para seleccionar archivos</p>
        }
        <p style={{ position: 'absolute', bottom: '10px' }}>Se permiten formatos jpg, png y no más de 15 MB</p>
      </div>
      <form onSubmit={handleSubmit} style={{ flexBasis: '60%', marginRight: '40px' }}>
        <div style={{ marginBottom: '20px' }}>
          <label>Título</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Añadir título" required style={{ display: 'block', borderRadius: '15px', width: '100%' }} />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label>Descripción</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Añadir descripción" required style={{ display: 'block', borderRadius: '15px', width: '100%', height: '100px' }} />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label>Enlace</label>
          <input type="text" value={link} onChange={(e) => setLink(e.target.value)} placeholder="Añadir enlace" style={{ display: 'block', borderRadius: '15px', width: '100%' }} />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label>Selecciona un tablero</label>
          <select value={boardId} onChange={(e) => setBoardId(e.target.value)} required style={{ display: 'block', borderRadius: '15px', width: '100%' }}>
            <option value="">Añadir tablero</option>
            {boards.map((board) => (
              <option key={board.id} value={board.id}>
                {board.title}
              </option>
            ))}
            <option value="new">Crear nuevo tablero</option>
          </select>
        </div>
        <button type="submit">Crear Pin</button>
      </form>
      {showCreateBoard && <CreateBoard />}
    </div>
  );
  
  
  
  
  
  
}

export default PinForm;
