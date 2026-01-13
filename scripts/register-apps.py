#!/usr/bin/env python3
"""
앱들을 appRegistry.tsx에 자동으로 등록하는 스크립트
"""
import os
import re
from pathlib import Path

apps_dir = Path('app/apps')
registry_file = Path('app/apps/appRegistry.tsx')

# 기존에 등록된 앱 목록 가져오기
existing_ids = set()
if registry_file.exists():
    content = registry_file.read_text(encoding='utf-8')
    matches = re.findall(r"'([^']+)':\s*\(\)\s*=>\s*import", content)
    existing_ids = set(matches)

print(f'기존 등록된 앱 수: {len(existing_ids)}')

# 등록되지 않은 앱 찾기 및 메인 파일 찾기
unregistered = []
for item in sorted(apps_dir.iterdir()):
    if item.is_dir() and item.name != '[id]' and item.name not in existing_ids:
        # 메인 파일 찾기
        main_file = None
        possible_names = [
            'App.tsx',
            'index.tsx',
            f'{item.name.title().replace("-", "").replace("_", "")}App.tsx',
            f'{item.name.replace("-", "-").title().replace("-", "")}App.tsx',
        ]
        
        # 폴더명에서 App 이름 추출 시도
        folder_name_parts = item.name.split('-')
        if folder_name_parts:
            camel_case = ''.join(word.capitalize() for word in folder_name_parts)
            possible_names.append(f'{camel_case}App.tsx')
        
        for fname in possible_names:
            if (item / fname).exists():
                main_file = fname
                break
        
        if main_file:
            unregistered.append({
                'id': item.name,
                'file': main_file
            })

print(f'등록할 앱 수: {len(unregistered)}')

# registry 파일 읽기
if registry_file.exists():
    content = registry_file.read_text(encoding='utf-8')
    
    # 마지막 앱 등록 줄 찾기
    lines = content.split('\n')
    insert_index = -1
    for i, line in enumerate(lines):
        if '// 새로운 앱을 추가할 때 여기에만 추가하면 됩니다' in line:
            insert_index = i
            break
    
    if insert_index == -1:
        # } 이전에 추가
        for i in range(len(lines) - 1, -1, -1):
            if lines[i].strip() == '}':
                insert_index = i
                break
    
    # 새 앱 등록 추가
    new_lines = []
    for app in unregistered:  # 모든 앱 등록
        import_path = f"./{app['id']}/{app['file'].replace('.tsx', '')}"
        new_lines.append(f"  '{app['id']}': () => import('{import_path}'),")
    
    if insert_index > 0:
        lines[insert_index:insert_index] = new_lines
        new_content = '\n'.join(lines)
        registry_file.write_text(new_content, encoding='utf-8')
        print(f'{len(new_lines)}개 앱을 appRegistry.tsx에 추가했습니다.')
    else:
        print('삽입 위치를 찾을 수 없습니다.')
else:
    print('appRegistry.tsx 파일을 찾을 수 없습니다.')
