import React, { useState } from 'react';
import { useRouter } from 'next/router';
import './layoutdashboard.css';

const LayoutDashboard = ({ children }: { children: React.ReactNode }) => {
  const [isMenuVisible, setMenuVisible] = useState(false);
  const router = useRouter();

  const toggleMenu = () => {
    setMenuVisible(!isMenuVisible);
  };

  const handleNavigate = (path: string) => {
    router.push(path);
    setMenuVisible(false);  // Esconde o menu após a navegação
  };

  const handleLogout = () => {
    // Limpar o token do localStorage
    localStorage.removeItem('token');

    // Redirecionar para a página de login
    router.push('/login');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="menu-icon" onClick={toggleMenu}>
          ☰
        </div>
        <div className="dashboard-right-icons">
          <span className="notification-icon">🔔</span>
          <span className="logout-icon" onClick={handleLogout}>Sair</span> {/* Logout acionado aqui */}
        </div>
      </header>

      {/* Menu lateral */}
      <div className={`sidebar ${isMenuVisible ? 'visible' : ''}`}>
        <ul>
          <li onClick={() => handleNavigate('/')}>Home</li>
          <li onClick={() => handleNavigate('/dashboard')}>Dashboard</li>
          <li onClick={() => handleNavigate('/cadastro-ambiente')}>Cadastro de Ambiente</li>
          <li onClick={() => handleNavigate('/cadastro-usuario')}>Cadastro de Usuário</li>
          <li onClick={() => handleNavigate('/reserva')}>reserva</li>
        </ul>
      </div>

      <main className="dashboard-main-content">
        {children}
      </main>
    </div>
  );
};

export default LayoutDashboard;
