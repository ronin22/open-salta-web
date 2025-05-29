import React from 'react';

const FormSection = ({ title, icon, children }) => {
  return (
    <div>
      <h3 className="text-xl font-semibold text-foreground mb-4 border-b border-border pb-2 flex items-center">
        {icon} {title}
      </h3>
      {children}
    </div>
  );
};

export default FormSection;