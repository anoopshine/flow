import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    console.log(user, 'dfdfsdfhey ak');
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            setLoading(false);
            return;
        }

        axios
            .get("http://192.168.10.132:4000/api/auth/profile", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(res => setUser(res.data.user))
            .catch(() => localStorage.removeItem("token"))
            .finally(() => setLoading(false));
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
