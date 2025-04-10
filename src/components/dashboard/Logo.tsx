import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark' | 'color';
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', variant = 'color' }) => {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-14'
  };

  const logoColors = {
    light: 'text-white',
    dark: 'text-gray-900 dark:text-white',
    color: 'text-transparent'
  };

  return (
    <div className={`flex items-center ${sizeClasses[size]}`}>
      <div className="relative flex-shrink-0">
        {/* Effet d'éclat lumineux */}
        <div className="absolute -inset-0.5 rounded-full blur-md bg-gradient-to-r from-primary-400 via-secondary-500 to-primary-600 opacity-70 dark:opacity-90 animate-pulse-slow"></div>
        
        {/* Logo */}
        <div className={`relative flex items-center justify-center ${sizeClasses[size]} aspect-square rounded-full bg-gradient-to-br from-primary-500 via-secondary-500 to-primary-600 shadow-lg`}>
          <span className="text-white font-bold text-lg sm:text-xl md:text-2xl tracking-tight">O</span>
        </div>
      </div>
      
      <div className="ml-3 flex flex-col">
        <h1 className={`font-heading font-bold text-lg sm:text-xl md:text-2xl leading-none ${variant === 'color' ? 'bg-gradient-to-r from-primary-600 via-secondary-500 to-primary-600 bg-clip-text text-transparent' : logoColors[variant]}`}>
          OYA
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          Libérez l'avenir du travail
        </p>
      </div>
    </div>
  );
}; 