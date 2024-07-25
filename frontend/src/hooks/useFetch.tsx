import { useState } from "react";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

interface FetchOptions {
  method: HttpMethod;
  endpoint: string;
  headers?: Record<string, string>;
  body?: any;
}

const useFetch = () => {
  const [loading, setLoading] = useState(false);

  const fetchData = async ({
    method,
    endpoint,
    headers,
    body,
  }: FetchOptions): Promise<any> => {
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
  };

  return { fetchData, loading };
};

export default useFetch;
