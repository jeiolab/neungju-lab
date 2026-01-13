import React, { useState, useEffect } from 'react';
import { Tab, PixelArt, CompressionMode } from './types';
import DesignLab from './components/DesignLab';
import Gallery from './components/Gallery';
import DevNotes from './components/DevNotes';
import QATest from './components/QATest';
import PlanningMeeting from './components/PlanningMeeting';
import { Palette, Image as ImageIcon, Book, CheckSquare, Coffee, Menu } from 'lucide-react';
import { FLOPPY_DISK_CAPACITY } from './constants';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.DESIGN_LAB);
  const [gallery, setGallery] = useState<PixelArt[]>([]);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('pixelArtMaster_gallery');
    if (saved) {
      setGallery(JSON.parse(saved));
    }
  }, []);

  const handleSaveArt = (grid: string[], mode: CompressionMode, originalSize: number, compressedSize: number) => {
    const newArt: PixelArt = {
      id: Date.now().toString(),
      name: `Asset_${gallery.length + 1}`,
      grid,
      size: 16,
      originalSize,
      compressedSize,
      mode,
      timestamp: Date.now()
    };
    
    const updatedGallery = [...gallery, newArt];
    setGallery(updatedGallery);
    localStorage.setItem('pixelArtMaster_gallery', JSON.stringify(updatedGallery));
    setActiveTab(Tab.GALLERY);
  };

  const handleDeleteArt = (id: string) => {
    const updated = gallery.filter(g => g.id !== id);
    setGallery(updated);
    localStorage.setItem('pixelArtMaster_gallery', JSON.stringify(updated));
  }

  const getTotalUsedBytes = () => gallery.reduce((acc, item) => acc + item.compressedSize, 0);

  return (
    <div className="h-screen w-screen bg-retro-bg text-gray-200 flex flex-col font-mono overflow-hidden">
      {/* Header */}
      <header className="bg-retro-panel border-b border-gray-700 p-4 flex justify-between items-center z-10 shadow-lg">
        <h1 className="text-xl md:text-2xl font-retro text-retro-green tracking-tighter flex items-center gap-2">
            <span className="bg-retro-green text-black px-2 rounded">PX</span> 픽셀 아트 마스터
        </h1>
        
        {/* Floppy Usage */}
        <div className="hidden md:flex items-center gap-3 bg-black px-4 py-2 rounded border border-gray-600">
            <div className="text-xs text-gray-400">플로피 디스크:</div>
            <div className="w-32 h-3 bg-gray-800 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-retro-accent transition-all duration-500" 
                    style={{ width: `${Math.min((getTotalUsedBytes() / FLOPPY_DISK_CAPACITY) * 100 * 1000, 100)}%` }} // Multiplied by 1000 to make it visible for demo
                ></div>
            </div>
            <div className="text-xs font-bold text-retro-accent">{getTotalUsedBytes()} B</div>
        </div>
      </header>

      {/* Main Content Area with Sidebar Navigation */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Navigation Sidebar */}
        <nav className="bg-black/50 w-full md:w-20 lg:w-64 md:border-r border-gray-700 flex flex-row md:flex-col overflow-x-auto md:overflow-hidden">
            <NavButton 
                active={activeTab === Tab.DESIGN_LAB} 
                onClick={() => setActiveTab(Tab.DESIGN_LAB)} 
                icon={<Palette />} 
                label="디자인 랩" 
            />
            <NavButton 
                active={activeTab === Tab.GALLERY} 
                onClick={() => setActiveTab(Tab.GALLERY)} 
                icon={<ImageIcon />} 
                label="갤러리" 
                badge={gallery.length}
            />
            <NavButton 
                active={activeTab === Tab.DEV_NOTES} 
                onClick={() => setActiveTab(Tab.DEV_NOTES)} 
                icon={<Book />} 
                label="개발자 노트" 
            />
            <NavButton 
                active={activeTab === Tab.QA_TEST} 
                onClick={() => setActiveTab(Tab.QA_TEST)} 
                icon={<CheckSquare />} 
                label="QA 테스트" 
            />
            <NavButton 
                active={activeTab === Tab.PLANNING} 
                onClick={() => setActiveTab(Tab.PLANNING)} 
                icon={<Coffee />} 
                label="기획 회의" 
            />
        </nav>

        {/* Dynamic Viewport */}
        <main className="flex-1 overflow-hidden relative bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
            {activeTab === Tab.DESIGN_LAB && <DesignLab onSave={handleSaveArt} />}
            {activeTab === Tab.GALLERY && <Gallery items={gallery} onDelete={handleDeleteArt} />}
            {activeTab === Tab.DEV_NOTES && <DevNotes />}
            {activeTab === Tab.QA_TEST && <QATest />}
            {activeTab === Tab.PLANNING && <PlanningMeeting />}
        </main>
      </div>
    </div>
  );
};

const NavButton = ({ active, onClick, icon, label, badge }: any) => (
    <button
        onClick={onClick}
        className={`
            flex-1 md:flex-none p-4 flex md:flex-row flex-col items-center gap-3 transition-all border-b md:border-b-0 md:border-r-4
            ${active 
                ? 'bg-retro-panel border-retro-green text-retro-green' 
                : 'border-transparent text-gray-500 hover:text-gray-300 hover:bg-gray-800'
            }
        `}
    >
        <span className={active ? 'animate-bounce' : ''}>{icon}</span>
        <span className="font-retro text-[10px] md:text-xs whitespace-nowrap">{label}</span>
        {badge !== undefined && badge > 0 && (
            <span className="ml-auto bg-retro-accent text-black text-[9px] px-1.5 rounded-full font-bold hidden md:inline-block">
                {badge}
            </span>
        )}
    </button>
)

export default App;