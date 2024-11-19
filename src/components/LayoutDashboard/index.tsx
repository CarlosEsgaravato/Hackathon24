import React from 'react';
import './layoutdashboard.css';

const LayoutDashboard = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="menu-icon">☰</div>
        <div className="dashboard-right-icons">
          <span className="notification-icon">🔔</span>
          <span className="logout-icon">Sair</span>
        </div>
      </header>
      <main className="dashboard-main-content">{children}</main>
    </div>
  );
};

export default LayoutDashboard;
