import React from 'react';

const GuideTab: React.FC = () => {
  return (
    <div className="grid md:grid-cols-2 gap-8 animate-fade-in">
      <div className="bg-white p-6 rounded-2xl shadow-lg border-t-4 border-blue-500">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <img src="https://upload.wikimedia.org/wikipedia/commons/d/da/Google_Drive_logo_%282020%29.svg" alt="Google" className="w-6 h-6 mr-2" />
          Google Drive 공유
        </h3>
        <ol className="space-y-4 text-sm text-gray-600 list-decimal list-inside">
          <li className="pl-2"><span className="font-bold text-gray-800">우클릭:</span> 파일 위에서 마우스 오른쪽 버튼 클릭</li>
          <li className="pl-2"><span className="font-bold text-gray-800">공유 선택:</span> 사람 모양 아이콘의 '공유' 클릭</li>
          <li className="pl-2"><span className="font-bold text-gray-800">권한 설정 (중요!):</span>
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1 text-gray-500">
              <li><span className="text-blue-600 font-medium">뷰어:</span> 보기만 가능 (유출 방지)</li>
              <li><span className="text-green-600 font-medium">편집자:</span> 수정 가능 (팀플용)</li>
            </ul>
          </li>
          <li className="pl-2"><span className="font-bold text-gray-800">링크 복사:</span> '링크 복사' 후 메신저로 전송</li>
        </ol>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-lg border-t-4 border-sky-600">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Microsoft_Office_OneDrive_%282019%E2%80%93present%29.svg" alt="OneDrive" className="w-6 h-6 mr-2" />
          MS OneDrive 공유
        </h3>
        <ol className="space-y-4 text-sm text-gray-600 list-decimal list-inside">
          <li className="pl-2"><span className="font-bold text-gray-800">공유 버튼:</span> 파일 선택 후 상단 '공유' 버튼</li>
          <li className="pl-2"><span className="font-bold text-gray-800">링크 설정:</span> '링크가 있는 모든 사용자가 편집 가능'을 클릭하여 옵션 변경</li>
          <li className="pl-2"><span className="font-bold text-gray-800">만료일 설정:</span> <span className="text-orange-500 text-xs border border-orange-200 rounded px-1">Tip</span> 보안을 위해 링크 만료 날짜 설정 가능</li>
          <li className="pl-2"><span className="font-bold text-gray-800">암호 설정:</span> 중요 문서라면 비밀번호 걸기</li>
        </ol>
      </div>

      <div className="md:col-span-2 bg-yellow-50 p-6 rounded-2xl border border-yellow-200">
        <h3 className="text-lg font-bold text-yellow-800 mb-2">⚠️ 공유 전 체크리스트</h3>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-yellow-900">
          <li className="flex items-center">✅ 개인정보(주민번호 등)가 포함되었는가?</li>
          <li className="flex items-center">✅ 저작권이 있는 자료를 무단 배포하는가?</li>
          <li className="flex items-center">✅ 공유 대상이 정확한가? (전체공개 X)</li>
        </ul>
      </div>
    </div>
  );
};

export default GuideTab;
