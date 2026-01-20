import React from 'react';

export const Theory: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-600">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🏪 객체와 상호작용 (Object Interaction)</h2>
        <p className="text-gray-600 mb-4 leading-relaxed">
          편의점에는 <strong>'상품(Item)'</strong>과 <strong>'고객(Customer)'</strong>이라는 두 가지 주요 객체가 있습니다.
          프로그래밍에서도 이들을 <strong>클래스(Class)</strong>로 정의하고, 서로 영향을 주고받게 만들 수 있습니다.
        </p>
        
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-bold text-blue-800 mb-2">📦 Item (상품) 클래스</h3>
            <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
              <li><strong>속성(Attribute):</strong> 이름, 가격, 재고</li>
              <li><strong>메소드(Method):</strong> 팔리기(sell), 재고확인(check_stock)</li>
            </ul>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <h3 className="font-bold text-orange-800 mb-2">👤 Customer (고객) 클래스</h3>
            <ul className="list-disc list-inside text-sm text-orange-700 space-y-1">
              <li><strong>속성(Attribute):</strong> 이름, 가진 돈, 장바구니</li>
              <li><strong>메소드(Method):</strong> 구매하기(buy)</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 text-white rounded-xl shadow-md p-6 overflow-hidden">
        <h3 className="text-lg font-mono font-bold text-green-400 mb-3">&gt; Code Example (Python)</h3>
        <pre className="font-mono text-sm overflow-x-auto p-2 bg-gray-900 rounded border border-gray-700">
{`class Customer:
    def buy(self, item):
        # 1. 돈이 충분한지 확인
        if self.money < item.price:
            print("돈이 부족합니다!")
            return
        
        # 2. 재고가 있는지 확인 (Item 객체와 상호작용)
        if item.stock > 0:
            self.money -= item.price  # 내 돈 감소
            item.stock -= 1           # 상품 재고 감소
            print(f"{item.name} 구매 완료!")
        else:
            print("재고가 없습니다.")`}
        </pre>
        <p className="mt-4 text-gray-400 text-sm">
          위 코드에서 <code className="text-yellow-300">buy</code> 메소드는 <code className="text-blue-300">item</code> 객체를 매개변수로 받아
          그 속성(<code className="text-blue-300">stock</code>, <code className="text-blue-300">price</code>)에 접근하고 수정합니다.
          이것이 바로 <strong>객체 간의 상호작용</strong>입니다.
        </p>
      </div>
    </div>
  );
};

export const DeepDive: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🛠 __init__ 생성자의 비밀</h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          우리가 시뮬레이션에서 '상품 등록'이나 '고객 등록'을 할 때, 컴퓨터 내부에서는 클래스의 
          <code className="bg-gray-100 px-1 py-0.5 rounded font-mono text-pink-600 mx-1">__init__</code> 
          메소드가 호출됩니다.
        </p>

        <div className="relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-500 to-pink-500"></div>
            <div className="pl-6 py-2">
                <h3 className="text-lg font-bold text-gray-800">역할 (Role)</h3>
                <p className="text-gray-600 mt-1">객체가 처음 생성될 때, <strong>초기 상태(속성 값)를 설정</strong>하는 역할을 합니다.</p>
            </div>
        </div>

        <div className="mt-8 grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
                <div className="bg-white border-2 border-dashed border-gray-300 p-4 rounded-lg text-center">
                    <p className="text-sm text-gray-500 mb-2">입력 폼 (UI)</p>
                    <div className="inline-block bg-gray-100 rounded px-3 py-2 text-sm">
                        이름: "삼각김밥"<br/>
                        가격: 1200
                    </div>
                    <div className="my-2 text-2xl">⬇️</div>
                    <div className="inline-block bg-purple-100 text-purple-800 rounded px-3 py-2 font-mono text-sm font-bold">
                        new Item("삼각김밥", 1200)
                    </div>
                </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-4 text-white font-mono text-sm shadow-xl">
{`class Item:
    # 생성자 정의
    def __init__(self, name, price):
        self.name = name   # "삼각김밥"
        self.price = price # 1200
        self.stock = 0     # 기본값`}
            </div>
        </div>

        <div className="mt-6 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h4 className="font-bold text-yellow-800 text-sm">💡 생각해보세요</h4>
            <p className="text-yellow-700 text-sm mt-1">
                만약 <code className="font-mono">__init__</code> 메소드가 없다면, 우리는 객체를 만들 때마다 일일이 
                <code className="font-mono">item.name = "..."</code> 처럼 속성을 따로 지정해야 해서 매우 불편할 것입니다.
            </p>
        </div>
      </div>
    </div>
  );
};

export const Think: React.FC = () => {
    return (
        <div className="space-y-6 max-w-4xl mx-auto p-4">
             <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">🤔 생각해볼 문제: 1+1 행사 상품</h2>
                <p className="text-gray-600 mb-6">
                    일반 상품과 달리, 하나를 사면 하나를 더 주는 <strong>'1+1 행사 상품'</strong>은 
                    <code className="font-mono text-sm bg-gray-100 mx-1 px-1">Item</code> 클래스를 어떻게 변형해야 만들 수 있을까요?
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                        <h3 className="font-bold text-lg mb-2">방법 1: 상속 (Inheritance)</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            기존 <code className="font-mono">Item</code> 클래스의 모든 기능을 물려받고, 
                            <code className="font-mono">buy</code> 로직만 수정합니다.
                        </p>
                        <pre className="bg-gray-100 p-2 rounded text-xs font-mono text-gray-700">
{`class OnePlusOneItem(Item):
    def sell(self):
        super().sell() # 1개 차감
        self.stock -= 1 # 1개 더 차감!`}
                        </pre>
                    </div>

                    <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                        <h3 className="font-bold text-lg mb-2">방법 2: 속성 추가 (Attribute)</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            클래스를 새로 만들지 않고, <code className="font-mono">is_event</code> 같은 속성을 추가합니다.
                        </p>
                        <pre className="bg-gray-100 p-2 rounded text-xs font-mono text-gray-700">
{`if self.is_event == True:
    print("하나 더 드려요!")
    self.stock -= 1`}
                        </pre>
                    </div>
                </div>

                <div className="mt-8">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        나만의 아이디어를 적어보세요 (데이터는 저장되지 않습니다)
                    </label>
                    <textarea 
                        className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-600 focus:border-blue-600 p-3 border"
                        rows={4}
                        placeholder="예: 'BuyTwoGetOne' 클래스를 만들어서..."
                    ></textarea>
                </div>
             </div>
        </div>
    )
}