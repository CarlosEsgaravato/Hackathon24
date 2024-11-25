import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { jwtDecode } from "jwt-decode";
import "./layoutdashboard.css";

interface DecodedToken {
  funcao: string;
}

const LayoutDashboard = ({ children }: { children: React.ReactNode }) => {
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Novo estado de carregamento
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const parts = token.split(".");
      if (parts.length !== 3) {
        console.error("Token inválido: formato incorreto.");
        setUserRole(null);
        setIsLoading(false);
        return;
      }
  
      try {
        const decoded = jwtDecode<{ role: string }>(token); // Altere para 'role' se for o nome da chave correta no seu token
        console.log("Decoded Token:", decoded);  // Adicionando log para ver o conteúdo do token
        setUserRole(decoded.role || null); // Atribua o valor correto  // Recebe "admin" ou "usuario"
      } catch (error) {
        console.error("Erro ao decodificar o token:", error);
        setUserRole(null);
      }
    } else {
      setUserRole(null);
    }
  
    setIsLoading(false);
  }, []);
  

  const toggleMenu = () => {
    setMenuVisible(!isMenuVisible);
  };

  const handleNavigate = (path: string) => {
    router.push(path);
    setMenuVisible(false); // Esconde o menu após a navegação
  };

  const handleLogout = () => {
    // Limpar o token do localStorage
    localStorage.removeItem("token");

    // Redirecionar para a página de login
    router.push("/login");
  };

  if (isLoading) {
    return <div>Carregando...</div>; // Mensagem enquanto verifica o estado do token
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="menu-icon" onClick={toggleMenu}>
          ☰
        </div>
        <div className="dashboard-right-icons">
          <span className="notification-icon">🔔</span>
          <span className="logout-icon" onClick={handleLogout}>
            Sair
          </span>
        </div>
      </header>
  
      {/* Menu lateral */}
      <div className={`sidebar ${isMenuVisible ? "visible" : ""}`}>
        <ul>
          <li onClick={() => handleNavigate("/")}>Home</li>

  
          {userRole === "admin" && (
            <>
              <li onClick={() => handleNavigate("/dashboard")}>Dashboard</li>
              <li onClick={() => handleNavigate("/cadastro-ambiente")}>
                Cadastro de Ambiente
              </li>
              <li onClick={() => handleNavigate("/cadastro-usuario")}>
                Cadastro de Usuário
              </li>
            </>
          )}
        </ul>
      </div>
  
      <main className="dashboard-main-content">{children}</main>
    </div>
  );
  
};

export default LayoutDashboard;
