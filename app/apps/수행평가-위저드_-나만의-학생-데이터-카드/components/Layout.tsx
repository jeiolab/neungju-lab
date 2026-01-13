import React from 'react';

interface Props {
  children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <main className="max-w-5xl mx-auto p-4 md:p-6">
        {children}
      </main>
      
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-slate-400 text-sm mt-8">
        <p>© 2024 수행평가 위저드 | Python Basic Series</p>
        <p className="mt-1 text-xs">개인정보는 서버에 저장되지 않으며 브라우저에만 임시 저장됩니다.</p>
      </footer>
    </div>
  );
};

export default Layout;