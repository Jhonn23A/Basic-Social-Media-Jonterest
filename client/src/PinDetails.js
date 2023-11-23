// PinDetails.js
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import UserContext from './UserContext';
import axios from 'axios';
import Avatar from '@mui/material/Avatar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons'
import { faHeart as fasHeart, faArrowRight } from '@fortawesome/free-solid-svg-icons'


function PinDetails() {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const [pin, setPin] = useState(null);
  const [likeCount, setLikeCount] = useState(0); 
  const [comments, setComments] = useState([]); 
  const [newComment, setNewComment] = useState(''); 
  const [liked, setLiked] = useState(pin ? pin.liked_by_user : false); 

  useEffect(() => {
    if (pin) {
        setLiked(pin.liked_by_user); // actualizar liked cuando el pin cambia
    }
}, [pin]);
  
  const handleLike = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/pins/${id}/like`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setLikeCount(likeCount + 1);
      setLiked(true); // establecer liked en true cuando el usuario da "me gusta"
    } catch (error) {
      console.error(error);
    }
  };


  const handleUnlike = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/pins/${id}/like`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setLikeCount(likeCount - 1);
      setLiked(false); // establecer liked en false cuando el usuario quita el "me gusta"
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchPin = async () => {
      try {
        const token = localStorage.getItem('token'); 
        const response = await axios.get(`/api/pins/${id}`, {
          headers: {
            Authorization: `Bearer ${token}` 
          }
        });
        setPin(response.data);
        setLikeCount(response.data.like_count); 
      } catch (error) {
        console.error(error);
      }
    };

    fetchPin();
  }, [id]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const token = localStorage.getItem('token'); 
        const response = await axios.get(`/api/pins/${id}/comments`, {
          headers: {
            Authorization: `Bearer ${token}` 
          }
        });
        setComments(response.data);
        console.log(comments)
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchComments();
  }, [id]);
  

  
  const handleCommentSubmit = async (event) => {
    event.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`/api/pins/${id}/comments`, { content: newComment }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setComments([...comments, { ...response.data, user }]); 
      setNewComment(''); 
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mt-5" style={{ marginLeft: '20px' }}>
  
      {pin && (
        <div className="row">
          <div className="col-lg-6 mb-4">
            <div style={{ border: '1px solid #000', borderRadius: '10px', padding: '20px', boxShadow: '5px 5px 15px #000080' }}>
              {pin.media.endsWith('.mp4') ? (
                <video 
                  src={pin.media} 
                  alt={pin.title} 
                  className="rounded img-fluid" 
                  controls 
                  style={{ width: '100%' }} // Establece un ancho fijo para el video
                />
              ) : (
                <img 
                  src={pin.media} 
                  alt={pin.title} 
                  className="rounded img-fluid" 
                  style={{ width: '100%' }} // Establece un ancho fijo para la imagen
                />
              )}
            </div>
          </div>
          <div className="col-lg-6">
          <div style={{ border: '1px solid #000', borderRadius: '10px', padding: '20px', boxShadow: '5px 5px 15px #000080', wordWrap: 'break-word', overflowWrap: 'break-word', whiteSpace: 'normal', wordBreak: 'break-all' }}>
              <a href={pin.link} style={{ textDecoration: 'underline', wordBreak: 'break-all' }}>{pin.link}</a>
              <h3 style={{ wordBreak: 'break-all' }}>{pin.title}</h3>
              <p style={{ wordBreak: 'break-all' }}>{pin.description}</p>
              <div className="d-flex align-items-center mb-2">
                <>
                  <Avatar alt={pin.user_name} src={`/storage/${pin.user_profile_image}`} /> 
                  <p className="ml-2">{pin.user_name}</p> 
                </>
              </div>
              <h3 className="mt-4">Comentarios ({comments.length})</h3>
              {comments.map((comment) => (
  <div key={comment.id} className="d-flex align-items-center mb-2" style={{ wordWrap: 'break-word', overflowWrap: 'break-word', whiteSpace: 'normal', wordBreak: 'break-all' }}> {/* Aplica el estilo a los comentarios */}
    {comment.user && (
      <>
        <Avatar alt={comment.user.name} src={`/storage/${comment.user.profile_image}`} /> 
        <div className="ml-2">
          <p><strong>{comment.user.name}</strong>: {comment.content}</p> 
        </div>
      </>
    )}
  </div>
))}


              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                <strong style={{ fontSize: '24px', marginRight: '10px' }}>{likeCount}</strong>
                <button className="btn btn-link p-0 border-0" onClick={liked ? handleUnlike : handleLike}>
                  <FontAwesomeIcon icon={liked ? fasHeart : farHeart} color={liked ? "red" : ""} size="2x" /> 
                </button> 
              </div>
              <form onSubmit={handleCommentSubmit} style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
                <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Escribe un comentario..." style={{ borderRadius: '25px', backgroundColor: '#f8f9fa', color: '#343a40', fontWeight: 'bold', flex: 1, paddingLeft: '10px' }} />
                {newComment && (
                  <button type="submit" style={{ backgroundColor: 'red', color: 'white', borderRadius: '50%', marginLeft: '10px' }}>
                    <FontAwesomeIcon icon={faArrowRight} />
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PinDetails;

