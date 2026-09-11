export const REGIONS = [
  { key: "seoul", name: "서울특별시", lat: 37.5665, lon: 126.978 },
  { key: "busan", name: "부산광역시", lat: 35.1796, lon: 129.0756 },
  { key: "daegu", name: "대구광역시", lat: 35.8714, lon: 128.6014 },
  { key: "incheon", name: "인천광역시", lat: 37.4563, lon: 126.7052 },
  { key: "gwangju", name: "광주광역시", lat: 35.1595, lon: 126.8526 },
  { key: "daejeon", name: "대전광역시", lat: 36.3504, lon: 127.3845 },
  { key: "ulsan", name: "울산광역시", lat: 35.5384, lon: 129.3114 },
  { key: "sejong", name: "세종특별자치시", lat: 36.48, lon: 127.289 },
  { key: "gyeonggi", name: "경기도", lat: 37.4138, lon: 127.5183 },
  { key: "gangwon", name: "강원특별자치도", lat: 37.8228, lon: 128.1555 },
  { key: "chungbuk", name: "충청북도", lat: 36.6357, lon: 127.4917 },
  { key: "chungnam", name: "충청남도", lat: 36.6588, lon: 126.6728 },
  { key: "jeonbuk", name: "전북특별자치도", lat: 35.8203, lon: 127.1088 },
  { key: "jeonnam", name: "전라남도", lat: 34.8161, lon: 126.4629 },
  { key: "gyeongbuk", name: "경상북도", lat: 36.576, lon: 128.5056 },
  { key: "gyeongnam", name: "경상남도", lat: 35.2378, lon: 128.6923 },
  { key: "jeju", name: "제주특별자치도", lat: 33.4996, lon: 126.5312 },
];

export function getRegionByKey(key) {
  return REGIONS.find((r) => r.key === key) || REGIONS[0];
}