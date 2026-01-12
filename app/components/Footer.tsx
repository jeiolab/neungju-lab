export default function Footer() {
  return (
    <footer className="w-full mt-auto py-6 border-t border-gray-200 bg-background-light">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex flex-col gap-2">
            <p className="text-sm text-gray-600">
              오류 및 문의: <a href="mailto:ilsangsw@gmail.com" className="text-primary hover:underline font-medium">ilsangsw@gmail.com</a>
            </p>
            <p className="text-xs text-gray-500 leading-relaxed">
              Copyright © {new Date().getFullYear()} JEIO. All Rights Reserved.
              <br />
              본 웹사이트의 모든 콘텐츠(텍스트, 이미지, 소프트웨어, 디자인 등)는 저작권법 및 관련 법령의 보호를 받습니다.
              <br />
              무단 복제, 배포, 전송, 수정, 공연, 방송, 전시, 2차적 저작물 작성 등 저작권자의 허락 없이 사용할 수 없으며,
              <br />
              위반 시 저작권법 및 관련 법령에 따라 민사상 손해배상 및 형사상 처벌을 받을 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
