//UpLoadProfileImage.js
import React, { useState } from 'react';
import AvatarEditor from 'react-avatar-editor';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function UploadProfileImage() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [editor, setEditor] = useState(null);
  const [error, setError] = useState(null); // Agrega un estado para el error
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const fileType = file['type'];
    const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];

    if (validImageTypes.includes(fileType)) {
      setSelectedImage(URL.createObjectURL(file));
      setError(null); // Limpia el error
    } else {
      setError('Por favor, sube una imagen válida (JPEG, PNG, GIF).');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editor) {
      const canvas = editor.getImageScaledToCanvas();
      canvas.toBlob(async (blob) => {
        const formData = new FormData();
        formData.append('profile_image', blob);
        await axios.post('/api/upload-profile-image', formData, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        navigate('/');
      });
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="p-5 bg-white rounded shadow">
        <h2 className="text-center mb-4 font-weight-bold">Sube tu imagen de perfil</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Imagen de perfil</label>
            <input type="file" className="form-control" onChange={handleImageChange} required />
          </div>

          {error && <p style={{ color: 'red' }}>{error}</p>} {/* Muestra el mensaje de error */}
          {selectedImage && (
            <AvatarEditor
              ref={setEditor}
              image={selectedImage}
              width={200}
              height={200}
              border={50}
              color={[255, 255, 255, 0.6]} // RGBA
              scale={1.2}
              rotate={0}
            />
          )}

          <button type="submit" className="btn btn-danger w-100 mt-3 font-weight-bold">
            Guardar e Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
}

export default UploadProfileImage;


