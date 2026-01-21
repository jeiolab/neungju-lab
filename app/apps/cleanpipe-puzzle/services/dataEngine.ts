import { DataRow, StepType, PipelineItem, SimulationResult } from '../types';

// Generate raw dirty data
export const generateRawData = (): DataRow[] => {
  const baseData: DataRow[] = [
    { id: 1, timestamp: '2023-10-01 09:00', station: 'Gangnam', pm25: 25, pm10: 45, status: 'Normal' },
    { id: 2, timestamp: '2023-10-01 10:00', station: 'Gangnam', pm25: null, pm10: 50, status: 'Error' }, // Missing
    { id: 3, timestamp: '2023-10-01 11:00', station: 'Gangnam', pm25: 9999, pm10: 55, status: 'Check' }, // Outlier
    { id: 4, timestamp: '2023-10-01 12:00', station: 'Gangnam', pm25: 30, pm10: 60, status: 'Normal' },
    { id: 1, timestamp: '2023-10-01 09:00', station: 'Gangnam', pm25: 25, pm10: 45, status: 'Normal', isDuplicate: true }, // Duplicate
    { id: 5, timestamp: '2023-10-01 13:00', station: 'Seocho', pm25: 18, pm10: 35, status: 'Normal' },
    { id: 6, timestamp: '2023-10-01 14:00', station: 'Seocho', pm25: null, pm10: null, status: 'Loss' }, // Missing both
    { id: 7, timestamp: '2023-10-01 15:00', station: 'Seocho', pm25: 22, pm10: -100, status: 'Error' }, // Outlier negative
    { id: 8, timestamp: 'Oct 01, 2023', station: 'Seocho', pm25: 20, pm10: 40, status: 'Normal' }, // Format issue
    { id: 9, timestamp: '2023-10-01 17:00', station: 'Songpa', pm25: 15, pm10: 30, status: 'Normal' },
  ];
  return baseData;
};

// Process data based on pipeline
export const processData = (rawData: DataRow[], pipeline: PipelineItem[]): { processedData: DataRow[], result: SimulationResult } => {
  let currentData = JSON.parse(JSON.stringify(rawData)) as DataRow[];
  const stats = {
    initialRows: rawData.length,
    finalRows: 0,
    missingFixed: 0,
    outliersFixed: 0,
    duplicatesRemoved: 0
  };

  // Logic to track if steps were performed
  const performedSteps = new Set<StepType>();

  pipeline.forEach(item => {
    performedSteps.add(item.stepType);
    
    switch (item.stepType) {
      case StepType.HANDLE_MISSING:
        const initialLen = currentData.length;
        if (item.selectedOption === 'Delete') {
           currentData = currentData.filter(row => row.pm25 !== null && row.pm10 !== null);
           stats.missingFixed += (initialLen - currentData.length);
        } else {
          // Impute (simplify to Mean for demo)
          const meanPm25 = 25; 
          currentData.forEach(row => {
            if (row.pm25 === null) { row.pm25 = meanPm25; stats.missingFixed++; }
            if (row.pm10 === null) { row.pm10 = 45; stats.missingFixed++; }
          });
        }
        break;

      case StepType.HANDLE_OUTLIERS:
        // Simple IQR or Range rule: PM2.5 > 500 or < 0 is outlier
        currentData = currentData.map(row => {
          if (row.pm25 !== null && (row.pm25 > 500 || row.pm25 < 0)) {
            stats.outliersFixed++;
            return { ...row, pm25: item.selectedOption === 'Delete' ? null : 50 }; // Clip to 50 if not delete
          }
          if (row.pm10 !== null && (row.pm10 > 500 || row.pm10 < 0)) {
             stats.outliersFixed++;
             return { ...row, pm10: item.selectedOption === 'Delete' ? null : 80 };
          }
          return row;
        }).filter(row => row.pm25 !== null && row.pm10 !== null); // If deleted
        break;

      case StepType.REMOVE_DUPLICATES:
        const seen = new Set();
        const deduped: DataRow[] = [];
        currentData.forEach(row => {
          const key = `${row.id}-${row.timestamp}-${row.station}`;
          if (!seen.has(key)) {
            seen.add(key);
            deduped.push(row);
          } else {
            stats.duplicatesRemoved++;
          }
        });
        currentData = deduped;
        break;

      case StepType.STANDARDIZE_FORMAT:
        currentData = currentData.map(row => ({
          ...row,
          timestamp: row.timestamp.includes('Oct') ? '2023-10-01 16:00' : row.timestamp
        }));
        break;
        
      default:
        break;
    }
  });

  stats.finalRows = currentData.length;

  // Evaluate Score
  // Ideal Order: Define -> Explore -> Handle Missing -> Handle Outliers -> Dedupe -> Format -> Integrate -> Summarize
  // Simplified Check for demo:
  let score = 0;
  let message = "완벽합니다! 데이터가 깨끗해졌어요.";
  let success = true;

  // Basic rules check
  if (!performedSteps.has(StepType.HANDLE_MISSING)) {
    message = "주의: 결측치가 처리되지 않았습니다. 분석 시 오류가 발생할 수 있어요.";
    success = false;
    score -= 20;
  }
  if (!performedSteps.has(StepType.HANDLE_OUTLIERS)) {
    message = "주의: 이상치가 남아있습니다. 평균값이 왜곡될 수 있습니다.";
    success = false;
    score -= 20;
  }
  if (!performedSteps.has(StepType.REMOVE_DUPLICATES)) {
    message = "주의: 중복 데이터가 있습니다. 통계가 부풀려질 수 있습니다.";
    success = false;
    score -= 10;
  }
  
  // Order Check: Explore should be before Fixing
  const exploreIdx = pipeline.findIndex(p => p.stepType === StepType.EXPLORE_DATA);
  const missingIdx = pipeline.findIndex(p => p.stepType === StepType.HANDLE_MISSING);
  
  if (missingIdx !== -1 && exploreIdx !== -1 && missingIdx < exploreIdx) {
    message = "순서 오류: 데이터를 탐색하기 전에 값을 수정하면 데이터의 원래 패턴을 알 수 없어요!";
    success = false;
    score -= 30;
  }

  // Base score
  if (success) score = 100;
  if (score < 0) score = 0;

  return {
    processedData: currentData,
    result: {
      success,
      message,
      score,
      dataStats: stats
    }
  };
};