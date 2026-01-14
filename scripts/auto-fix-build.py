#!/usr/bin/env python3
"""
빌드 오류 자동 수정 스크립트
빌드를 실행하고 발생하는 오류를 자동으로 수정합니다.
"""

import subprocess
import re
import os
import sys
from pathlib import Path

MAX_ITERATIONS = 10
BASE_DIR = Path(__file__).parent.parent

def run_build():
    """빌드를 실행하고 결과를 반환"""
    try:
        result = subprocess.run(
            ['npm', 'run', 'build'],
            cwd=BASE_DIR,
            capture_output=True,
            text=True,
            timeout=300
        )
        return result.returncode == 0, result.stdout + result.stderr
    except subprocess.TimeoutExpired:
        return False, "빌드 타임아웃"
    except Exception as e:
        return False, str(e)

def fix_type_error_undefined(output):
    """response.text가 undefined일 수 있는 에러 수정"""
    match = re.search(r'\./([^:]+):(\d+):\d+.*response\.text.*possibly.*undefined', output)
    if match:
        file_path = BASE_DIR / match.group(1)
        if file_path.exists():
            content = file_path.read_text(encoding='utf-8')
            # response.text.trim() -> response.text?.trim() || ''
            new_content = re.sub(
                r'response\.text\.trim\(\)',
                r'response.text?.trim() || \'\'',
                content
            )
            if new_content != content:
                file_path.write_text(new_content, encoding='utf-8')
                return True, f"✅ {file_path.name} 수정: response.text 옵셔널 체이닝 추가"
    return False, None

def fix_type_error_status(output):
    """status 타입 에러 수정"""
    match = re.search(r'\./([^:]+):(\d+):\d+.*Type.*string.*is not assignable.*status', output)
    if match:
        file_path = BASE_DIR / match.group(1)
        line_num = int(match.group(2))
        if file_path.exists():
            lines = file_path.read_text(encoding='utf-8').split('\n')
            if line_num <= len(lines):
                line = lines[line_num - 1]
                # status: 'IN_TRANSIT' -> status: 'IN_TRANSIT' as const
                if "status:" in line and "as const" not in line:
                    new_line = re.sub(
                        r"status:\s*['\"](\w+)['\"]",
                        r"status: '\1' as const",
                        line
                    )
                    if new_line != line:
                        lines[line_num - 1] = new_line
                        file_path.write_text('\n'.join(lines), encoding='utf-8')
                        return True, f"✅ {file_path.name}:{line_num} 수정: status에 as const 추가"
    return False, None

def fix_set_iteration_error(output):
    """Set iteration 에러 수정"""
    match = re.search(r'\./([^:]+):(\d+):\d+.*can only be iterated through', output)
    if match:
        file_path = BASE_DIR / match.group(1)
        if file_path.exists():
            content = file_path.read_text(encoding='utf-8')
            # [...new Set( -> Array.from(new Set(
            new_content = re.sub(
                r'\[\.\.\.new Set\(',
                r'Array.from(new Set(',
                content
            )
            if new_content != content:
                file_path.write_text(new_content, encoding='utf-8')
                return True, f"✅ {file_path.name} 수정: Set을 Array.from으로 변경"
    return False, None

def fix_module_not_found(output):
    """모듈을 찾을 수 없는 에러 수정"""
    match = re.search(r'\./([^:]+):\d+:\d+.*Cannot find module.*[\'"]\./App[\'"]', output)
    if match:
        file_path = BASE_DIR / match.group(1)
        if file_path.exists() and file_path.name == 'index.tsx':
            # Next.js에서는 index.tsx가 필요 없음
            file_path.unlink()
            return True, f"✅ {file_path.name} 제거: Next.js에서 불필요한 파일"
    return False, None

def fix_parsing_error_gt(output):
    """JSX > 특수문자 파싱 에러 수정"""
    match = re.search(r'\./([^:]+):(\d+):\d+.*Did you mean.*&gt;', output)
    if match:
        file_path = BASE_DIR / match.group(1)
        line_num = int(match.group(2))
        if file_path.exists():
            lines = file_path.read_text(encoding='utf-8').split('\n')
            if line_num <= len(lines):
                line = lines[line_num - 1]
                # > { -> &gt; {
                if '> {' in line and '&gt;' not in line:
                    new_line = line.replace('> {', '&gt; {')
                    lines[line_num - 1] = new_line
                    file_path.write_text('\n'.join(lines), encoding='utf-8')
                    return True, f"✅ {file_path.name}:{line_num} 수정: > 를 &gt; 로 변경"
                # -> 를 → 로 변경
                elif '->' in line and '→' not in line:
                    new_line = line.replace('->', '→')
                    lines[line_num - 1] = new_line
                    file_path.write_text('\n'.join(lines), encoding='utf-8')
                    return True, f"✅ {file_path.name}:{line_num} 수정: -> 를 → 로 변경"
                # X > Y -> X &gt; Y
                elif re.search(r'\w\s+>\s+\w', line):
                    new_line = re.sub(r'(\w)\s+>\s+(\w)', r'\1 &gt; \2', line)
                    lines[line_num - 1] = new_line
                    file_path.write_text('\n'.join(lines), encoding='utf-8')
                    return True, f"✅ {file_path.name}:{line_num} 수정: 비교 연산자 이스케이프"
    return False, None

def fix_parsing_error_string(output):
    """문자열 리터럴 파싱 에러 수정"""
    match = re.search(r'\./([^:]+):(\d+):\d+.*Unterminated string literal', output)
    if match:
        file_path = BASE_DIR / match.group(1)
        line_num = int(match.group(2))
        if file_path.exists():
            lines = file_path.read_text(encoding='utf-8').split('\n')
            if line_num <= len(lines):
                line = lines[line_num - 1]
                # value="=""> -> value="="
                if 'value="="">' in line:
                    new_line = line.replace('value="="">', 'value="="')
                    lines[line_num - 1] = new_line
                    file_path.write_text('\n'.join(lines), encoding='utf-8')
                    return True, f"✅ {file_path.name}:{line_num} 수정: 문자열 리터럴 수정"
    return False, None

def main():
    print("🔍 빌드 오류 자동 수정 시작...\n")
    
    for iteration in range(1, MAX_ITERATIONS + 1):
        print(f"{'='*50}")
        print(f"🔄 반복 {iteration}/{MAX_ITERATIONS}")
        print(f"{'='*50}\n")
        
        print("📦 빌드 실행 중...")
        success, output = run_build()
        
        if success:
            print("\n✅ 빌드 성공!")
            return 0
        
        print("❌ 빌드 실패. 오류 분석 중...\n")
        
        # 각종 에러 수정 시도
        fixes = [
            fix_type_error_undefined,
            fix_type_error_status,
            fix_set_iteration_error,
            fix_module_not_found,
            fix_parsing_error_gt,
            fix_parsing_error_string,
        ]
        
        fixed = False
        for fix_func in fixes:
            try:
                result, message = fix_func(output)
                if result:
                    print(f"🔧 {message}\n")
                    fixed = True
                    break
            except Exception as e:
                print(f"⚠️  수정 중 오류: {e}\n")
        
        if not fixed:
            print("⚠️  자동 수정할 수 없는 오류가 있습니다:\n")
            # 주요 에러 라인 출력
            error_lines = re.findall(r'\./[^:]+:\d+:\d+.*(?:Type error|Parsing error|Error:)', output)
            for line in error_lines[:5]:
                print(f"  {line}")
            print("\n📋 전체 빌드 로그의 마지막 부분:")
            print(output[-1000:])
            return 1
    
    print(f"\n❌ 최대 반복 횟수({MAX_ITERATIONS})에 도달했습니다.")
    return 1

if __name__ == '__main__':
    sys.exit(main())
