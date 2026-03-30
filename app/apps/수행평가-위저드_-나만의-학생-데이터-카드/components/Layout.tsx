import React from 'react';

interface Props {
  children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <div className="min-h-screen bg-white">
      <main className="max-w-6xl mx-auto p-4 md:p-6">
        {children}
      </main>
    </div>
  );
};

export default Layout;