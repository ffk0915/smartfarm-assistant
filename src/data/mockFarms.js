// 농사로/지역 농업기술센터 데이터를 흉내 낸 "주변 농가 현황" 목업입니다.
export const NEARBY_FARMS = [
  {
    id: "farm-1",
    name: "동림마을 김OO 농가",
    distanceKm: 1.2,
    crop: "napa-cabbage",
    status: "정상",
    note: "이번 주 정식 완료",
  },
  {
    id: "farm-2",
    name: "본촌리 박OO 농가",
    distanceKm: 2.4,
    crop: "pepper",
    status: "주의",
    note: "탄저병 초기 증상 신고 접수",
  },
  {
    id: "farm-3",
    name: "선동 이OO 농가",
    distanceKm: 3.1,
    crop: "rice",
    status: "정상",
    note: "이번 주 수확 예정",
  },
  {
    id: "farm-4",
    name: "삼도 최OO 농가",
    distanceKm: 4.6,
    crop: "pepper",
    status: "경고",
    note: "담배나방 확산으로 공동방제 예정",
  },
  {
    id: "farm-5",
    name: "평동 정OO 농가",
    distanceKm: 5.0,
    crop: "onion",
    status: "정상",
    note: "육묘 순조롭게 진행 중",
  },
];

export const FARM_STATUS_LEVEL = {
  정상: "ok",
  주의: "warn",
  경고: "danger",
};
