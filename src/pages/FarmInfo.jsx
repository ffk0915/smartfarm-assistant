import { MapPin } from "lucide-react";
import Card from "../components/Card";
import HanjaTerm from "../components/HanjaTerm";
import StatusBadge from "../components/StatusBadge";
import { NEARBY_FARMS, FARM_STATUS_LEVEL } from "../data/mockFarms";
import { PEST_INFO } from "../data/mockPests";
import { cropName } from "../data/mockCrops";

export default function FarmInfo({ settings }) {
  const myPests = PEST_INFO.filter((p) => p.cropKeys.some((k) => settings.crops.includes(k)));
  const otherPests = PEST_INFO.filter((p) => !myPests.includes(p));

  return (
    <div className="page-section">
      <Card title="주변 농가 현황">
        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {NEARBY_FARMS.map((f) => (
            <li key={f.id} className="farm-item">
              <div className="row">
                <span style={{ fontWeight: 700 }}>{f.name}</span>
                <StatusBadge level={FARM_STATUS_LEVEL[f.status]}>{f.status}</StatusBadge>
              </div>
              <p className="muted" style={{ margin: "2px 0 0", display: "flex", gap: 10 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <MapPin size={12} /> {f.distanceKm}km
                </span>
                <span>{cropName(f.crop)}</span>
              </p>
              <p style={{ margin: "4px 0 0" }}>{f.note}</p>
            </li>
          ))}
        </ul>
      </Card>

      <Card accent="danger" title="내 작물 병해충 예방 · 대책">
        {myPests.length > 0 ? (
          myPests.map((p) => <PestAccordion key={p.id} pest={p} />)
        ) : (
          <p className="muted">설정에서 작물을 선택하면 맞춤 병해충 정보를 보여드려요.</p>
        )}
      </Card>

      <Card title="그 밖의 병해충 정보">
        {otherPests.map((p) => (
          <PestAccordion key={p.id} pest={p} />
        ))}
      </Card>
    </div>
  );
}

function PestAccordion({ pest }) {
  return (
    <details className="pest-accordion">
      <summary>
        {pest.name}{" "}
        <span className="muted">
          ({pest.cropKeys.map(cropName).join(", ")})
        </span>
      </summary>
      <div className="pest-accordion__body">
        <p>
          <strong>증상</strong> · {pest.symptom}
        </p>
        <p>
          <strong><HanjaTerm term="방제">예방</HanjaTerm></strong>
        </p>
        <ul style={{ margin: "0 0 8px", paddingLeft: 18 }}>
          {pest.prevention.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <p style={{ margin: 0 }}>
          <strong>대책</strong> · {pest.action}
        </p>
        <p className="muted" style={{ margin: "6px 0 0" }}>주의 시기: {pest.riskWhen}</p>
      </div>
    </details>
  );
}
