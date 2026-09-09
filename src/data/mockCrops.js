// 설정 화면의 "작물 선택"과 비료계산/날씨분석 탭에서 공통으로 쓰는 작물 목록
export const CROPS = [
  { key: "rice", name: "벼", icon: "🌾" },
  { key: "napa-cabbage", name: "배추", icon: "🥬" },
  { key: "pepper", name: "고추", icon: "🌶️" },
  { key: "sesame", name: "참깨", icon: "🌱" },
  { key: "sweet-potato", name: "고구마", icon: "🍠" },
  { key: "garlic", name: "마늘", icon: "🧄" },
  { key: "onion", name: "양파", icon: "🧅" },
  { key: "soybean", name: "콩", icon: "🫘" },
];

export function cropName(key) {
  return CROPS.find((c) => c.key === key)?.name ?? key;
}
