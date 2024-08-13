import { jwtDecode } from "jwt-decode";

interface TokenPayload {
    exp: number;
}

// Utility function to check if token is expired
export const isTokenValid = (token: string): boolean => {
    const {exp} = jwtDecode<TokenPayload>(token);
    console.log(exp)
    if (!exp) return false;
    const currentTime = Math.floor(Date.now()/1000);
    return exp > currentTime;
}

// Utility function to read cookie
export const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
}


