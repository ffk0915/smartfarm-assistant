# 스마트팜 도우미 (Smart Farm Helper)

기상청 날씨, 농사로 비료/농가 정보, 병해충 예방법을 한 곳에서 보여주는
**농업인용 모바일 PWA**입니다. React + Vite로 만들었고, 지금은 모든 데이터가
**목업(예시) 데이터**로 동작합니다. 실제 공공데이터 API로 바꾸는 방법은
아래 "실제 공공데이터 API 연동하기"를 참고하세요.

## 포함된 기능

- **홈**: 오늘의 날씨, 비료 정보 요약, 주변 농가 알림 요약
- **날씨분석**: 시간대별·주간 예보, 농업기상 지수, 절기별 농업 일정
- **비료계산**: 작물 · 면적 · 토양 유기물 함량 기반 시비량 계산, 흙토람 연계
- **농가정보**: 주변 농가 현황, 작물별 병해충 예방법 및 대책
- **설정**: 개인정보(기기 저장), 농가 정보, 작물 선택, 관련 사이트 바로가기
- **공통**: 음성 인식 + 음성 답변(FAB 버튼, 모든 탭에서 접근 가능), 한자어 농업용어 탭 풀이

## 기술 스택

- React 18 + Vite 5
- vite-plugin-pwa (매니페스트 자동 생성 + 서비스워커로 오프라인 캐싱)
- lucide-react (아이콘)
- 브라우저 내장 Web Speech API (음성인식/음성출력, 별도 키 불필요)
- 저장은 전부 `localStorage` — 로그인 없음, 서버 없음

## 시작하기

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:5173` 접속. 모바일에서 테스트하려면 PC와 같은
Wi-Fi에 연결한 뒤 `http://<PC의 사설IP>:5173`으로 접속하세요.

### PWA로 설치해보기 (오프라인 캐싱은 dev 모드에서도 활성화되어 있어요)

```bash
npm run build
npm run preview
```

`npm run preview`가 띄워주는 주소를 모바일 브라우저로 열고,
- Android(Chrome): 메뉴 → "홈 화면에 추가"
- iOS(Safari): 공유 버튼 → "홈 화면에 추가"

## 배포하기

정적 파일만 빌드되므로 Vercel, Netlify, Cloudflare Pages, GitHub Pages 등
어디에든 `npm run build`로 나온 `dist/` 폴더를 올리면 됩니다.
**PWA(서비스워커)는 HTTPS 환경에서만 정상 동작**하니, 위 서비스들처럼
기본적으로 HTTPS를 제공하는 곳을 추천해요.

## 실제 공공데이터 API 연동하기

### 1) 기상청 단기예보 조회서비스

1. [data.go.kr](https://www.data.go.kr) 회원가입 → 로그인
2. "기상청_단기예보 조회서비스" 검색 → 활용신청 (보통 즉시 승인)
3. 마이페이지에서 **인증키(서비스키)** 확인
4. 프로젝트 루트에 `.env.local` 생성 후:
   ```
   VITE_KMA_SERVICE_KEY=발급받은_키
   ```
5. `src/data/mockWeather.js`를 참고해 같은 모양의 데이터를 반환하는
   `src/data/weatherApi.js`를 만들고, `fetch`로 실제 API를 호출하도록 교체
   - ⚠️ 기상청 API는 브라우저에서 직접 호출 시 CORS가 막힐 수 있어요.
     막히면 Vercel Functions 등 서버리스 프록시를 하나 두고, 프론트는
     그 프록시 주소로만 요청하세요.
6. `vite.config.js`의 `API_CACHE_PATTERNS`에 API 도메인을 추가하면
   오프라인일 때도 마지막으로 받은 날씨를 보여줄 수 있어요.

### 2) 농사로 Open API

1. [data.go.kr](https://www.data.go.kr)에서 "농사로" 검색 — 병해충 정보,
   농작업 정보 등 세부 서비스별로 각각 활용신청이 필요해요.
2. 발급받은 키를 `.env.local`에 `VITE_NONGSARO_SERVICE_KEY`로 저장
3. `src/data/mockPests.js`, `src/data/mockFertilizer.js`의 데이터 구조를
   참고해서 실제 응답을 같은 모양으로 매핑

### 3) 흙토람 (토양검정 처방)

흙토람은 개인별 토양검정 결과를 기반으로 하는 서비스라 공개 Open API가
제한적이에요. 지금 앱은 "설정"과 "비료계산" 탭에서 **외부 링크로 바로 이동**하는
방식(`ExternalLinkButton`)으로 연계해뒀어요. 정밀 연동이 꼭 필요하다면
농촌진흥청 담당 부서에 기관 연계를 문의하는 걸 추천해요.

### 4) 음성 AI를 실제 AI로 교체하기

지금 `src/utils/voiceAssistant.js`의 `getAssistantReply()`는 키워드 매칭만
하는 목업이에요. 실제 AI로 바꾸려면:

1. Anthropic Claude API, OpenAI API, 네이버 클로바 스튜디오 등에서 API 키 발급
2. **키를 프론트엔드 코드에 직접 넣지 마세요.** 브라우저에 그대로 노출돼요.
   Vercel Functions, Cloudflare Workers 같은 서버리스 함수를 하나 만들어
   키는 그 서버에만 두고, 앱은 그 서버 주소로만 요청하세요.
3. `getAssistantReply`를 아래처럼 `fetch` 호출로 바꾸면 나머지 UI 코드는
   그대로 재사용할 수 있어요.

```js
// src/utils/voiceAssistant.js (예시)
export async function getAssistantReply(query, context) {
  const res = await fetch("/api/assistant", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, context }),
  });
  const data = await res.json();
  return data.reply;
}
```

## 아이콘 / 디자인 자산 교체하기

`design/make_icons.py`(Pillow 사용)가 새싹 로고를 직접 그려서
`public/icons/`에 192/512/마스커블/파비콘 PNG를 생성해요. 색상이나
모양을 바꾸고 싶으면 이 스크립트의 좌표·색상 값을 수정한 뒤:

```bash
pip install pillow
python design/make_icons.py
```

완전히 새 로고(그림 파일)를 쓰고 싶다면 직접 만든 정사각형 이미지를
192×192, 512×512(2장: 일반용 · 마스커블용), 180×180(iOS) 크기로 준비해서
`public/icons/`의 같은 파일명으로 덮어써도 돼요.

## 알려진 제한사항

- iOS Safari는 아직 `SpeechRecognition`(음성 인식)을 지원하지 않는 경우가
  많아요. 그런 환경에서는 자동으로 텍스트 입력 방식으로 안내돼요.
- 비료 시비량, 병해충 정보는 **데모 흐름을 보여주기 위한 예시 값**이에요.
  실제 농사에는 흙토람·농사로의 공식 데이터를 반드시 함께 확인하세요.
- 개인정보/농가정보는 서버로 전송되지 않고 기기의 `localStorage`에만
  저장돼요. 기기를 바꾸거나 브라우저 데이터를 지우면 사라져요.
