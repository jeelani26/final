import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Import jwt-decode

const AuthContext = createContext();

// Function to get year from username (ID)
const getStudentYear = (username) => {
    if (username.startsWith('25')) return 1;
    if (username.startsWith('24')) return 2;
    if (username.startsWith('23')) return 3;
    if (username.startsWith('22')) return 4;
    return null; // Not a student or unknown year
};

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(undefined); // Start as undefined
    const [token, setToken] = useState(localStorage.getItem('token'));
    const API_URL = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const studentYear = decodedToken.role === 'student' ? getStudentYear(decodedToken.username) : null;
                
                setUser({
                    id: decodedToken.id,
                    username: decodedToken.username,
                    role: decodedToken.role,
                    year: studentYear // Add the year to the user object
                });
            } catch (error) {
                console.error("Invalid token:", error);
                logout(); // Clear invalid token
            }
        } else {
            setUser(null); // No token, no user
        }
    }, [token]);

    const login = async (username, password) => {
        try {
            const response = await axios.post(`${API_URL}/api/auth/login`, { username, password });
            const { token } = response.data;
            setToken(token);
            localStorage.setItem('token', token);

            // Decode token to set user state immediately
            const decodedToken = jwtDecode(token);
            const studentYear = decodedToken.role === 'student' ? getStudentYear(decodedToken.username) : null;
            
            setUser({
                id: decodedToken.id,
                username: decodedToken.username,
                role: decodedToken.role,
                year: studentYear
            });

        } catch (error) {
            console.error("Login failed:", error);
            throw error; // Re-throw error to be caught by LoginPage
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ token, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
