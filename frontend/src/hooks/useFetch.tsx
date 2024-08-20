import { useState } from "react";
import { getCookie } from "../utility";
import { useNavigate } from "react-router-dom";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

interface FetchOptions {
  method: HttpMethod;
  endpoint: string;
  headers?: Record<string, string>;
  body?: any;
}

const useFetch = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // URLs that don't need authentication
  const openUrls = [
    'https://192.168.88.148:5000/api/login',
    'https://192.168.88.148:5000/api/reg_temp_user',
    'https://192.168.88.148:5000/api/featuredEpisodes',
    'https://192.168.88.148:5000/api/episodes',

  ];

  const fetchData = async ({method, endpoint, headers, body,}: FetchOptions): Promise<any> => {
    if (openUrls.includes(endpoint)) {
      setLoading(true);
      try {
        const response = await fetch(endpoint, {
          method,
          headers: {
            "Content-Type": "application/json",
            ...headers,
          },
          body: JSON.stringify(body),
          credentials: "include", // Include credentials for cross-origin requests
        });

        if (!response.ok) {
          const errorText = await response.text(); // Get the full response text
          throw new Error(`Error: ${response.status} ${response.statusText}\n${errorText}`);
        }

        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        } else {
          return data;
        }
      } catch (error: any) {
        throw error; // Rethrow the error so it can be handled by the caller
      } finally {
        setLoading(false);
      }
    } else {
      // The endpoints require authentication, get access token cookie and check if it's expired
      const access_token_cookie = getCookie('access_token_cookie');
     
      if (access_token_cookie) {
        setLoading(true);
        try {
          const response = await fetch(endpoint, {
            method,
            headers: {
              "Content-Type": "application/json",
              ...headers,
            },
            body: JSON.stringify(body),
            credentials: "include", // Include credentials for cross-origin requests
          });
  
          if (!response.ok) {
            const errorText = await response.text(); // Get the full response text
            throw new Error(`Error: ${response.status} ${response.statusText}\n${errorText}`);
          }
  
          const data = await response.json();
  
          if (data.error) {
            throw new Error(data.error);
          } else {
            return data;
          }
        } catch (error: any) {
          throw error; // Rethrow the error so it can be handled by the caller
        } finally {
          setLoading(false);
        }
      } else {
        // Access token cookie absent or is expired
        document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        navigate('/login') // Redirect to login page
        throw new Error('Session expired, redirecting to login');
      }
    } 
  };

  return { fetchData, loading };
};

export default useFetch;
