import React from 'react';

const TabDeepDive: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">심화 학습: 생성형 AI 모델 비교</h2>
        <p className="text-gray-600 mt-2">
          이미지 생성 분야의 두 거인, GAN과 Diffusion 모델의 차이점을 알아봅시다.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* GAN Card */}
        <div className="bg-white rounded-xl shadow-lg border border-purple-100 overflow-hidden">
          <div className="bg-purple-600 p-4 text-white">
            <h3 className="text-xl font-bold">GAN (Generative Adversarial Network)</h3>
            <p className="text-purple-100 text-sm">적대적 생성 신경망</p>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-center space-x-4 mb-6 text-sm font-bold">
              <div className="bg-red-100 text-red-700 px-3 py-2 rounded-lg text-center w-24">
                생성자<br/>(위조범)
              </div>
              <span className="text-2xl text-gray-400">VS</span>
              <div className="bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-center w-24">
                판별자<br/>(경찰)
              </div>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed mb-4">
              <strong>작동 원리:</strong> 생성자는 가짜 데이터를 만들고, 판별자는 이것이 진짜인지 가짜인지 구별합니다. 서로 경쟁하며 성능이 향상됩니다.
            </p>
            <ul className="space-y-2 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
              <li className="flex items-start">
                <span className="mr-2 text-green-500">✔</span> 
                <span>생성 속도가 빠르다.</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-red-500">✖</span> 
                <span>학습이 불안정할 수 있다 (Mode Collapse).</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Diffusion Card */}
        <div className="bg-white rounded-xl shadow-lg border border-indigo-100 overflow-hidden">
          <div className="bg-indigo-600 p-4 text-white">
            <h3 className="text-xl font-bold">Diffusion Model</h3>
            <p className="text-indigo-100 text-sm">확산 모델</p>
          </div>
          <div className="p-6">
             <div className="flex items-center justify-center space-x-2 mb-6 text-sm font-bold">
              <div className="w-8 h-8 rounded-full bg-gray-900"></div>
              <span className="text-gray-400">→</span>
              <div className="w-8 h-8 rounded-full bg-gray-500"></div>
              <span className="text-gray-400">→</span>
              <div className="w-8 h-8 rounded-full bg-gray-200 border border-gray-400"></div>
              <span className="text-xs text-gray-500 mx-2">(Denoising)</span>
              <div className="w-8 h-8 rounded-full bg-indigo-500"></div>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed mb-4">
              <strong>작동 원리:</strong> 이미지에 노이즈를 점진적으로 추가하여 완전히 망가뜨린 후, 이를 역으로 복원(Denoising)하는 과정을 학습합니다.
            </p>
            <ul className="space-y-2 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
               <li className="flex items-start">
                <span className="mr-2 text-green-500">✔</span> 
                <span>매우 고품질의 이미지를 생성한다. (Stable Diffusion 등)</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-red-500">✖</span> 
                <span>생성 속도가 상대적으로 느리다.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
        <h4 className="font-bold text-gray-900 mb-3">💡 기술 교육 담당자의 팁</h4>
        <p className="text-gray-700 text-sm">
          "과거에는 GAN이 대세였으나, 최근에는 <strong>Diffusion 모델</strong>이 이미지 생성 분야를 지배하고 있습니다. 
          하지만 실시간 영상 처리 등 속도가 중요한 분야에서는 여전히 GAN이나 그의 변형 모델들이 활발히 사용됩니다. 
          기술의 우열보다는 <strong>목적에 맞는 모델 선택</strong>이 중요합니다."
        </p>
      </div>
    </div>
  );
};

export default TabDeepDive;