import React from 'react';
import PuzzleGame from './PracticeTab/PuzzleGame';
import FileExperiment from './PracticeTab/FileExperiment';

interface PracticeTabProps {
  onSuccess: (xp: number) => void;
}

const PracticeTab: React.FC<PracticeTabProps> = ({ onSuccess }) => {
  return (
    <div className="space-y-8 pb-24 md:pb-0 animate-in fade-in duration-500">
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          🧩 파이프라인 퍼즐
        </h2>
        <PuzzleGame onSuccess={onSuccess} />
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
           🧪 데이터 흐름 실험실
        </h2>
        <FileExperiment onActivity={() => onSuccess(5)} />
      </section>
    </div>
  );
};

export default PracticeTab;
