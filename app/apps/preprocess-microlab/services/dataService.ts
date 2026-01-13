import { RAW_DATA } from '../constants';
import { MissingValueStrategy, SimulationResult, StudentData } from '../types';

export const processExperiment = (
  missingStrategy: MissingValueStrategy,
  outlierThreshold: number // 0 (keep all) to 100 (strict remove)
): { result: SimulationResult, cleanedData: StudentData[] } => {
  
  let workingData = [...RAW_DATA];
  const originalCount = workingData.length;
  
  // 1. Calculate Original Stats (ignoring nulls purely for stats, but including outliers)
  const validOriginalHeights = workingData
    .map(d => d.height)
    .filter((h): h is number => h !== null);
  
  const originalMean = validOriginalHeights.length > 0 
    ? validOriginalHeights.reduce((a, b) => a + b, 0) / validOriginalHeights.length 
    : 0;

  // 2. Outlier Processing
  // Concept: Convert slider 0-100 to a Z-score threshold logic roughly.
  // 0 -> Infinite threshold (keep all)
  // 50 -> Z-score 3
  // 100 -> Z-score 1.5 (Strict)
  
  let dataAfterOutliers = [...workingData];
  
  // Only check outliers on valid heights
  if (outlierThreshold > 0) {
    const mean = originalMean;
    const stdDev = Math.sqrt(
      validOriginalHeights.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / validOriginalHeights.length
    );

    // Inverse logic: Higher slider = Lower Z threshold (stricter)
    // Map 1-100 to Z-score 5.0 down to 1.0
    const zThreshold = 5.0 - (outlierThreshold / 100) * 4.0; 

    dataAfterOutliers = workingData.filter(d => {
      if (d.height === null) return true; // Keep nulls for the next step
      // Hard rules for impossible values (always remove if threshold > 10)
      if (outlierThreshold > 10 && (d.height < 50 || d.height > 250)) return false;
      
      const z = Math.abs((d.height - mean) / stdDev);
      return z <= zThreshold;
    });
  }

  // 3. Missing Value Processing
  let finalData: StudentData[] = [];
  
  // Calculate valid dataset stats for imputation
  const currentValidHeights = dataAfterOutliers
    .map(d => d.height)
    .filter((h): h is number => h !== null);

  const currentMean = currentValidHeights.length ? currentValidHeights.reduce((a, b) => a + b, 0) / currentValidHeights.length : 0;
  
  // Median calculation
  const sortedHeights = [...currentValidHeights].sort((a, b) => a - b);
  const mid = Math.floor(sortedHeights.length / 2);
  const currentMedian = sortedHeights.length % 2 !== 0 ? sortedHeights[mid] : (sortedHeights[mid - 1] + sortedHeights[mid]) / 2;

  // Mode calculation (simple binning for float/int or just exact match)
  const modeMap: Record<number, number> = {};
  let currentMode = currentMean;
  let maxCount = 0;
  currentValidHeights.forEach(h => {
    modeMap[h] = (modeMap[h] || 0) + 1;
    if (modeMap[h] > maxCount) {
      maxCount = modeMap[h];
      currentMode = h;
    }
  });

  if (missingStrategy === MissingValueStrategy.DROP) {
    finalData = dataAfterOutliers.filter(d => d.height !== null);
  } else {
    finalData = dataAfterOutliers.map(d => {
      if (d.height === null) {
        let imputedHeight = 0;
        switch (missingStrategy) {
          case MissingValueStrategy.MEAN: imputedHeight = currentMean; break;
          case MissingValueStrategy.MEDIAN: imputedHeight = currentMedian; break;
          case MissingValueStrategy.MODE: imputedHeight = currentMode; break;
        }
        return { ...d, height: Number(imputedHeight.toFixed(1)) };
      }
      return d;
    });
  }

  // 4. Final Stats
  const finalHeights = finalData.map(d => d.height as number);
  const cleanedMean = finalHeights.length > 0 ? finalHeights.reduce((a, b) => a + b, 0) / finalHeights.length : 0;

  // 5. Generate Feedback
  const diff = cleanedMean - originalMean;
  const droppedCount = originalCount - finalData.length;
  
  let changeMsg = `평균 키가 ${Math.abs(diff).toFixed(1)}cm ${diff > 0 ? '상승' : '하락'}했습니다.`;
  if (Math.abs(diff) < 0.5) changeMsg = "평균 키에 거의 변화가 없습니다.";

  let reasonMsg = "";
  if (outlierThreshold < 20 && Math.abs(diff) > 10) {
    reasonMsg = "이상치(999cm 등)가 그대로 포함되어 평균을 심하게 왜곡했습니다.";
  } else if (missingStrategy === MissingValueStrategy.DROP && droppedCount > 5) {
    reasonMsg = `데이터를 ${droppedCount}개나 삭제해서 정보 손실이 큽니다.`;
  } else if (missingStrategy === MissingValueStrategy.MEAN && outlierThreshold < 20) {
    reasonMsg = "이상치가 포함된 상태에서 평균으로 결측치를 채우니 왜곡이 더 심해졌습니다.";
  } else if (missingStrategy === MissingValueStrategy.MEDIAN) {
    reasonMsg = "중앙값을 사용하여 이상치의 영향을 덜 받으며 결측치를 채웠습니다.";
  } else {
    reasonMsg = "설정한 기준에 따라 데이터 분포가 재조정되었습니다.";
  }

  let nextStep = "다른 결측치 처리 방식을 시도해보세요.";
  if (outlierThreshold < 50) nextStep = "이상치 제거 강도를 높여보는 건 어때요?";
  else if (missingStrategy === MissingValueStrategy.DROP) nextStep = "데이터 삭제 대신 평균이나 중앙값으로 채워보세요.";

  return {
    result: {
      originalMean,
      cleanedMean,
      originalCount,
      cleanedCount: finalData.length,
      droppedCount,
      feedback: {
        change: changeMsg,
        reason: reasonMsg,
        nextStep
      }
    },
    cleanedData: finalData
  };
};
