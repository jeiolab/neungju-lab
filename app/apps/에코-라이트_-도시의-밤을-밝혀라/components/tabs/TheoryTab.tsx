import React from 'react';
import { Card } from '../ui/Card';
import { Sun, Moon, Cpu, Binary } from 'lucide-react';

export const TheoryTab: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fadeIn">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-sky-600 mb-2">스마트 가로등의 원리</h2>
        <p className="text-slate-600">빛을 숫자로 바꾸는 마법, ADC(Analog-to-Digital Converter)</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card title="아날로그 세상 vs 디지털 세상">
          <div className="flex justify-between items-center mb-4">
            <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-100">
              <Sun className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-800">실제 밝기</p>
              <p className="text-xs text-slate-500">연속적인 값</p>
            </div>
            <div className="h-0.5 flex-1 bg-slate-300 mx-4 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white border border-slate-200 px-2 text-xs text-sky-600 font-bold">
                ADC 변환
              </div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-100">
              <Binary className="w-12 h-12 text-blue-500 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-800">디지털 값</p>
              <p className="text-xs text-slate-500">0 ~ 1023</p>
            </div>
          </div>
          <p className="text-slate-600 leading-relaxed text-sm">
            조도 센서(CdS)는 빛의 밝기에 따라 저항값이 변합니다. 컴퓨터는 이 저항의 변화를 바로 이해할 수 없어서, 
            0V에서 5V 사이의 전압을 <strong>0부터 1023까지의 숫자</strong>로 바꾸어 읽습니다. 
            이것이 바로 아두이노와 같은 마이크로컨트롤러가 세상을 인식하는 방법입니다.
          </p>
        </Card>

        <Card title="빛 감지 데이터 흐름">
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="bg-yellow-100 p-2 rounded-full">
                  <Sun size={20} className="text-yellow-600" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">1. 빛 감지 (Input)</h4>
                  <p className="text-sm text-slate-600">조도 센서가 주변 밝기를 저항값으로 느낍니다.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <Cpu size={20} className="text-green-600" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">2. 판단 및 처리 (Process)</h4>
                  <p className="text-sm text-slate-600">설정된 '기준값(Threshold)'보다 어두운지(값이 작은지) 비교합니다.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-purple-100 p-2 rounded-full">
                  <Moon size={20} className="text-purple-600" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">3. 제어 (Output)</h4>
                  <p className="text-sm text-slate-600">어둡다고 판단되면 릴레이를 통해 가로등 전원을 켭니다.</p>
                </div>
              </li>
            </ul>
        </Card>
      </div>

      <Card title="핵심 용어 정리" className="bg-gradient-to-r from-slate-100 to-slate-200 border border-slate-300">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 border border-slate-300 rounded bg-white/60">
            <strong className="text-sky-600 block mb-1">Lux (룩스)</strong>
            <span className="text-xs text-slate-600">빛의 밝기를 나타내는 단위. 높을수록 밝음.</span>
          </div>
          <div className="p-3 border border-slate-300 rounded bg-white/60">
            <strong className="text-sky-600 block mb-1">Threshold (임계값)</strong>
            <span className="text-xs text-slate-600">가로등을 켜고 끌 기준이 되는 밝기 수치.</span>
          </div>
          <div className="p-3 border border-slate-300 rounded bg-white/60">
            <strong className="text-sky-600 block mb-1">Trade-off (트레이드오프)</strong>
            <span className="text-xs text-slate-600">하나를 얻으면 다른 하나를 잃는 관계. (안전 vs 에너지)</span>
          </div>
        </div>
      </Card>
    </div>
  );
};