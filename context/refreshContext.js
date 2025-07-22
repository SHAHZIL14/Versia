import { createContext, useState, useContext } from "react";

const refreshContext = createContext();

export const refreshProvider = ({ children }) => {
    const [refreshTrigger, setRefreshTrigger] = useState(false);

    return (
        <refreshContext.Provider value={{ refreshTrigger, setRefreshTrigger }}>
            {children}
        </refreshContext.Provider>
    );
};

export const useRefreshContext = () => useContext(refreshContext);
