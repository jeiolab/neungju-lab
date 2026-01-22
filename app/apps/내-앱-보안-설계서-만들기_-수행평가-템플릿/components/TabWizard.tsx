import React, { useEffect, useState } from 'react';
import { WizardState } from '../types';
import { Shield, AlertTriangle, CheckCircle, Info, Lock } from 'lucide-react';

interface TabWizardProps {
  wizardData: WizardState;
  setWizardData: React.Dispatch<React.SetStateAction<WizardState>>;
  onComplete: () => void;
}

const TabWizard: React.FC<TabWizardProps> = ({ wizardData, setWizardData, onComplete }) => {
  const [localStep, setLocalStep] = useState(wizardData.step);

  // Sync internal step with global state step
  useEffect(() => {
    setLocalStep(wizardData.step);
  }, [wizardData.step]);

  const updateField = (field: keyof WizardState, value: any) => {
    setWizardData(prev => ({ ...prev, [field]: value }));
  };

  const updateDeepField = (category: 'securityTech' | 'operations', field: string, value: string) => {
    setWizardData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const handleNext = () => {
    if (localStep < 5) {
      setWizardData(prev => ({ ...prev, step: prev.step + 1 }));
    } else {
      // Final calculation logic
      calculateScore();
      setWizardData(prev => ({ ...prev, isComplete: true }));
      onComplete();
    }
  };

  const handleBack = () => {
    if (localStep > 1) {
      setWizardData(prev => ({ ...prev, step: prev.step - 1 }));
    }
  };

  const calculateScore = () => {
    let score = 50; // Base score
    const badges: string[] = [];
    const { collectedData, securityTech, operations } = wizardData;

    // 1. Data Minimization
    if (collectedData.includes('없음') || collectedData.length <= 2) {
      score += 10;
      badges.push('데이터 최소수집');
    }

    // 2. Password Logic
    if (collectedData.includes('비밀번호')) {
      if (securityTech.passwordStorage.includes('해시')) score += 20;
      else score -= 20;
    }

    // 3. Personal Info Logic
    if (collectedData.some(d => ['전화번호', '주민등록번호', '주소'].includes(d))) {
      if (securityTech.personalData === '암호화(AES 등) 저장') score += 10;
      else if (securityTech.personalData === '평문 저장') score -= 10;
    }

    // 4. HTTPS
    if (securityTech.communication === 'HTTPS(TLS) 적용') score += 10;
    else score -= 10;

    // 5. Operations
    if (operations.logging === '민감정보 마스킹 후 저장' || operations.logging === '로그 남기지 않음') {
      score += 5;
      badges.push('로그 청결');
    }
    if (operations.keyManagement === '소스코드와 분리하여 환경변수/KMS 사용') {
      score += 5;
    }

    setWizardData(prev => ({ ...prev, score: Math.min(100, Math.max(0, score)), badges }));
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-bold flex items-center gap-2">
        <span className="bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
        서비스 소개
      </h3>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">서비스 이름</label>
        <input 
          type="text" 
          className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          placeholder="예: 급식 리뷰 앱, 스터디 출석부"
          value={wizardData.serviceName}
          onChange={(e) => updateField('serviceName', e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">한 줄 설명</label>
        <textarea 
          className="w-full border p-2 rounded-lg h-24 focus:ring-2 focus:ring-indigo-500 outline-none"
          placeholder="이 앱은 어떤 기능을 제공하나요?"
          value={wizardData.serviceDescription}
          onChange={(e) => updateField('serviceDescription', e.target.value)}
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-bold flex items-center gap-2">
        <span className="bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
        데이터 수집 (Data Check)
      </h3>
      <div className="bg-blue-50 p-4 rounded-lg flex gap-3 text-blue-800 text-sm">
        <Info className="w-5 h-5 flex-shrink-0" />
        <p>팁: <strong>최소 권한의 원칙</strong>에 따라 꼭 필요한 데이터만 수집하세요. 수집하는 데이터가 많을수록 지켜야 할 책임도 커집니다.</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {['아이디/닉네임', '비밀번호', '이름(실명)', '전화번호', '이메일', '학교/학년/반', '위치 정보', '사진/파일', '없음'].map((item) => (
          <label key={item} className={`flex items-center p-3 rounded-lg border cursor-pointer hover:bg-gray-50 ${wizardData.collectedData.includes(item) ? 'bg-indigo-50 border-indigo-300 ring-1 ring-indigo-300' : ''}`}>
            <input 
              type="checkbox" 
              className="mr-3 w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
              checked={wizardData.collectedData.includes(item)}
              onChange={(e) => {
                const newData = e.target.checked 
                  ? [...wizardData.collectedData, item]
                  : wizardData.collectedData.filter(i => i !== item);
                updateField('collectedData', newData);
              }}
            />
            {item}
          </label>
        ))}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-bold flex items-center gap-2">
        <span className="bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
        위협 시나리오 (Threat Modeling)
      </h3>
      <p className="text-gray-600 text-sm">내 앱에서 발생할 수 있는 나쁜 일들을 상상해봅시다.</p>
      <div className="space-y-3">
        {[
          { id: 'sniffing', label: '네트워크 도청 (카페 와이파이에서 누가 내 통신을 훔쳐봄)', icon: <CheckCircle className="w-4 h-4" /> },
          { id: 'leak', label: '데이터베이스 유출 (해커가 서버를 털어감)', icon: <AlertTriangle className="w-4 h-4" /> },
          { id: 'spoofing', label: '신분 위장 (다른 사람이 내 아이디로 로그인)', icon: <Shield className="w-4 h-4" /> },
          { id: 'ddos', label: '서비스 마비 (접속자가 너무 많아 서버 다운)', icon: <AlertTriangle className="w-4 h-4" /> }
        ].map((threat) => (
          <label key={threat.id} className={`flex items-center p-4 rounded-lg border cursor-pointer hover:bg-red-50 transition-colors ${wizardData.threats.includes(threat.id) ? 'bg-red-50 border-red-300' : ''}`}>
            <input 
              type="checkbox" 
              className="mr-3 w-4 h-4 text-red-600 rounded focus:ring-red-500"
              checked={wizardData.threats.includes(threat.id)}
              onChange={(e) => {
                const newThreats = e.target.checked 
                  ? [...wizardData.threats, threat.id]
                  : wizardData.threats.filter(t => t !== threat.id);
                updateField('threats', newThreats);
              }}
            />
            <span className="flex-1 font-medium text-gray-800">{threat.label}</span>
          </label>
        ))}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold flex items-center gap-2">
        <span className="bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">4</span>
        보안 기술 적용
      </h3>
      
      {/* Dynamic Recommendation */}
      {wizardData.collectedData.includes('비밀번호') && (
        <div className="bg-orange-50 p-3 rounded-lg border border-orange-200 text-orange-800 text-sm flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 mt-0.5" />
          <span><strong>주의:</strong> 비밀번호를 수집하고 있습니다. 반드시 '해시(Hash)' 기술을 사용해야 합니다.</span>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">1. 비밀번호 저장 방식</label>
          <select 
            className="w-full border p-2 rounded-lg"
            value={wizardData.securityTech.passwordStorage}
            onChange={(e) => updateDeepField('securityTech', 'passwordStorage', e.target.value)}
          >
            <option value="">선택하세요</option>
            <option value="평문 저장 (Plain Text)">그냥 텍스트로 저장 (위험!)</option>
            <option value="대칭키 암호화">암호화하여 저장 (키 털리면 위험)</option>
            <option value="단방향 해시(SHA-256) + Salt">단방향 해시 + Salt 사용 (권장)</option>
            <option value="저장 안 함">저장 안 함 (OAuth 등 외부 로그인)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">2. 통신 보안</label>
          <select 
            className="w-full border p-2 rounded-lg"
            value={wizardData.securityTech.communication}
            onChange={(e) => updateDeepField('securityTech', 'communication', e.target.value)}
          >
             <option value="">선택하세요</option>
            <option value="HTTP 사용">일반 HTTP (보안 없음)</option>
            <option value="HTTPS(TLS) 적용">HTTPS(TLS) 적용 (권장)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">3. 개인정보(전화번호 등) 저장</label>
          <select 
            className="w-full border p-2 rounded-lg"
            value={wizardData.securityTech.personalData}
            onChange={(e) => updateDeepField('securityTech', 'personalData', e.target.value)}
          >
             <option value="">선택하세요</option>
            <option value="수집 안 함">수집 안 함</option>
            <option value="평문 저장">평문 저장</option>
            <option value="암호화(AES 등) 저장">암호화(AES 등) 저장 (권장)</option>
            <option value="해시 저장">해시 저장 (검색용 등 특수목적)</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold flex items-center gap-2">
        <span className="bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">5</span>
        운영 및 관리 규칙
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">1. 암호화 키(Key) 관리</label>
          <div className="grid grid-cols-1 gap-2">
            {[
              '소스코드에 포함 (하드코딩) - 위험!',
              'DB에 데이터와 함께 저장 - 위험!',
              '소스코드와 분리하여 환경변수/KMS 사용 - 권장'
            ].map(opt => (
              <label key={opt} className="flex items-center gap-2 p-2 border rounded hover:bg-gray-50 cursor-pointer">
                <input 
                  type="radio" 
                  name="keyManagement" 
                  value={opt}
                  checked={wizardData.operations.keyManagement === opt}
                  onChange={(e) => updateDeepField('operations', 'keyManagement', e.target.value)}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm">{opt}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">2. 로그(Log) 정책</label>
           <select 
            className="w-full border p-2 rounded-lg"
            value={wizardData.operations.logging}
            onChange={(e) => updateDeepField('operations', 'logging', e.target.value)}
          >
            <option value="">선택하세요</option>
            <option value="모든 데이터 원문 기록">모든 요청/응답 원문 기록</option>
            <option value="민감정보 마스킹 후 저장">민감정보(비번 등) 마스킹 후 저장 (권장)</option>
            <option value="로그 남기지 않음">로그 남기지 않음</option>
          </select>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="h-2 bg-gray-200 rounded-full">
          <div 
            className="h-2 bg-indigo-600 rounded-full transition-all duration-300" 
            style={{ width: `${(localStep / 5) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>시작</span>
          <span>완료</span>
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 min-h-[400px]">
        {localStep === 1 && renderStep1()}
        {localStep === 2 && renderStep2()}
        {localStep === 3 && renderStep3()}
        {localStep === 4 && renderStep4()}
        {localStep === 5 && renderStep5()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <button 
          onClick={handleBack}
          disabled={localStep === 1}
          className={`px-6 py-2 rounded-lg font-medium ${localStep === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
        >
          이전
        </button>
        <button 
          onClick={handleNext}
          className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 shadow-md transition-all active:scale-95"
        >
          {localStep === 5 ? '설계 완료 및 리포트 생성' : '다음 단계'}
        </button>
      </div>
    </div>
  );
};

export default TabWizard;
