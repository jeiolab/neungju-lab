import React from 'react';
import { Network } from 'lucide-react';

export const TabDeepDive: React.FC = () => {
  return (
    <div className="p-4 pb-20 space-y-6 animate-fade-in">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">컴퓨터는 어떻게 줄을 세울까?</h2>
        <p className="text-gray-600 text-sm">
          방금 우리가 시간을 쪼개 썼던 것처럼, 컴퓨터도 데이터를 쪼개서 정렬해요. 
          가장 대표적인 <strong>'병합 정렬(Merge Sort)'</strong>을 알아봅시다.
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Network className="w-5 h-5 text-purple-500" />
          병합 정렬 시각화
        </h3>
        
        <div className="space-y-6">
          {/* Step 1 */}
          <div className="text-center">
            <div className="text-xs text-gray-400 mb-1">1. 무작위 숫자들</div>
            <div className="flex justify-center gap-2">
              {[8, 3, 5, 1].map(n => (
                <div key={n} className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center font-bold text-gray-700">
                  {n}
                </div>
              ))}
            </div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center"><div className="w-0.5 h-6 bg-gray-300"></div></div>

          {/* Step 2: Split */}
          <div className="text-center">
            <div className="text-xs text-gray-400 mb-1">2. 반으로 나누기 (Divide)</div>
            <div className="flex justify-center gap-8">
              <div className="flex gap-2">
                 <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center font-bold text-blue-700">8</div>
                 <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center font-bold text-blue-700">3</div>
              </div>
              <div className="flex gap-2">
                 <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center font-bold text-blue-700">5</div>
                 <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center font-bold text-blue-700">1</div>
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center"><div className="w-0.5 h-6 bg-gray-300"></div></div>

           {/* Step 3: Sort & Merge */}
           <div className="text-center">
            <div className="text-xs text-gray-400 mb-1">3. 정렬하며 합치기 (Conquer & Combine)</div>
            <div className="flex justify-center gap-2">
              {[1, 3, 5, 8].map(n => (
                <div key={n} className="w-10 h-10 bg-purple-100 border-2 border-purple-500 rounded-lg flex items-center justify-center font-bold text-purple-700 animate-pulse">
                  {n}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 bg-gray-50 p-4 rounded-xl text-sm text-gray-600 leading-relaxed">
          <p>
            8개의 데이터를 그냥 정렬하려면 64번(8x8) 비교해야 할 수도 있지만, 
            이렇게 반씩 쪼개서 하면 24번(8x3) 정도면 충분해요. 
            데이터가 많아질수록 이 차이는 엄청나게 커진답니다!
            (시간 복잡도: O(n log n))
          </p>
        </div>
      </div>
    </div>
  );
};