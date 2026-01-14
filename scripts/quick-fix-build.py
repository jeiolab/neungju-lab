#!/usr/bin/env python3
"""
빠른 빌드 오류 수정 스크립트 (타입 체크만 사용)
"""

import subprocess
import re
import sys
from pathlib import Path

BASE_DIR = Path(__file__).parent.parent

def run_type_check():
    """타입 체크 실행 (빌드보다 훨씬 빠름)"""
    try:
        result = subprocess.run(
            ['npm', 'run', 'type-check'],
            cwd=BASE_DIR,
            capture_output=True,
            text=True,
            timeout=60
        )
        return result.returncode == 0, result.stdout + result.stderr
    except Exception as e:
        return False, str(e)

def fix_errors(output):
    """출력에서 오류를 찾아 수정"""
    fixes_applied = []
    
    # response.text undefined 에러
    match = re.search(r'\./([^:]+):(\d+):\d+.*response\.text.*possibly.*undefined', output)
    if match:
        file_path = BASE_DIR / match.group(1)
        if file_path.exists():
            content = file_path.read_text(encoding='utf-8')
            new_content = re.sub(r'response\.text\.trim\(\)', r'response.text?.trim() || \'\'', content)
            if new_content != content:
                file_path.write_text(new_content, encoding='utf-8')
                fixes_applied.append(f"✅ {file_path.name}: response.text 옵셔널 체이닝 추가")
    
    # status 타입 에러
    match = re.search(r'\./([^:]+):(\d+):\d+.*Type.*string.*is not assignable.*status', output)
    if match:
        file_path = BASE_DIR / match.group(1)
        if file_path.exists():
            content = file_path.read_text(encoding='utf-8')
            new_content = re.sub(r"status:\s*['\"](\w+)['\"]", r"status: '\1' as const", content)
            if new_content != content:
                file_path.write_text(new_content, encoding='utf-8')
                fixes_applied.append(f"✅ {file_path.name}: status에 as const 추가")
    
    # Set iteration 에러
    if 'can only be iterated through' in output:
        matches = re.findall(r'\./([^:]+):\d+:\d+', output)
        for file_match in set(matches):
            file_path = BASE_DIR / file_match
            if file_path.exists():
                content = file_path.read_text(encoding='utf-8')
                new_content = re.sub(r'\[\.\.\.new Set\(', r'Array.from(new Set(', content)
                if new_content != content:
                    file_path.write_text(new_content, encoding='utf-8')
                    fixes_applied.append(f"✅ {file_path.name}: Set을 Array.from으로 변경")
    
    # 모듈을 찾을 수 없는 에러
    match = re.search(r'\./([^:]+):\d+:\d+.*Cannot find module.*[\'"]\./App[\'"]', output)
    if match:
        file_path = BASE_DIR / match.group(1)
        if file_path.exists() and file_path.name == 'index.tsx':
            file_path.unlink()
            fixes_applied.append(f"✅ {file_path.name} 제거: 불필요한 파일")
    
    # undefined를 null로 변환해야 하는 타입 에러
    match = re.search(r'\./([^:]+):(\d+):\d+.*Type.*undefined.*is not assignable.*SetStateAction', output)
    if match:
        file_path = BASE_DIR / match.group(1)
        line_num = int(match.group(2))
        if file_path.exists():
            lines = file_path.read_text(encoding='utf-8').split('\n')
            if line_num <= len(lines):
                line = lines[line_num - 1]
                # setState(result) -> setState(result || null) 패턴 찾기
                # 단순한 변수명만 (괄호나 점이 없는 경우)
                var_match = re.search(r'set\w+\((\w+)\)', line)
                if var_match and '|| null' not in line:
                    var_name = var_match.group(1)
                    new_line = re.sub(
                        rf'set\w+\({var_name}\)',
                        rf'set\w+({var_name} || null)',
                        line
                    )
                    if new_line != line:
                        lines[line_num - 1] = new_line
                        file_path.write_text('\n'.join(lines), encoding='utf-8')
                        fixes_applied.append(f"✅ {file_path.name}:{line_num} 수정: undefined를 null로 변환")
    
    return fixes_applied

def main():
    print("⚡ 빠른 타입 체크 및 오류 수정 시작...\n")
    
    max_iterations = 5
    for i in range(1, max_iterations + 1):
        print(f"🔄 반복 {i}/{max_iterations}")
        print("📦 타입 체크 실행 중...")
        
        success, output = run_type_check()
        
        if success:
            print("\n✅ 타입 체크 통과!")
            return 0
        
        print("❌ 타입 오류 발견. 수정 중...\n")
        fixes = fix_errors(output)
        
        if fixes:
            for fix in fixes:
                print(f"  {fix}")
            print()
        else:
            print("⚠️  자동 수정할 수 없는 오류:\n")
            error_lines = re.findall(r'\./[^:]+:\d+:\d+.*(?:Type error|Error:)', output)
            for line in error_lines[:3]:
                print(f"  {line}")
            return 1
    
    print("\n⚠️  최대 반복 횟수 도달")
    return 1

if __name__ == '__main__':
    sys.exit(main())
