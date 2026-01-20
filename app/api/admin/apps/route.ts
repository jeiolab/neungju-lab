import { NextRequest, NextResponse } from 'next/server'
import { writeFile, readFile } from 'fs/promises'
import { join } from 'path'

const APPS_FILE_PATH = join(process.cwd(), 'data', 'apps.ts')

export async function GET() {
  try {
    const fileContent = await readFile(APPS_FILE_PATH, 'utf-8')
    
    // apps 배열 추출
    const appsMatch = fileContent.match(/export const apps: App\[\] = \[([\s\S]*?)\]/)
    if (!appsMatch) {
      return NextResponse.json({ error: 'Apps array not found' }, { status: 500 })
    }

    // 간단한 파싱 (실제로는 더 정교한 파서가 필요할 수 있음)
    return NextResponse.json({ 
      message: 'Use POST to update apps',
      note: 'This endpoint is for reading the current apps structure'
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read apps file' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { apps } = body

    if (!Array.isArray(apps)) {
      return NextResponse.json({ error: 'Apps must be an array' }, { status: 400 })
    }

    // apps.ts 파일 읽기
    const fileContent = await readFile(APPS_FILE_PATH, 'utf-8')
    
    // apps 배열 부분을 새로운 데이터로 교체
    const appsJson = JSON.stringify(apps, null, 2)
      .replace(/"/g, "'")
      .replace(/'/g, "'")
      .replace(/'/g, "'")

    // TypeScript 배열로 변환
    const appsArray = apps.map(app => {
      const props = [
        `    id: '${app.id}'`,
        `    name: '${app.name.replace(/'/g, "\\'")}'`,
        `    description: '${app.description.replace(/'/g, "\\'")}'`,
      ]
      
      if (app.category) props.push(`    category: '${app.category}'`)
      if (app.menuId) props.push(`    menuId: '${app.menuId}'`)
      if (app.badge) props.push(`    badge: '${app.badge}'`)
      if (app.buttonText) props.push(`    buttonText: '${app.buttonText}'`)
      
      return `  {\n${props.join(',\n')},\n  }`
    }).join(',\n')

    const newContent = `export interface App {
  id: string
  name: string
  description: string
  badge?: 'new' | 'popular' | 'default'
  component?: React.ComponentType
  url?: string
  category?: '정보' | '인공지능기초' | '방과후' | '교사도구' | '수업도구' | '방과후학교'
  buttonText?: string
  // 메뉴 구조 기반 분류 - menuStructure.ts에 정의된 메뉴 ID 사용
  menuId?: string // 예: 'unit-1-1', 'ai-1', 'tool-1'
}

// 여기에 구글 AI 스튜디오에서 제작한 앱들을 추가하세요
export const apps: App[] = [
${appsArray}
]
`

    // 파일에 쓰기 (주의: 실제 운영 환경에서는 백업을 먼저 해야 합니다)
    await writeFile(APPS_FILE_PATH, newContent, 'utf-8')

    return NextResponse.json({ 
      success: true, 
      message: 'Apps updated successfully',
      count: apps.length 
    })
  } catch (error: any) {
    console.error('Error updating apps:', error)
    return NextResponse.json({ 
      error: 'Failed to update apps', 
      details: error.message 
    }, { status: 500 })
  }
}
