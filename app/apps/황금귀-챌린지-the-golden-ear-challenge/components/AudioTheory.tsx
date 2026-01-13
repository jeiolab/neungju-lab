import React from 'react';
import { BookOpen } from 'lucide-react';

const AudioTheory: React.FC = () => {
  return (
    <div className="h-full overflow-y-auto bg-studio-800 rounded-lg shadow-2xl border border-studio-700 p-8 custom-scrollbar">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-studio-accent mb-8 flex items-center gap-3">
          <BookOpen className="w-8 h-8" /> 디지털 오디오 이론
        </h2>

        <section className="mb-10">
          <h3 className="text-xl font-bold text-white mb-4 border-l-4 border-studio-accent pl-3">1. 아날로그-디지털 변환 (ADC)</h3>
          <p className="text-gray-300 leading-relaxed mb-4">
            소리는 자연 상태에서 연속적인 파형으로 존재합니다. 하지만 컴퓨터는 디지털이므로 이산적인 숫자만 저장할 수 있습니다. 소리를 캡처하려면 파형의 '스냅샷'을 일정한 간격으로 찍어야 합니다.
          </p>
          <div className="bg-studio-900 p-6 rounded-lg border border-studio-600 mb-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="h-20 flex items-center justify-center border-b border-gray-700 mb-2">
                  <svg width="100" height="40" className="text-success">
                    <path d="M0,20 Q25,0 50,20 T100,20" fill="none" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </div>
                <p className="text-xs text-gray-500">아날로그 (연속적)</p>
              </div>
              <div className="text-center">
                <div className="h-20 flex items-center justify-center border-b border-gray-700 mb-2">
                   <div className="flex items-end justify-center gap-1 h-10">
                      <div className="w-2 bg-studio-accent h-[40%]"></div>
                      <div className="w-2 bg-studio-accent h-[80%]"></div>
                      <div className="w-2 bg-studio-accent h-[60%]"></div>
                      <div className="w-2 bg-studio-accent h-[30%]"></div>
                      <div className="w-2 bg-studio-accent h-[50%]"></div>
                   </div>
                </div>
                <p className="text-xs text-gray-500">디지털 (불연속적)</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <h3 className="text-xl font-bold text-white mb-4 border-l-4 border-studio-accent pl-3">2. 나이퀴스트 이론 (The Nyquist Theorem)</h3>
          <p className="text-gray-300 leading-relaxed mb-4">
            소리 파형을 완벽하게 재구성하려면, 캡처하려는 가장 높은 주파수보다 최소 <strong>2배</strong> 빠르게 샘플링해야 합니다.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-400">
            <li>인간의 가청 한계: <span className="text-white font-mono">20,000 Hz (20kHz)</span></li>
            <li>필요한 샘플링 레이트: <span className="text-white font-mono">20kHz × 2 = 40kHz</span></li>
            <li>표준 CD 레이트: <span className="text-white font-mono">44.1kHz</span> (필터 처리를 위한 여유 공간 포함)</li>
          </ul>
        </section>

        <section>
          <h3 className="text-xl font-bold text-white mb-4 border-l-4 border-studio-accent pl-3">3. 지각적 코딩 (MP3)</h3>
          <p className="text-gray-300 leading-relaxed mb-4">
            MP3는 단순히 파일을 '압축'하는 것이 아닙니다. <strong>심리음향학(Psychoacoustics)</strong>을 이용하여 사람이 잘 듣지 못하는 데이터를 과감히 버립니다.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-studio-700 p-4 rounded text-sm">
                <strong className="block text-warn mb-1">마스킹 효과 (Masking Effect)</strong>
                큰 드럼 소리와 작은 숨소리가 동시에 나면, 귀는 숨소리를 인식하지 못합니다. MP3는 이때 숨소리 데이터를 삭제하여 용량을 줄입니다.
            </div>
            <div className="bg-studio-700 p-4 rounded text-sm">
                <strong className="block text-danger mb-1">주파수 컷오프 (Frequency Cutoff)</strong>
                대부분의 성인은 16kHz 이상의 소리를 잘 듣지 못합니다. 128kbps MP3는 보통 이 대역 이상의 소리를 삭제합니다.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AudioTheory;