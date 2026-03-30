#!/usr/bin/env python3
"""
프로그램 폴더의 하위 앱들을 app/apps로 복사하는 스크립트
"""
import os
import shutil
import re
from pathlib import Path

program_dir = Path('program')
apps_dir = Path('app/apps')

# 기존 앱 목록 가져오기
existing_apps = set()
if apps_dir.exists():
    for item in apps_dir.iterdir():
        if item.is_dir() and item.name != '[id]':
            existing_apps.add(item.name)

print(f"기존 앱 수: {len(existing_apps)}")

# 프로그램 폴더에서 앱 찾기
program_apps = []
for root, dirs, files in os.walk(program_dir):
    root_path = Path(root)
    
    # App.tsx 또는 index.tsx가 있는 폴더 찾기
    if 'App.tsx' in files or 'index.tsx' in files:
        rel_path = root_path.relative_to(program_dir)
        
        # program 바로 아래가 아닌 하위 폴더만
        if len(rel_path.parts) > 1:
            folder_name = rel_path.parts[-1]
            program_apps.append({
                'src': root_path,
                'name': folder_name,
                'path': rel_path
            })

print(f"프로그램 폴더에서 찾은 앱 수: {len(program_apps)}")

# 복사할 앱들 (기존에 없는 것만)
apps_to_copy = [app for app in program_apps if app['name'] not in existing_apps]
print(f"복사할 앱 수: {len(apps_to_copy)}")

# 폴더 이름을 kebab-case로 변환하는 함수
def to_kebab_case(name):
    # 한글, 영문, 숫자, 하이픈, 언더스코어만 유지
    name = re.sub(r'[^\w\s\-가-힣]', '', name)
    # 공백과 점을 하이픈으로 변환
    name = re.sub(r'[\s·\.]+', '-', name)
    # 연속된 하이픈을 하나로
    name = re.sub(r'-+', '-', name)
    # 앞뒤 하이픈 제거
    name = name.strip('-')
    return name.lower()

# 앱 복사
copied_count = 0
for app in apps_to_copy:  # 모든 앱 복사
    try:
        src_path = app['src']
        app_id = to_kebab_case(app['name'])
        dest_path = apps_dir / app_id
        
        if dest_path.exists():
            print(f"  이미 존재: {app_id}")
            continue
            
        # 폴더 복사
        shutil.copytree(src_path, dest_path, ignore=shutil.ignore_patterns(
            'node_modules', '.git', 'dist', 'build', '.next', '.DS_Store'
        ))
        print(f"  복사됨: {app_id}")
        copied_count += 1
    except Exception as e:
        print(f"  오류 ({app['name']}): {e}")

print(f"\n총 {copied_count}개 앱 복사 완료")
