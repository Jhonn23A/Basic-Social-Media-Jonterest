//Home.js

import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserContext from './UserContext';
import axios from 'axios';
import { Avatar, Menu, MenuItem, IconButton, Button, Popover } from '@mui/material';
import Masonry from 'react-masonry-css';
import MenuIcon from '@mui/icons-material/Menu';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SaveIcon from '@mui/icons-material/Save';
import { useParams } from 'react-router-dom';

function Home({ searchResults }) {
  const { username, boardname } = useParams();
  const { user, setUser } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [boards, setBoards] = useState([]);
  const [hoveredPost, setHoveredPost] = useState(null);
  const [selectedBoardName, setSelectedBoardName] = useState({});
  

  const postsToDisplay = searchResults && searchResults.length > 0 ? searchResults : posts;


  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('/api/pins', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        console.log(response.data);
        setPosts(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchBoards = async () => {
      try {
        const response = await axios.get('/api/boards', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        console.log(response.data);
        setBoards(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPosts();
    fetchBoards();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleBoardSelect = (board, postId) => {
    setSelectedBoard(board);
    setSelectedBoardName(prevState => ({...prevState, [postId]: board.title})); // Update selected board name when a board is selected
    handleMenuClose();
  };
  const handleSaveClick = async (pinId, boardId) => {
    try {
      await axios.post(`/api/pins/${pinId}/boards/${boardId}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      console.log(`Pin ${pinId} guardado en el tablero ${boardId}`);
    } catch (error) {
      console.error('Error al guardar el pin:', error);
    }
  };
  

  const handlePostHover = (postId) => {
    setHoveredPost(postId);
  };

  const handlePostLeave = () => {
    setHoveredPost(null);
  };

  const breakpointColumnsObj = {
    default: 5,
    1200: 4,
    1100: 3,
    863: 2,
    620: 1,
  };

  return (
    <div className="container-fluid px-5 py-5" style={{ marginRight: "30%" }}>
      <Masonry breakpointCols={breakpointColumnsObj} className="my-masonry-grid d-flex">
        {postsToDisplay.map((post) => (
          <div className="col py-3" key={post.id}>
            <div
              className="position-relative"
              onMouseEnter={() => handlePostHover(post.id)}
              onMouseLeave={handlePostLeave}
            >
              <div
                onClick={() => navigate(`/pin/${post.id}`)}
                className="text-decoration-none"
              >
                {post.media.endsWith('.mp4') ? (
                  <video
                    src={post.media}
                    alt={post.title}
                    className="img-fluid rounded"
                    style={{
                      cursor: 'pointer',
                      maxWidth: '250px',
                      objectFit: 'cover',
                      opacity: hoveredPost === post.id ? 0.8 : 1,
                      transition: 'opacity 0.3s',
                    }}
                    muted autoPlay loop
                  />
                ) : (
                  <img
                    src={post.media}
                    alt={post.title}
                    className="img-fluid rounded"
                    style={{
                      cursor: 'pointer',
                      maxWidth: '250px',
                      objectFit: 'cover',
                      opacity: hoveredPost === post.id ? 0.8 : 1,
                      transition: 'opacity 0.3s',
                    }}
                  />
                )}
              </div>
              {hoveredPost === post.id && (
                <div
                  className="position-absolute top-0 start-0 p-2"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: 'rgba(0, 0, 0, 0.5)',
                    color: 'white',
                    borderRadius: '50%',
                  }}
                >
                  <span style={{ marginRight: '4px' }}>{selectedBoardName[post.id] || "..."}</span>
                  <Button onClick={handleMenuOpen}>
                    <KeyboardArrowDownIcon />
                  </Button>
                </div>
              )}
              {hoveredPost === post.id && (
                <div
                  className="position-absolute top-0 end-0 p-2"
                  style={{ zIndex: '1' }}
                >
                  <Button
                    variant="contained"
                    color="error"
                    style={{
                      borderRadius: '20px',
                      color: 'white',
                    }}
                    startIcon={<SaveIcon />}
                    onClick={() => handleSaveClick(post.id, selectedBoard.id)}
                  >
                    Guardar
                  </Button>
                </div>
              )}
              <h3 className="fs-6 text-dark mt-2 ms-2">{post.title.length > 30 ? post.title.substring(0, 30) + '...' : post.title}</h3>
              <div className="d-flex align-items-center ms-1">
                <Avatar
                  alt={post.user.name}
                  src={`/storage/${post.user.profile_image}`}
                />
                <p className="fs-6 text-dark ms-2 mt-2">{post.user.name}</p>
              </div>
              <Popover
                open={Boolean(anchorEl) && hoveredPost === post.id}
                anchorEl={anchorEl}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: 'center',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'center',
                  horizontal: 'center',
                }}
              >
                {boards.map((board) => (
                  <MenuItem key={board.id} onClick={() => handleBoardSelect(board, post.id)}>
                    {board.title}
                  </MenuItem>
                ))}
              </Popover>
            </div>
          </div>
        ))}
      </Masonry>
    </div>
  );

  
}

export default Home;




