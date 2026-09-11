// api/weather.js
// Vercel 서버리스 함수: 기상청 날씨 데이터를 안전하게 대신 가져오는 코드

const AUTH_KEY = process.env.KMA_AUTH_KEY;
const REAL_BASE_URL =
  "https://apihub.kma.go.kr/api/typ02/openApi/VilageFcstInfoService_2.0/getVilageFcst";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");

  const { base_date, base_time, nx, ny } = req.query;

  if (!base_date || !base_time || !nx || !ny) {
    res.status(400).json({ error: "필수 파라미터가 없습니다." });
    return;
  }

  const params = new URLSearchParams({
    pageNo: "1",
    numOfRows: "1000",
    dataType: "JSON",
    base_date: String(base_date),
    base_time: String(base_time),
    nx: String(nx),
    ny: String(ny),
    authKey: AUTH_KEY,
  });

  try {
    const response = await fetch(`${REAL_BASE_URL}?${params.toString()}`);
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "기상청 API 호출 실패", detail: String(err) });
  }
}
