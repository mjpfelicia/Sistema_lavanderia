import React, { ComponentType } from 'react';
import { Link } from 'react-router-dom';
import { LuArrowLeft } from 'react-icons/lu';
import type { IconBaseProps, IconType } from 'react-icons';
import './BackToHome.css';

interface BackToHomeProps {
  variant?: 'icon' | 'full';
  className?: string;
}

const renderIcon = (icon: IconType, props?: IconBaseProps) =>
  React.createElement(icon as ComponentType<IconBaseProps>, props) as JSX.Element;

const BackToHome: React.FC<BackToHomeProps> = ({ variant = 'icon', className = '' }) => {
  const baseClass = `back-to-home back-to-home--${variant}`;

  if (variant === 'icon') {
    return (
      <Link to="/" className={`${baseClass} ${className}`} title="Voltar para Home">
        {renderIcon(LuArrowLeft, { size: 20 })}
      </Link>
    );
  }

  return (
    <Link to="/" className={`${baseClass} ${className}`}>
      {renderIcon(LuArrowLeft, { size: 18 })}
      <span>Voltar para Home</span>
    </Link>
  );
};

export default BackToHome;
