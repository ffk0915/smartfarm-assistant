import { useEffect, useState } from "react";
import { CloudSun, FlaskConical, Users, ChevronRight, AlertTriangle } from "lucide-react";
import Card from "../components/Card";
import HanjaTerm from "../components/HanjaTerm";
import StatusBadge from "../components/StatusBadge";
import { mockAgriIndex } from "../data/mockWeather";
import { FERTILIZER_STANDARD } from "../data/mockFertilizer";
import { NEARBY_FARMS, FARM_STATUS_LEVEL } from "../data/mockFarms";
import { cropName } from "../data/mockCrops";
import { fetchVilageForecast } from "../kmaWeather";
import { getRegionByKey } from "../data/regions";

const SKY_TEXT = { "1": "맑음", "3": "구름많음", "4": "흐림" };

function buildTodaySummary(items) {
  if (!items || items.length === 0) return null;
  const todayDate = items[0].fcstDate;
  const todayItems = items.filter((i) => i.fcstDate === todayDate);

  const tmpItems = todayItems.filter((i) => i.category === "TMP");
  const skyItems = todayItems.filter((i) => i.category === "SKY");
  const ptyItems = todayItems.filter((i) => i.category === "PTY");
  const tmxItem = todayItems.find((i) => i.category === "TMX");
  const tmnItem = todayItems.find((i) => i.category === "TMN");

  const temps = tmpItems.map((i) => Number(i.fcstValue)).filter((n) => !Number.isNaN(n));
  const tempMax = tmxItem ? tmxItem.fcstValue : (temps.length ? Math.max(...temps) : "-");
  const tempMin = tmnItem ? tmnItem.fcstValue : (temps.length ? Math.min(...temps) : "-");
  const willRain = ptyItems.some((i) => i.fcstValue !== "0");

  let advisory;
  if (willRain) {
    advisory = "비나 눈 소식이 있어요. 농작업 일정을 조정해보세요.";
  } else if (Number(tempMax) >= 33) {
    advisory = "매우 더운 날씨예요. 한낮 작업은 피해주세요.";
  } else if (Number(tempMin) <= 0) {
    advisory = "기온이 많이 낮아요. 작물 동해에 주의하세요.";
  } else {
    advisory = "맑은 하루예요. 농작업하기 좋은 날씨예요.";
  }

  return {
    temperature: tmpItems[0]?.fcstValue ?? "-",
    condition: SKY_TEXT[skyItems[0]?.fcstValue] || "-",
    tempMax,
    tempMin,
    advisory,
  };
}

export default function Home({ settings, onNavigate }) {
  const crop = settings.primaryCrop;
  const std = FERTILIZER_STANDARD[crop];
  const riskIndex = mockAgriIndex.find((a) => a.level === "높음");
  const alertFarms = NEARBY_FARMS.filter((f) => FARM_STATUS_LEVEL[f.status] !== "ok");

  const region = getRegionByKey(settings.farm?.region);
  const [today, setToday] = useState(null);
  const [weatherError, setWeatherError] = useState(null);

  useEffect(() => {
    fetchVilageForecast(region.lat, region.lon)
      .then((items) => setToday(buildTodaySummary(items)))
      .catch((e) => setWeatherError(e.message));
  }, [region.lat, region.lon]);

  return (
    <div className="page-section">
      <Card accent="sky" title={`오늘의 날씨 · ${region.name}`}>
        {today ? (
          <>
            <div className="row" style={{ alignItems: "flex-start" }}>
              <div>
                <p style={{ fontSize: "2rem", fontWeight: 800, margin: "0 0 2px" }}>
                  {today.temperature}°
                </p>
                <p className="muted" style={{ margin: 0 }}>
                  {today.condition} · 최고 {today.tempMax}° / 최저 {today.tempMin}°
                </p>
              </div>
              <CloudSun size={36} color="var(--sky)" />
            </div>
            <p style={{ marginTop: 10, marginBottom: 0 }}>{today.advisory}</p>
          </>
        ) : (
          <p className="muted">
            {weatherError ? `날씨 정보를 불러오지 못했어요: ${weatherError}` : "날씨 정보를 불러오는 중..."}
          </p>
        )}
        <button className="link-more" onClick={() => onNavigate("weather")}>
          날씨분석 자세히 보기 <ChevronRight size={16} />
        </button>
      </Card>

      <div className="furrow-divider" />

      <Card
        accent="grain"
        title="비료 정보"
        action={<FlaskConical size={20} color="var(--grain)" />}
      >
        {std ? (
          <>
            <p style={{ margin: "0 0 8px" }}>
              내 대표 작물 <strong>{cropName(crop)}</strong>의 10a당 표준{" "}
              <HanjaTerm term="시비">시비량</HanjaTerm>은 질소 {std.n} · 인산 {std.p} · 칼리 {std.k}
              kg이에요.
            </p>
            <p className="muted" style={{ margin: 0 }}>{std.note}</p>
          </>
        ) : (
          <p className="muted">설정에서 대표 작물을 먼저 선택해주세요.</p>
        )}
        <button className="link-more" onClick={() => onNavigate("fertilizer")}>
          우리 밭 비료량 계산하기 <ChevronRight size={16} />
        </button>
      </Card>

      <Card
        accent={alertFarms.length ? "danger" : "soil"}
        title="농가 정보"
        action={<Users size={20} color="var(--soil)" />}
      >
        {alertFarms.length > 0 ? (
          <>
            <p style={{ margin: "0 0 8px", display: "flex", alignItems: "center", gap: 6 }}>
              <AlertTriangle size={16} color="var(--danger)" />
              주변 농가 {alertFarms.length}곳에서 병해충 <HanjaTerm term="이병">이병</HanjaTerm> 신호가
              있어요.
            </p>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {alertFarms.slice(0, 2).map((f) => (
                <li key={f.id} style={{ marginBottom: 4 }}>
                  {f.name} <StatusBadge level={FARM_STATUS_LEVEL[f.status]}>{f.status}</StatusBadge> ·{" "}
                  {f.note}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="muted">주변 농가에 특이사항이 없어요.</p>
        )}
        <button className="link-more" onClick={() => onNavigate("farms")}>
          농가정보 전체 보기 <ChevronRight size={16} />
        </button>
      </Card>

      {riskIndex && (
        <Card accent="danger">
          <p style={{ margin: 0 }}>
            ⚠️ 현재 <strong>{riskIndex.label}</strong>가 {riskIndex.level} 단계예요. {riskIndex.detail}
          </p>
        </Card>
      )}
    </div>
  );
}