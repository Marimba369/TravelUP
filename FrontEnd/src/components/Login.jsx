import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const Login = () => {
  const navigate = useNavigate();
  const { loginAction } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [manualUser, setManualUser] = useState({ username: "", password: "" });

  const fixedUsers = [
    {
      id: 1,
      username: "trish.voyager@example.com",
      password: "Password1!",
      name: "Trish Voyager",
      role: "traveler",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    },
    {
      id: 2,
      username: "frank.helper@example.com",
      password: "Password1!",
      name: "Frank Helper",
      role: "facilitator",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    },
    {
      id: 3,
      username: "mary.decisor@example.com",
      password: "Password1!",
      name: "Mary Decisor",
      role: "manager",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg",
    },
  ];

  const handleLogin = async (user) => {
    setIsLoading(true);
    try {
      await loginAction({
        username: user.username,
        password: user.password,
      });

      switch (user.role) {
        case "traveler":
          navigate("/RequestDetail");
          break;
        case "facilitator":
          navigate("/HomeFacilitator");
          break;
        case "manager":
          navigate("/HomeManager");
          break;
        default:
          navigate("/");
      }
    } catch (err) {
      console.error("Erro:", err);
      alert("Falha no login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualLogin = async (e) => {
    e.preventDefault();
    if (!manualUser.username || !manualUser.password) {
      alert("Preencha ambos os campos");
      return;
    }
    await handleLogin({ ...manualUser, role: "user" });
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow-lg animate__animated animate__fadeIn w-100" style={{ maxWidth: "500px" }}>
        <div className="card-header bg-primary text-white text-center">
          <h3>Bem-vindo ao Travel System</h3>
          <p className="mb-0">Login manual ou seleção rápida</p>
        </div>

        <div className="card-body">

          {/* Login Manual */}
          <form onSubmit={handleManualLogin} className="mb-4">
            <div className="mb-3">
              <label className="form-label">Email</label>
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-envelope"></i></span>
                <input
                  type="email"
                  className="form-control"
                  placeholder="seu@email.com"
                  value={manualUser.username}
                  onChange={(e) => setManualUser({ ...manualUser, username: e.target.value })}
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Senha</label>
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-lock"></i></span>
                <input
                  type="password"
                  className="form-control"
                  placeholder="••••••••"
                  value={manualUser.password}
                  onChange={(e) => setManualUser({ ...manualUser, password: e.target.value })}
                />
              </div>
            </div>

            <button className="btn btn-primary w-100" type="submit" disabled={isLoading}>
              {isLoading ? (
                <span className="spinner-border spinner-border-sm"></span>
              ) : (
                "Entrar"
              )}
            </button>
          </form>

          <hr className="my-4" />

          {/* Usuários rápidos */}
          <div className="d-grid gap-3">
            {fixedUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => handleLogin(user)}
                disabled={isLoading}
                className="btn btn-outline-secondary d-flex align-items-center justify-content-between text-start shadow-sm hover-scale"
              >
                <div className="d-flex align-items-center">
                  <img src={user.avatar} alt="avatar" className="rounded-circle me-3" style={{ width: "50px", height: "50px" }} />
                  <div>
                    <strong>{user.name}</strong><br />
                    <small className="text-muted text-capitalize">{user.role}</small>
                  </div>
                </div>
                {isLoading && (
                  <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="card-footer text-center text-muted small">
          <p className="mb-1">Contas pré-configuradas para demonstração.</p>
          <p className="mb-0">Você também pode usar login manual.</p>
        </div>
      </div>

      {/* CSS de animação personalizada */}
      <style>{`
        .hover-scale {
          transition: transform 0.2s ease;
        }
        .hover-scale:hover {
          transform: scale(1.02);
        }
      `}</style>
    </div>
  );
};

export default Login;
