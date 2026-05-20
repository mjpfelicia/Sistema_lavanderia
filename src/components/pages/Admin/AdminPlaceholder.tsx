import React from 'react';
import { Link } from 'react-router-dom';
import BackToHome from '../../buttons/BackToHome';
import './AdminPlaceholder.css';

interface AdminPlaceholderProps {
  title: string;
  description: string;
  icon: string;
}

const AdminPlaceholder: React.FC<AdminPlaceholderProps> = ({ title, description, icon }) => {
  return (
    <div className="admin-placeholder">
      <header className="placeholder-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <BackToHome variant="icon" />
          <div className="header-content">
            <h1>{icon} {title}</h1>
            <p>{description}</p>
          </div>
        </div>
      </header>
      
      <div className="placeholder-content">
        <div className="placeholder-card">
          <span className="placeholder-icon">{icon}</span>
          <h2>Em Desenvolvimento</h2>
          <p>Esta funcionalidade estará disponível em breve!</p>
          <Link to="/admin" className="btn-voltar">
            ← Voltar ao Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminPlaceholder;
