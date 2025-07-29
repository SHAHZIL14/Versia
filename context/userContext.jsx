import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userPosts, setUserPosts] = useState([]);

  return (
    <UserContext.Provider value={{ userPosts, setUserPosts }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
