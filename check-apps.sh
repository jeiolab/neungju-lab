#!/bin/bash

# 빠른 앱 빌드 문제 검사 스크립트

echo "🚀 빠른 빌드 문제 검사 시작..."
echo ""

# Python 스크립트로 문제 앱 찾기
python3 << 'PYEOF'
import os
import re
from pathlib import Path

# appRegistry.tsx 읽기
with open('app/apps/appRegistry.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 모든 import 경로 추출
pattern = r"import\('\./([^']+)/(App|index)'\)"
matches = re.findall(pattern, content)

problematic = []
checked = 0

for app_path, file_type in matches:
    checked += 1
    app_dir = Path(f'app/apps/{app_path}')
    
    # 파일 경로 확인
    if file_type == 'App':
        app_file = app_dir / 'App.tsx'
        app_file_js = app_dir / 'App.jsx'
    else:
        app_file = app_dir / 'index.tsx'
        app_file_js = app_dir / 'index.jsx'
    
    # 파일 존재 확인
    if not app_file.exists() and not app_file_js.exists():
        problematic.append((app_path, file_type, '파일 없음'))
        continue
    
    # 파일이 있으면 export 확인
    file_to_check = app_file if app_file.exists() else app_file_js
    try:
        with open(file_to_check, 'r', encoding='utf-8') as f:
            file_content = f.read()
            if 'export default' not in file_content:
                if file_type == 'index' and ('export {' in file_content or 'export ' in file_content):
                    continue
                problematic.append((app_path, file_type, 'export 없음'))
    except Exception as e:
        problematic.append((app_path, file_type, f'읽기 오류'))

print(f"✅ 검사 완료: {checked}개 앱 확인")
print(f"❌ 문제 발견: {len(problematic)}개\n")

if problematic:
    print("문제가 있는 앱들:")
    for app_path, file_type, reason in problematic[:20]:  # 처음 20개만 출력
        print(f"  - {app_path}/{file_type}: {reason}")
    if len(problematic) > 20:
        print(f"  ... 외 {len(problematic) - 20}개")
    
    # 제거할 앱 목록 저장
    with open('/tmp/problematic_apps.txt', 'w', encoding='utf-8') as f:
        for app_path, _, _ in problematic:
            f.write(f"{app_path}\n")
    
    print(f"\n제거할 앱 목록: /tmp/problematic_apps.txt")
    exit(1)
else:
    print("✅ 모든 앱이 정상입니다!")
    exit(0)
PYEOF

EXIT_CODE=$?

if [ $EXIT_CODE -eq 1 ] && [ -f /tmp/problematic_apps.txt ]; then
    echo ""
    echo "문제 앱 자동 제거 중..."
    python3 << 'PYEOF'
import re

with open('app/apps/appRegistry.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

with open('/tmp/problematic_apps.txt', 'r', encoding='utf-8') as f:
    problematic_apps = [line.strip() for line in f.readlines() if line.strip()]

print(f'제거할 앱: {len(problematic_apps)}개\n')

to_remove = []
for i, line in enumerate(lines):
    for app_path in problematic_apps:
        if f"'{app_path}'" in line or f'./{app_path}/' in line:
            to_remove.append(i)
            break

print(f'총 {len(to_remove)}개 라인 제거')

for i in sorted(set(to_remove), reverse=True):
    del lines[i]

with open('app/apps/appRegistry.tsx', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print(f'✅ 제거 완료')
PYEOF

    echo ""
    echo "변경사항:"
    git diff app/apps/appRegistry.tsx | head -30
    echo ""
    echo "✅ 문제 앱들이 제거되었습니다. 커밋하고 푸시하려면:"
    echo "   git add app/apps/appRegistry.tsx"
    echo "   git commit -m '빌드 에러 수정: 문제 앱 자동 제거'"
    echo "   git push origin main"
fi
