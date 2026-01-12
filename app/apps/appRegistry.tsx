/**
 * 앱 컴포넌트 레지스트리
 * 새로운 앱을 추가할 때 여기에만 등록하면 됩니다.
 */

import React from 'react'
import dynamic from 'next/dynamic'

// 앱 컴포넌트 타입
type AppComponent = React.ComponentType

// 앱 레지스트리 맵
const appComponents: Record<string, () => Promise<{ default: AppComponent }>> = {
  'wireless-tech-detective': () => import('./wireless-tech-detective/WirelessTechDetectiveApp'),
  'smart-pairing': () => import('./smart-pairing/SmartPairingApp'),
  'network-device-guide': () => import('./network-device-guide/NetworkDeviceGuideApp'),
  'master-ip-decoder': () => import('./master-ip-decoder/MasterIPDecoderApp'),
  'network-master': () => import('./network-master/NetworkMasterApp'),
  'address-revolution': () => import('./address-revolution/AddressRevolutionApp'),
  'iot-builder-academy': () => import('./iot-builder-academy/IoTBuilderAcademyApp'),
  'iot-project-planner': () => import('./iot-project-planner/IoTProjectPlannerApp'),
  'iot-data-flow-simulator': () => import('./iot-data-flow-simulator/IoTDataFlowSimulatorApp'),
  'iot-explorer': () => import('./iot-explorer/IoTExplorerApp'),
  'audio-compress-lab': () => import('./audio-compress-lab/AudioCompressLabApp'),
  'data-cruncher-academy': () => import('./data-cruncher-academy/DataCruncherAcademyApp'),
  'image-pixel-lab': () => import('./image-pixel-lab/ImagePixelLabApp'),
  'huffman-forest': () => import('./huffman-forest/HuffmanForestApp'),
  'sns-detective': () => import('./sns-detective/SNSDetectiveApp'),
  'data-analyst-simulator': () => import('./data-analyst-simulator/DataAnalystSimulatorApp'),
  'big-data-master': () => import('./big-data-master/BigDataMasterApp'),
  'scytale-cipher-lab': () => import('./scytale-cipher-lab/ScytaleCipherLabApp'),
  'crypto-lab': () => import('./crypto-lab/CryptoLabApp'),
  'algorithm-racing': () => import('./algorithm-racing/AlgorithmRacingApp'),
  'dataviz-master': () => import('./dataviz-master/DataVizMasterApp'),
  'cipher-master': () => import('./cipher-master/CipherMasterApp'),
  'cryptolearn': () => import('./cryptolearn/CryptoLearnApp'),
  'data-tycoon': () => import('./data-tycoon/DataTycoonApp'),
  'crypto-hacker': () => import('./crypto-hacker/CryptoHackerApp'),
  'threat-database': () => import('./threat-database/ThreatDatabaseApp'),
  'copyright-sharing-world': () => import('./copyright-sharing-world/CopyrightSharingWorldApp'),
  'info-security-guardian': () => import('./info-security-guardian/InfoSecurityGuardianApp'),
  'info-protection-castle': () => import('./info-protection-castle/InfoProtectionCastleApp'),
  'my-ai-career-compass': () => import('./my-ai-career-compass/MyAICareerCompassApp'),
  'digital-detective': () => import('./digital-detective/DigitalDetectiveApp'),
  'future-farm-tycoon': () => import('./future-farm-tycoon/FutureFarmTycoonApp'),
  'smart-life': () => import('./smart-life/SmartLifeApp'),
  'job-time-machine': () => import('./job-time-machine/JobTimeMachineApp'),
  // 새로운 앱을 추가할 때 여기에만 추가하면 됩니다
  // 'new-app-id': () => import('./new-app-folder/NewApp'),
}

/**
 * 앱 ID로 컴포넌트를 동적으로 로드합니다
 */
export function getAppComponent(appId: string): AppComponent | null {
  const loader = appComponents[appId]
  if (!loader) {
    return null
  }

  // 동적 import로 컴포넌트 로드 (최적화된 설정)
  return dynamic(loader, {
    loading: () => (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">앱을 불러오는 중...</p>
        </div>
      </div>
    ),
    ssr: false, // 클라이언트 사이드에서만 렌더링
    // 로딩 최적화를 위한 추가 옵션
  })
}

/**
 * 등록된 모든 앱 ID 목록을 반환합니다
 */
export function getRegisteredAppIds(): string[] {
  return Object.keys(appComponents)
}

/**
 * 앱이 등록되어 있는지 확인합니다
 */
export function isAppRegistered(appId: string): boolean {
  return appId in appComponents
}

