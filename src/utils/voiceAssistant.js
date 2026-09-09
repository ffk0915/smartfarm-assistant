// 지금은 키워드 매칭 기반의 "목업 AI"입니다. MVP 단계에서는 실제 AI(LLM) 연동 대신
// 최대한 다양한 질문 케이스를 미리 대비해 자연스럽게 느껴지도록 폭을 넓혀뒀어요.
// 실제 서비스로 넘어갈 때는 이 파일 내부만 fetch(백엔드 프록시 → LLM API 호출)로
// 교체하면 됩니다. (README.md > "음성 AI를 실제 AI로 교체하기" 참고)
import { mockToday, mockAgriIndex, mockAgriSchedule } from "../data/mockWeather";
import { PEST_INFO } from "../data/mockPests";
import { CROPS, cropName } from "../data/mockCrops";
import { FERTILIZER_STANDARD } from "../data/mockFertilizer";
import { NEARBY_FARMS, FARM_STATUS_LEVEL } from "../data/mockFarms";

// 질문 문장 속에 작물 이름이 직접 언급되면 그 작물을 우선 사용하고,
// 언급이 없으면 설정에서 고른 대표 작물(fallbackCrop)을 사용해요.
function detectCrop(query, fallbackCrop) {
  const found = CROPS.find((c) => query.includes(c.name));
  return found ? found.key : fallbackCrop;
}

const GREETINGS = ["안녕", "하이", "반가워"];
const THANKS = ["고마워", "감사"];
const HELP = ["뭐 할 수 있어", "뭐 물어", "도움말", "사용법", "기능"];

export function getAssistantReply(query, { crop } = {}) {
  const q = query.trim();

  if (!q) {
    return "질문을 다시 말씀해 주세요.";
  }

  if (GREETINGS.some((w) => q.includes(w))) {
    return "안녕하세요! 날씨, 비료, 병해충, 농가정보, 농사 일정 중 궁금한 걸 물어보세요.";
  }

  if (THANKS.some((w) => q.includes(w))) {
    return "도움이 됐다니 다행이에요. 더 궁금한 게 있으면 편하게 물어보세요.";
  }

  if (HELP.some((w) => q.includes(w))) {
    return "오늘 날씨, 작물별 비료 시비량, 병해충 예방법, 주변 농가 현황, 농사 일정을 물어볼 수 있어요.";
  }

  if (q.includes("흙토람")) {
    return "흙토람은 토양검정 기반 정밀 처방 사이트예요. 비료계산탭이나 설정탭의 바로가기 버튼으로 이동할 수 있어요.";
  }

  if (q.includes("날씨") || q.includes("기온") || q.includes("비") || q.includes("예보")) {
    return `오늘 ${mockToday.location}은 ${mockToday.condition}, 최고 ${mockToday.tempMax}도예요. ${mockToday.advisory}`;
  }

  if (q.includes("비료") || q.includes("시비")) {
    const targetCrop = detectCrop(q, crop);
    const std = targetCrop ? FERTILIZER_STANDARD[targetCrop] : null;
    if (std) {
      return `${cropName(targetCrop)}의 10a당 표준 시비량은 질소 ${std.n} · 인산 ${std.p} · 칼리 ${std.k}kg이에요. 정확한 처방은 흙토람도 함께 확인하세요.`;
    }
    return "비료계산탭에서 작물과 재배 면적을 입력하면 예상 시비량을 바로 계산해드려요.";
  }

  if (q.includes("일정") || q.includes("파종") || q.includes("정식") || q.includes("수확")) {
    const targetCrop = detectCrop(q, crop);
    const match = mockAgriSchedule.find((s) => targetCrop && s.cropKeys.includes(targetCrop));
    if (match) {
      return `[${match.period}] ${match.title} — ${match.description}`;
    }
    return "날씨분석탭에서 절기와 기상 흐름에 맞춘 농업 일정을 확인할 수 있어요.";
  }

  if (q.includes("병해충") || q.includes("병") || q.includes("벌레") || q.includes("방제")) {
    const targetCrop = detectCrop(q, crop);
    const match = PEST_INFO.find((p) => targetCrop && p.cropKeys.includes(targetCrop));
    if (match) {
      return `요즘 ${cropName(targetCrop)}에서 주의할 병해충은 ${match.name}이에요. ${match.action}`;
    }
    return "농가정보탭에서 작물별 병해충 예방법과 대책을 확인할 수 있어요.";
  }

  if (q.includes("농가") || q.includes("이웃") || q.includes("주변")) {
    const alert = NEARBY_FARMS.find((f) => FARM_STATUS_LEVEL[f.status] !== "ok");
    if (alert) {
      return `주변에서는 ${alert.name}에 ${alert.note} 소식이 있어요. 농가정보탭에서 자세히 볼 수 있어요.`;
    }
    return "현재 주변 농가에 특이사항은 없어요. 농가정보탭에서 전체 현황을 볼 수 있어요.";
  }

  if (q.includes("위험") || q.includes("지수")) {
    const top = mockAgriIndex.find((a) => a.level === "높음") ?? mockAgriIndex[0];
    return `현재 ${top.label}가 ${top.level} 단계예요. ${top.detail}`;
  }

  return "아직 목업 데이터로 동작하는 음성 AI예요. '날씨', '비료', '병해충', '농가', '일정' 같은 키워드로 물어보세요.";
}

export function speak(text, { lang = "ko-KR" } = {}) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 1.0;
  window.speechSynthesis.speak(utterance);
}
