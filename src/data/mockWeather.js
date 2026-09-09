// 기상청(KMA) 단기예보 API 응답 형태를 흉내 낸 목업 데이터입니다.
// 실제 연동 방법은 README.md > "실제 공공데이터 API 연동하기"를 참고하세요.

export const mockToday = {
  location: "전남 광주광역시",
  baseTime: "06:00 발표",
  temperature: 27,
  tempMax: 30,
  tempMin: 21,
  humidity: 78,
  precipitationProb: 60,
  windSpeed: 2.1,
  sky: "구름많음",
  condition: "오후 소나기",
  advisory: "오후 습도가 높아 잿빛곰팡이병 등 병해 발생 위험이 커요. 시설 환기를 자주 해주세요.",
};

export const mockHourly = [
  { time: "09시", temp: 24, precipitationProb: 10, sky: "맑음" },
  { time: "12시", temp: 28, precipitationProb: 20, sky: "구름조금" },
  { time: "15시", temp: 30, precipitationProb: 60, sky: "흐림" },
  { time: "18시", temp: 26, precipitationProb: 70, sky: "소나기" },
  { time: "21시", temp: 23, precipitationProb: 30, sky: "구름많음" },
  { time: "00시", temp: 21, precipitationProb: 10, sky: "맑음" },
];

export const mockWeeklyForecast = [
  { day: "오늘", date: "9/2", tempMax: 30, tempMin: 21, sky: "흐림", precipitationProb: 60 },
  { day: "내일", date: "9/3", tempMax: 29, tempMin: 20, sky: "비", precipitationProb: 80 },
  { day: "수", date: "9/4", tempMax: 27, tempMin: 19, sky: "구름많음", precipitationProb: 40 },
  { day: "목", date: "9/5", tempMax: 26, tempMin: 18, sky: "맑음", precipitationProb: 10 },
  { day: "금", date: "9/6", tempMax: 28, tempMin: 19, sky: "맑음", precipitationProb: 10 },
  { day: "토", date: "9/7", tempMax: 29, tempMin: 20, sky: "구름조금", precipitationProb: 20 },
  { day: "일", date: "9/8", tempMax: 29, tempMin: 21, sky: "구름많음", precipitationProb: 30 },
];

// 기상 지수 — 실제 서비스에서는 기상청 농업기상정보나 자체 산출 모델로 대체
export const mockAgriIndex = [
  { key: "disease", label: "병해충 위험지수", level: "높음", detail: "고온다습 조건, 방제 점검 필요" },
  { key: "frost", label: "서리 위험", level: "낮음", detail: "당분간 서리 우려 없음" },
  { key: "drought", label: "가뭄 지수", level: "보통", detail: "최근 7일 강수량 평년 수준" },
  { key: "wind", label: "강풍 주의보", level: "낮음", detail: "풍속 3m/s 이하로 안정적" },
];

// 절기 및 기상 흐름에 따른 농업 일정 — 작물 key로 필터링해 보여줌
export const mockAgriSchedule = [
  {
    id: "sch-1",
    period: "9월 상순",
    cropKeys: ["rice", "napa-cabbage"],
    title: "벼 수확 적기 점검",
    description: "등숙기 막바지, 강우 예보 시 도복 피해에 대비해 배수로를 점검하세요.",
  },
  {
    id: "sch-2",
    period: "9월 상순",
    cropKeys: ["napa-cabbage", "pepper"],
    title: "가을배추 정식 준비",
    description: "정식 1주 전부터 상토에 관수량을 줄여 모종을 튼튼하게 순화하세요.",
  },
  {
    id: "sch-3",
    period: "9월 중순",
    cropKeys: ["pepper", "sesame"],
    title: "고온다습 병해 방제",
    description: "오후 소나기가 잦아 탄저병 확산 위험이 있어요. 예보 확인 후 방제 시기를 잡으세요.",
  },
  {
    id: "sch-4",
    period: "9월 중순",
    cropKeys: ["rice"],
    title: "벼 수확 및 건조",
    description: "수확 후 3일 이내 건조를 시작해 수분 함량 15% 내외로 맞추세요.",
  },
];
