import { NextRequest, NextResponse } from 'next/server'
import { readFile, writeFile } from 'fs/promises'
import { join } from 'path'

export async function POST(request: NextRequest) {
  try {
    // 서버리스 환경(프로덕션)에서는 파일 시스템이 읽기 전용입니다
    // 로컬 개발 환경에서만 작동합니다
    if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        {
          error: '이 기능은 프로덕션 환경에서 사용할 수 없습니다.',
          details: '서버리스 환경에서는 파일 시스템이 읽기 전용입니다. 로컬 개발 환경에서만 사용 가능합니다.',
        },
        { status: 403 }
      )
    }

    const { appId, updates } = await request.json()

    if (!appId || !updates) {
      return NextResponse.json({ error: 'appId와 updates가 필요합니다.' }, { status: 400 })
    }

    // data/apps.ts 파일 읽기
    const filePath = join(process.cwd(), 'data', 'apps.ts')
    const fileContent = await readFile(filePath, 'utf-8')

    // 앱 찾기 및 업데이트
    const appPattern = new RegExp(
      `(\\{[^}]*id:\\s*['"]${appId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"][^}]*?)(\\})`,
      's'
    )

    const match = fileContent.match(appPattern)

    if (!match) {
      return NextResponse.json({ error: '앱을 찾을 수 없습니다.' }, { status: 404 })
    }

    let updatedAppBlock = match[1]

    // menuId 업데이트
    if (updates.menuId !== undefined) {
      if (updates.menuId) {
        // menuId가 있으면 추가 또는 업데이트
        if (updatedAppBlock.includes('menuId:')) {
          updatedAppBlock = updatedAppBlock.replace(
            /menuId:\s*['"][^'"]*['"]/,
            `menuId: '${updates.menuId}'`
          )
        } else {
          // menuId가 없으면 추가
          if (updatedAppBlock.includes('category:')) {
            updatedAppBlock = updatedAppBlock.replace(
              /(category:\s*['"][^'"]*['"])/,
              `$1,\n    menuId: '${updates.menuId}'`
            )
          } else {
            updatedAppBlock += `,\n    menuId: '${updates.menuId}'`
          }
        }
      } else {
        // menuId를 제거
        updatedAppBlock = updatedAppBlock.replace(/,\s*menuId:\s*['"][^'"]*['"]/g, '')
        updatedAppBlock = updatedAppBlock.replace(/menuId:\s*['"][^'"]*['"],?\s*/g, '')
      }
    }

    // category 업데이트
    if (updates.category !== undefined) {
      if (updates.category) {
        if (updatedAppBlock.includes('category:')) {
          updatedAppBlock = updatedAppBlock.replace(
            /category:\s*['"][^'"]*['"]/,
            `category: '${updates.category}'`
          )
        } else {
          updatedAppBlock += `,\n    category: '${updates.category}'`
        }
      } else {
        updatedAppBlock = updatedAppBlock.replace(/,\s*category:\s*['"][^'"]*['"]/g, '')
        updatedAppBlock = updatedAppBlock.replace(/category:\s*['"][^'"]*['"],?\s*/g, '')
      }
    }

    // description 업데이트
    if (updates.description !== undefined) {
      if (updatedAppBlock.includes('description:')) {
        // 작은따옴표 이스케이프 처리
        const escapedDescription = updates.description.replace(/'/g, "\\'")
        updatedAppBlock = updatedAppBlock.replace(
          /description:\s*['"]([^'"]*)['"]/,
          `description: '${escapedDescription}'`
        )
      } else {
        const escapedDescription = updates.description.replace(/'/g, "\\'")
        updatedAppBlock += `,\n    description: '${escapedDescription}'`
      }
    }

    // badge 업데이트
    if (updates.badge !== undefined) {
      if (updates.badge) {
        if (updatedAppBlock.includes('badge:')) {
          updatedAppBlock = updatedAppBlock.replace(
            /badge:\s*['"][^'"]*['"]/,
            `badge: '${updates.badge}'`
          )
        } else {
          updatedAppBlock += `,\n    badge: '${updates.badge}'`
        }
      } else {
        updatedAppBlock = updatedAppBlock.replace(/,\s*badge:\s*['"][^'"]*['"]/g, '')
        updatedAppBlock = updatedAppBlock.replace(/badge:\s*['"][^'"]*['"],?\s*/g, '')
      }
    }

    // 파일 내용 업데이트
    const newContent = fileContent.replace(appPattern, updatedAppBlock + match[2])

    // 파일 저장
    await writeFile(filePath, newContent, 'utf-8')

    return NextResponse.json({ success: true, message: '앱이 업데이트되었습니다.' })
  } catch (error) {
    console.error('앱 업데이트 오류:', error)
    return NextResponse.json(
      { error: '앱 업데이트 중 오류가 발생했습니다.', details: String(error) },
      { status: 500 }
    )
  }
}
