import { useContext, createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getUserId, getUserName, getUserRole } from "./auth.js";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [token, setToken] = useState(sessionStorage.getItem("token") || "");
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [role, setRole] = useState(null);

  const navigate = useNavigate();

  // Atualiza estado e headers do Axios sempre que o token mudar
  useEffect(() => {
    if (token) {
      sessionStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      setUser(getUserName());
      setUserId(getUserId());
      setRole(getUserRole());
    } else {
      delete axios.defaults.headers.common["Authorization"];
      sessionStorage.removeItem("token");
      setUser(null);
      setUserId(null);
      setRole(null);
    }
  }, [token]);

  // Login com redirecionamento por role
  const loginAction = async (data) => {
    try {
      const payload = {
        userName: data.username,
        password: data.password,
      };

      const res = await axios.post(`${apiUrl}/authorization/token`, payload);
      setToken(res.data);

      const userRole = getUserRole();
      // Redireciona de acordo com a role
      switch (userRole) {
        case "admin":
          navigate("/admin/dashboard");
          break;
        case "manager":
          navigate("/manager/home");
          break;
        case "user":
        default:
          navigate("/user/home");
          break;
      }
    } catch (err) {
      console.error("Erro ao fazer login:", err);
      alert("Falha no login. Verifique suas credenciais.");
    }
  };

  // Logout
  const logOutAction = () => {
    setToken("");
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{ token, user, userId, role, loginAction, logOutAction }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthProvider;
