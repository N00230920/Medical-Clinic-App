import { createContext, useContext, useState} from "react";
import axios from "@/config/api";

// Create Auth Context to store auth state
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
    return useContext(AuthContext);
};

const decodeToken = (storedToken) => {
    if (!storedToken) return null;
    try {
        const tokenPayload = storedToken.split(".")[1];
        if (!tokenPayload) return null;
        const base64 = tokenPayload.replace(/-/g, "+").replace(/_/g, "/");
        return JSON.parse(atob(base64));
    } catch (err) {
        console.log(err);
        return null;
    }
};

// Auth Provider component to wrap the app and provide auth state
// children is a prop that represents the nested components
export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => {
        if(localStorage.getItem('token')){
            return localStorage.getItem('token');
        }
        else {
            return null;
        }
    });
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                return JSON.parse(storedUser);
            } catch (err) {
                console.log(err);
            }
        }

        return decodeToken(localStorage.getItem("token"));
    });

    const storeUser = (userData) => {
        if (!userData) return;
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
    };

    const onLogin = async (email, password) => {
        const options = {
            method: "POST",
            url: "/login",
            data: {
                email,
                password
            }
        };

        try {
            let response = await axios.request(options);
            console.log(response.data);
            localStorage.setItem("token", response.data.token);
            setToken(response.data.token);
            const responseUser = response.data?.user || response.data?.data?.user;
            if (responseUser) {
                storeUser(responseUser);
            } else if (response.data?.first_name || response.data?.email) {
                storeUser({
                    first_name: response.data.first_name,
                    last_name: response.data.last_name,
                    email: response.data.email
                });
            } else {
                const decodedUser = decodeToken(response.data.token);
                if (decodedUser?.first_name || decodedUser?.email) {
                    storeUser({
                        first_name: decodedUser.first_name,
                        last_name: decodedUser.last_name,
                        email: decodedUser.email
                    });
                }
            }
            return response.data;
        } catch (err) {
            console.log(err.response?.data || err);
            return null;
        }
    };

    const onRegister = async (email, password, first_name, last_name) => {
        const options = {
            method: "POST",
            url: "/register",
            data: {
                email,
                password,
                first_name,
                last_name
            }
        };

        try {
            let response = await axios.request(options);
            console.log(response.data);
            if (response.data?.token) {
                localStorage.setItem("token", response.data.token);
                setToken(response.data.token);
            }
            const responseUser = response.data?.user || response.data?.data?.user;
            if (responseUser) {
                storeUser(responseUser);
            } else if (response.data?.first_name || response.data?.email) {
                storeUser({
                    first_name: response.data.first_name,
                    last_name: response.data.last_name,
                    email: response.data.email
                });
            } else if (response.data?.token) {
                const decodedUser = decodeToken(response.data.token);
                if (decodedUser?.first_name || decodedUser?.email) {
                    storeUser({
                        first_name: decodedUser.first_name,
                        last_name: decodedUser.last_name,
                        email: decodedUser.email
                    });
                }
            }
            return response.data;
        } catch (err) {
            console.log(err.response?.data || err);
            return null;
        }
    };

    const onLogout = () => {
        setToken(null);
        localStorage.removeItem("token");
        setUser(null);
        localStorage.removeItem("user");
    };

    const value = {
        token,
        user,
        onLogin,
        onRegister,
        onLogout
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>

};
