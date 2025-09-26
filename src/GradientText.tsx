import React from 'react';

interface GradientTextProps {
  colors: string[];
  animationSpeed?: number;
  showBorder?: boolean;
  className?: string;
  children: React.ReactNode;
}

const GradientText: React.FC<GradientTextProps> = ({
  colors,
  animationSpeed = 2,
  showBorder = false,
  className = '',
  children
}) => {
  // Generate unique gradient ID for CSS
  // const gradientId = `gradient-${Math.random().toString(36).substr(2, 9)}`;
  
  const gradientColors = colors.join(', ');
  
  return (
    <div className={`relative ${className}`}>
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .gradient-text {
          background: linear-gradient(45deg, ${gradientColors});
          background-size: 300% 300%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradientShift ${animationSpeed}s ease-in-out infinite;
        }
      `}</style>
      
      <span 
        className={`gradient-text font-bold ${showBorder ? 'border-2 border-transparent bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-border' : ''}`}
      >
        {children}
      </span>
    </div>
  );
};

export default GradientText;
