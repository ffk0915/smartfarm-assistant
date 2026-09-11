const IS_DEV = typeof import.meta !== "undefined" && import.meta.env?.DEV;

const AUTH_KEY =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_KMA_AUTH_KEY) ||
  "wtGTRP6PRcqRk0T-j9XK-Q";

const BASE_URL = IS_DEV
  ? "/kma-api/api/typ02/openApi/VilageFcstInfoService_2.0/getVilageFcst"
  : "/api/weather";

function latLonToGrid(lat, lon) {
  const RE = 6371.00877;
  const GRID = 5.0;
  const SLAT1 = 30.0;
  const SLAT2 = 60.0;
  const OLON = 126.0;
  const OLAT = 38.0;
  const XO = 43;
  const YO = 136;

  const DEGRAD = Math.PI / 180.0;
  const re = RE / GRID;
  const slat1 = SLAT1 * DEGRAD;
  const slat2 = SLAT2 * DEGRAD;
  const olon = OLON * DEGRAD;
  const olat = OLAT * DEGRAD;

  let sn =
    Math.tan(Math.PI * 0.25 + slat2 * 0.5) /
    Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
  let sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sf = (Math.pow(sf, sn) * Math.cos(slat1)) / sn;
  let ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
  ro = (re * sf) / Math.pow(ro, sn);

  let ra = Math.tan(Math.PI * 0.25 + lat * DEGRAD * 0.5);
  ra = (re * sf) / Math.pow(ra, sn);
  let theta = lon * DEGRAD - olon;
  if (theta > Math.PI) theta -= 2.0 * Math.PI;
  if (theta < -Math.PI) theta += 2.0 * Math.PI;
  theta *= sn;

  const nx = Math.floor(ra * Math.sin(theta) + XO + 0.5);
  const ny = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);

  return { nx, ny };
}

function getLatestBaseDateTime(now = new Date()) {
  const BASE_TIMES = [2, 5, 8, 11, 14, 17, 20, 23];
  const d = new Date(now);
  d.setMinutes(d.getMinutes() - 10);

  let hour = d.getHours();
  let candidate = [...BASE_TIMES].reverse().find((h) => h <= hour);

  if (candidate === undefined) {
    d.setDate(d.getDate() - 1);
    candidate = 23;
  }

  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const base_date = `${yyyy}${mm}${dd}`;
  const base_time = `${String(candidate).padStart(2, "0")}00`;

  return { base_date, base_time };
}

export async function fetchVilageForecast(lat, lon) {
  const { nx, ny } = latLonToGrid(lat, lon);
  const { base_date, base_time } = getLatestBaseDateTime();

  const paramsObj = {
    base_date,
    base_time,
    nx: String(nx),
    ny: String(ny),
  };

  if (IS_DEV) {
    paramsObj.pageNo = "1";
    paramsObj.numOfRows = "1000";
    paramsObj.dataType = "JSON";
    paramsObj.authKey = AUTH_KEY;
  }

  const params = new URLSearchParams(paramsObj);

  const res = await fetch(`${BASE_URL}?${params.toString()}`);
  const json = await res.json();

  if (json.result?.status) {
    throw new Error(`기상청 API 오류: ${json.result.message}`);
  }

  const header = json.response?.header;
  if (header?.resultCode !== "00") {
    throw new Error(`기상청 API 오류: ${header?.resultMsg}`);
  }

  return json.response.body.items.item;
}