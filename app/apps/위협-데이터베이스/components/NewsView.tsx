import React, { useEffect, useState } from 'react';
import { generateSecurityNews } from '../services/geminiService';
import { NewsItem } from '../types';
import { motion } from 'framer-motion';
import { Globe, AlertCircle, Calendar, ExternalLink } from 'lucide-react';

const NewsView: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      const data = await generateSecurityNews();
      setNews(data);
      setLoading(false);
    };
    fetchNews();
  }, []);

  const getImpactLabel = (level: string) => {
    switch(level) {
        case 'Critical': return '치명적 (Critical)';
        case 'High': return '높음 (High)';
        case 'Medium': return '중간 (Medium)';
        case 'Low': return '낮음 (Low)';
        default: return level;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-lab-400 space-y-4">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="font-mono text-sm animate-pulse">최신 보안 위협 스캔 및 뉴스 수집 중...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-8">
        <Globe className="w-8 h-8 text-primary-600" />
        <h2 className="text-3xl font-bold text-lab-800">위협 데이터베이스</h2>
      </div>

      <div className="grid gap-6">
        {news.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-6 rounded-xl border border-lab-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
          >
            <div className={`absolute left-0 top-0 bottom-0 w-2 
              ${item.impactLevel === 'Critical' ? 'bg-red-600' : 
                item.impactLevel === 'High' ? 'bg-orange-500' : 
                item.impactLevel === 'Medium' ? 'bg-yellow-400' : 'bg-primary-500'}`} 
            />
            
            <div className="flex justify-between items-start mb-2 pl-4">
              <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded 
                ${item.impactLevel === 'Critical' ? 'bg-red-100 text-red-700' : 
                  item.impactLevel === 'High' ? 'bg-orange-100 text-orange-700' : 'bg-lab-100 text-lab-600'}`}>
                {getImpactLabel(item.impactLevel)}
              </span>
              <div className="flex items-center text-lab-400 text-xs">
                <Calendar className="w-3 h-3 mr-1" />
                {item.date}
              </div>
            </div>

            <h3 className="text-xl font-bold text-lab-800 mb-2 pl-4">{item.headline}</h3>
            <p className="text-lab-600 pl-4 leading-relaxed mb-4">{item.summary}</p>
            
            {item.url && (
              <div className="pl-4 flex justify-end">
                <a 
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-800 font-medium transition-colors"
                >
                  원문 보기 <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default NewsView;