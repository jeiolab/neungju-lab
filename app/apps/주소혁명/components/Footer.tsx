import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-slate-900 font-bold text-lg mb-2">주소 혁명 IPv4 vs IPv6</p>
        <p className="text-slate-500 text-sm">
          © {new Date().getFullYear()} Educational Project. Built for High School Students.
        </p>
      </div>
    </footer>
  );
};