import { CloudSun, FlaskConical, Users, ChevronRight, AlertTriangle } from "lucide-react";
import Card from "../components/Card";
import HanjaTerm from "../components/HanjaTerm";
import StatusBadge from "../components/StatusBadge";
import { mockToday, mockAgriIndex } from "../data/mockWeather";
import { FERTILIZER_STANDARD } from "../data/mockFertilizer";
import { NEARBY_FARMS, FARM_STATUS_LEVEL } from "../data/mockFarms";
import { cropName } from "../data/mockCrops";

export default function Home({ settings, onNavigate }) {
  const crop = settings.primaryCrop;
  const std = FERTILIZER_STANDARD[crop];
  const riskIndex = mockAgriIndex.find((a) => a.level === "높음");
  const alertFarms = NEARBY_FARMS.filter((f) => FARM_STATUS_LEVEL[f.status] !== "ok");

  return (
    <div className="page-section">
      <Card accent="sky" title={`오늘의 날씨 · ${mockToday.location}`}>
        <div className="row" style={{ alignItems: "flex-start" }}>
          <div>
            <p style={{ fontSize: "2rem", fontWeight: 800, margin: "0 0 2px" }}>
              {mockToday.temperature}°
            </p>
            <p className="muted" style={{ margin: 0 }}>
              {mockToday.condition} · 최고 {mockToday.tempMax}° / 최저 {mockToday.tempMin}°
            </p>
          </div>
          <CloudSun size={36} color="var(--sky)" />
        </div>
        <p style={{ marginTop: 10, marginBottom: 0 }}>{mockToday.advisory}</p>
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
