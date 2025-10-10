import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.REACT_APP_API_URL ||
    (typeof window !== "undefined"
      ? `${window.location.origin}/api`
      : "http://localhost:5000/api"),
  timeout: 10000,
});

// Optional logging for clarity
api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("API Error:", err.message);
    return Promise.reject(err);
  }
);

export default api;
