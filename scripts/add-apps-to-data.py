#!/usr/bin/env python3
"""
앱들을 data/apps.ts에 자동으로 추가하는 스크립트
"""
import os
import re
import json
from pathlib import Path

apps_dir = Path('app/apps')
data_file = Path('data/apps.ts')
program_dir = Path('program')

# 기존에 등록된 앱 ID 가져오기
existing_ids = set()
if data_file.exists():
    content = data_file.read_text(encoding='utf-8')
    matches = re.findall(r"id:\s*'([^']+)'", content)
    existing_ids = set(matches)

print(f'기존 등록된 앱 수: {len(existing_ids)}')

# 프로그램 폴더에서 menuId 매핑 생성
menu_mapping = {}
if program_dir.exists():
    # 폴더 구조 기반으로 menuId 추정
    folder_menu_map = {
        'I 컴퓨팅 시스템_1 네트워크': 'unit-1-1',
        'I 컴퓨팅 시스템_2 사물 인터넷 시스템': 'unit-1-2',
        'II 데이터_1 디지털 데이터의 압축과 암호화': 'unit-2-1',
        'II 데이터_2 빅데이터': 'unit-2-2',
        'III 알고리즘과 프로그래밍_1 알고리즘': 'unit-3-1',
        'III 알고리즘과 프로그래밍_2 프로그래밍': 'unit-3-2',
        'IV 인공지능_1 지능 에이전트': 'unit-4-1',
        'IV 인공지능_2 기계학습': 'unit-4-2',
        'V 디지털 문화_1 디지털 기술과 사회 변화': 'unit-5-1',
        'V 디지털 문화_2 정보 보호와 보안': 'unit-5-2',
    }
    
    for root, dirs, files in os.walk(program_dir):
        root_path = Path(root)
        rel_path = root_path.relative_to(program_dir)
        
        if len(rel_path.parts) == 2:  # program/카테고리/앱명
            category = rel_path.parts[0]
            app_name = rel_path.parts[1]
            
            if category in folder_menu_map:
                # 폴더명을 kebab-case로 변환
                app_id = re.sub(r'[^\w\s\-가-힣]', '', app_name)
                app_id = re.sub(r'[\s·\.]+', '-', app_id)
                app_id = re.sub(r'-+', '-', app_id).strip('-').lower()
                menu_mapping[app_id] = folder_menu_map[category]

# 등록되지 않은 앱 찾기
unregistered = []
for item in sorted(apps_dir.iterdir()):
    if item.is_dir() and item.name != '[id]' and item.name not in existing_ids:
        # README.md나 metadata.json에서 정보 추출
        name = item.name
        description = ''
        menu_id = menu_mapping.get(item.name, 'unit-1-1')  # 기본값
        
        # metadata.json 확인
        metadata_file = item / 'metadata.json'
        if metadata_file.exists():
            try:
                metadata = json.loads(metadata_file.read_text(encoding='utf-8'))
                name = metadata.get('name', name)
                description = metadata.get('description', '')
            except:
                pass
        
        # README.md 확인
        readme_file = item / 'README.md'
        if readme_file.exists() and not description:
            try:
                readme_content = readme_file.read_text(encoding='utf-8')
                lines = readme_content.split('\n')
                if lines:
                    # 첫 번째 줄을 이름으로, 두 번째 줄을 설명으로
                    if len(lines) > 1:
                        description = lines[1].strip()
            except:
                pass
        
        # 이름이 없으면 폴더명에서 생성
        if name == item.name:
            # 한글 폴더명 처리
            name = item.name.replace('-', ' ').replace('_', ' ')
            name = ' '.join(word.capitalize() for word in name.split())
        
        # 설명이 없으면 기본 설명 생성
        if not description:
            description = f'{name} 학습 앱'
        
        unregistered.append({
            'id': item.name,
            'name': name,
            'description': description,
            'menuId': menu_id
        })

print(f'등록할 앱 수: {len(unregistered)}')

# data/apps.ts 파일 읽기
if data_file.exists():
    content = data_file.read_text(encoding='utf-8')
    
    # 마지막 } 이전에 추가
    lines = content.split('\n')
    insert_index = -1
    for i in range(len(lines) - 1, -1, -1):
        if lines[i].strip() == '  },':  # 마지막 앱 항목의 닫는 부분
            insert_index = i + 1
            break
    
    if insert_index == -1:
        # ] 이전에 추가
        for i in range(len(lines) - 1, -1, -1):
            if lines[i].strip() == ']':
                insert_index = i
                break
    
    # 새 앱 항목 생성
    new_lines = []
    for app in unregistered:
        new_lines.append('  {')
        new_lines.append(f"    id: '{app['id']}',")
        new_lines.append(f"    name: '{app['name']}',")
        new_lines.append(f"    description: '{app['description']}',")
        new_lines.append("    badge: 'new',")
        new_lines.append("    category: '정보',")
        new_lines.append("    buttonText: '시작하기',")
        new_lines.append(f"    menuId: '{app['menuId']}',")
        new_lines.append('  },')
    
    if insert_index > 0:
        lines[insert_index:insert_index] = new_lines
        new_content = '\n'.join(lines)
        data_file.write_text(new_content, encoding='utf-8')
        print(f'{len(new_lines) // 8}개 앱을 data/apps.ts에 추가했습니다.')
    else:
        print('삽입 위치를 찾을 수 없습니다.')
else:
    print('data/apps.ts 파일을 찾을 수 없습니다.')
