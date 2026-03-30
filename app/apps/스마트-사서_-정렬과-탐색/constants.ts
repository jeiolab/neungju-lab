import { Book } from './types';

// Generate 20 books with titles that sort alphabetically clearly
export const INITIAL_BOOKS: Book[] = [
  { id: 1, title: "가상현실의 미래", color: "bg-red-700", height: 90 },
  { id: 2, title: "나의 라임 오렌지나무", color: "bg-green-700", height: 85 },
  { id: 3, title: "다윈의 진화론", color: "bg-blue-700", height: 95 },
  { id: 4, title: "라틴어 수업", color: "bg-yellow-600", height: 88 },
  { id: 5, title: "마음의 소리", color: "bg-purple-700", height: 92 },
  { id: 6, title: "바다의 역사", color: "bg-indigo-700", height: 80 },
  { id: 7, title: "사피엔스", color: "bg-teal-700", height: 98 },
  { id: 8, title: "아몬드", color: "bg-orange-700", height: 94 },
  { id: 9, title: "자본론", color: "bg-lime-700", height: 82 },
  { id: 10, title: "차라투스트라는 이렇게 말했다", color: "bg-sky-700", height: 96 },
  { id: 11, title: "카프카의 변신", color: "bg-zinc-700", height: 89 },
  { id: 12, title: "타인이 지옥이다", color: "bg-emerald-700", height: 91 },
  { id: 13, title: "파우스트", color: "bg-rose-700", height: 86 },
  { id: 14, title: "하늘과 바람과 별과 시", color: "bg-fuchsia-700", height: 93 },
  { id: 15, title: "한국의 야생화", color: "bg-cyan-700", height: 84 },
  { id: 16, title: "햄릿", color: "bg-amber-700", height: 97 },
  { id: 17, title: "허클베리 핀의 모험", color: "bg-slate-700", height: 90 },
  { id: 18, title: "호밀밭의 파수꾼", color: "bg-violet-700", height: 88 },
  { id: 19, title: "화성에서 온 남자 금성에서 온 여자", color: "bg-blue-900", height: 99 },
  { id: 20, title: "황무지", color: "bg-green-900", height: 85 },
];

export const SHUFFLE_BOOKS = (books: Book[]): Book[] => {
  const newBooks = [...books];
  for (let i = newBooks.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newBooks[i], newBooks[j]] = [newBooks[j], newBooks[i]];
  }
  return newBooks;
};

export const SORT_BOOKS = (books: Book[]): Book[] => {
  return [...books].sort((a, b) => a.title.localeCompare(b.title, 'ko'));
};