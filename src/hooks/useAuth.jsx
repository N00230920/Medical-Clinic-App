import { createContext, useContext, useState, useEffect } from 'react';
import axios from "@/config/api";

//Create Auth Context to store auth state
const AuthContext = createContext();

//Auth Provider component to wrap the app and provide auth state
// Children prop represents the components that will have access to the auth context
export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => {
        if (localStorage.getItem('token')) {
            return localStorage.getItem('token');
        }
        else {
            return null;
        }
    });

    const onLogin = async (email, password) => {
        const options = {
            method: "POST",
            url: "https://festivals-api.vercel.app/login",
            data: {email, password} 

        };

        try {
            let response = await axios.request(options);
            console.log(response.data);
            localStorage.setItem('token', response.data.token);
            setToken(response.data.token);

        } catch (err) {
            console.log(err.response.data);
        }
    };

    const onLogout = () => {
        setToken(null);
        localStorage.removeItem('token');
    }

    const value = {
        token,
        onLogin,
        onLogout    
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
};  