import React from 'react';
import { motion } from 'framer-motion';
import { Video, FileSpreadsheet, Cctv, MessageCircle, CloudLightning, FileQuestion } from 'lucide-react';
import { FloatingItemInstance } from '../types';

interface FloatingIconProps {
  item: FloatingItemInstance;
  onClick: (item: FloatingItemInstance) => void;
}

const FloatingIcon: React.FC<FloatingIconProps> = ({ item, onClick }) => {
  const getIcon = () => {
    switch (item.iconName) {
      case 'video': return <Video size={32} />;
      case 'file-spreadsheet': return <FileSpreadsheet size={32} />;
      case 'cctv': return <Cctv size={32} />;
      case 'message-circle': return <MessageCircle size={32} />;
      case 'cloud-lightning': return <CloudLightning size={32} />;
      default: return <FileQuestion size={32} />;
    }
  };

  return (
    <motion.div
      className={`absolute cursor-pointer flex flex-col items-center justify-center p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg hover:bg-white/20 transition-colors z-10 ${item.color}`}
      style={{
        left: `${item.x}%`,
        top: `${item.y}%`,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: [0, -20, 0], // Floating effect
      }}
      transition={{
        y: {
          duration: item.duration,
          repeat: Infinity,
          ease: "easeInOut"
        },
        opacity: { duration: 0.5 }
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => onClick(item)}
    >
      <div className="mb-1">{getIcon()}</div>
      <span className="text-xs font-bold text-white whitespace-nowrap drop-shadow-md">{item.name}</span>
    </motion.div>
  );
};

export default FloatingIcon;