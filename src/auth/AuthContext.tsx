import { createContext, useContext, useState, type ReactNode } from "react";
import axios from "axios";
import { API_URL } from '../url/api';


type User = {
    id: number;
    email: string;
}

type AuthContextType = {
    user: User | null;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => void;
    loading: boolean;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = ():AuthContextType => {
    const context = useContext(AuthContext);
    if(!context){
        throw new Error("useAuth must be used within provider");
    }
    return context;
}

type AuthProviderProps = {
    children: ReactNode;
}


export const AuthProvider = ({children}: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(()=> {
        const stored = localStorage.getItem("user");
        return stored ? JSON.parse(stored) : null
    })

    const [loading, setLoading] = useState<boolean>(false);

    const signIn = async(email:string, password: string) => {
        setLoading(true) 
        try {
            const response = await axios.post(`${API_URL}/api/login`, { email, password })
            const userData: User = response.data.user;
            
            localStorage.setItem("user", JSON.stringify(userData));
            setUser(userData)
        }finally{
            setLoading(false)
        }
    }

    const signOut = () => {
        localStorage.removeItem("user");
        setUser(null);
    }
    
    return (
        <AuthContext.Provider value={{user, signIn, signOut, loading}}>
            {children}
        </AuthContext.Provider>
    )
}