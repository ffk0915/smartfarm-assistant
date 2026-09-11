import { useEffect, useState } from "react";
import Card from "../components/Card";
import HanjaTerm from "../components/HanjaTerm";
import { fetchVilageForecast } from "../kmaWeather";
import { getRegionByKey } from "../data/regions";
 import { mockWeeklyForecast,
  mockAgriIndex,
  mockAgriSchedule,
} from "../data/mockWeather";
import { cropName } from "../data/mockCrops";

const SKY_TEXT = { "1": "맑음", "3": "구름많음", "4": "흐림" };

function buildHourly(items) {
  const grouped = {};
  items.forEach((item) => {
    if (!grouped[item.fcstTime]) grouped[item.fcstTime] = {};
    grouped[item.fcstTime][item.category] = item.fcstValue;
  });

  return Object.entries(grouped)
    .map(([time, v]) => ({
      time: `${time.slice(0, 2)}:${time.slice(2)}`,
      temp: v.TMP,
      sky: SKY_TEXT[v.SKY] || "-",
      precipitationProb: v.POP,
    }))
    .filter((h) => h.temp !== undefined)
    .slice(0, 8);
}

const LEVEL_COLOR = {
  높음: "var(--danger)",
  보통: "var(--grain)",
  낮음: "var(--primary)",
};

export default function WeatherAnalysis({ settings }) {
  const [hourly, setHourly] = useState(null);
  const [baseTime, setBaseTime] = useState("");
  const [error, setError] = useState(null);

    const region = getRegionByKey(settings.farm?.region);

  useEffect(() => {
    fetchVilageForecast(region.lat, region.lon)
      .then((items) => {
        setHourly(buildHourly(items));
        setBaseTime(items[0]?.baseTime || "");
      })
      .catch((e) => setError(e.message));
  }, [region.lat, region.lon]);

  const mySchedule = mockAgriSchedule.filter((s) =>
    s.cropKeys.some((k) => settings.crops.includes(k))
  );

  return (
    <div className="page-section">
      <Card accent="sky" title="시간대별 예보">
               <p className="muted" style={{ marginTop: 0 }}>
          {region.name} · {baseTime ? `${baseTime.slice(0, 2)}:${baseTime.slice(2)} 기준` : "불러오는 중..."}
        </p>
        {error && <p className="muted">날씨 정보를 불러오지 못했어요: {error}</p>}
        <div className="hourly-strip">
          {(hourly || []).map((h) => (
            <div key={h.time} className="hourly-strip__item">
              <span className="muted">{h.time}</span>
              <strong>{h.temp}°</strong>
              <span className="hourly-strip__sky">{h.sky}</span>
              <span className="hourly-strip__precip">💧{h.precipitationProb}%</span>
            </div>
          ))}
        </div>
      </Card>

      <Card accent="sky" title="주간 예보">
        <table className="weekly-table">
          <tbody>
            {mockWeeklyForecast.map((d) => (
              <tr key={d.date}>
                <td>{d.day}</td>
                <td className="muted">{d.date}</td>
                <td>{d.sky}</td>
                <td>{d.tempMax}° / {d.tempMin}°</td>
                <td className="muted">💧{d.precipitationProb}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card title="농업기상 지수">
        <div className="agri-index-list">
          {mockAgriIndex.map((a) => (
            <div key={a.key} className="agri-index-item">
              <div className="row" style={{ marginBottom: 2 }}>
                <span style={{ fontWeight: 700 }}>{a.label}</span>
                <span style={{ color: LEVEL_COLOR[a.level], fontWeight: 700 }}>{a.level}</span>
              </div>
              <p className="muted" style={{ margin: 0 }}>{a.detail}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card accent="primary" title="기상에 따른 농업 일정">
        {mySchedule.length > 0 ? (
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {mySchedule.map((s) => (
              <li key={s.id} style={{ marginBottom: 10 }}>
                <p style={{ margin: "0 0 2px", fontWeight: 700 }}>
                  [{s.period}] {s.title}
                </p>
                <p className="muted" style={{ margin: 0 }}>{s.description}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted">설정에서 작물을 선택하면 맞춤 농업 일정을 보여드려요.</p>
        )}
        <p className="muted" style={{ marginTop: 10 }}>
          내 작물: {settings.crops.map(cropName).join(", ") || "미설정"} · <HanjaTerm term="예찰">예찰</HanjaTerm>은
          꾸준히 해주는 것이 <HanjaTerm term="방제">방제</HanjaTerm> 비용을 줄이는 지름길이에요.
        </p>
      </Card>
    </div>
  );
}
