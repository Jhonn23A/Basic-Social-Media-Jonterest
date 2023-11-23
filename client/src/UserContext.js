// UserContext.js

import React, { useState } from 'react';

export const initialState = {
  token: localStorage.getItem('token') || null,
  user: localStorage.getItem('user') !== "undefined" ? JSON.parse(localStorage.getItem('user')) : null,
  profileImage: '/storage/user.profile_images',
};

const UserContext = React.createContext(initialState);

export const UserProvider = ({ children }) => {
  const [token, setToken] = useState(initialState.token);
  const [user, setUser] = useState(initialState.user);

  return (
    <UserContext.Provider value={{ token, user, setToken, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
