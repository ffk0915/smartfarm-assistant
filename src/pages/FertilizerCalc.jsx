import { useState } from "react";
import Card from "../components/Card";
import HanjaTerm from "../components/HanjaTerm";
import ExternalLinkButton from "../components/ExternalLinkButton";
import { CROPS, cropName } from "../data/mockCrops";
import { FERTILIZER_STANDARD, SOIL_LEVEL_ADJUST, PYEONG_TO_M2 } from "../data/mockFertilizer";

export default function FertilizerCalc({ settings }) {
  const [crop, setCrop] = useState(settings.primaryCrop || CROPS[0].key);
  const [unit, setUnit] = useState("pyeong"); // pyeong | m2
  const [area, setArea] = useState("300");
  const [soilLevel, setSoilLevel] = useState("mid");
  const [result, setResult] = useState(null);

  function handleCalculate(e) {
    e.preventDefault();
    const areaNum = Number(area);
    if (!areaNum || areaNum <= 0) return;

    const areaM2 = unit === "pyeong" ? areaNum * PYEONG_TO_M2 : areaNum;
    const std = FERTILIZER_STANDARD[crop];
    const adjust = SOIL_LEVEL_ADJUST[soilLevel];
    const factor = areaM2 / 1000; // 표준시비량은 10a(1,000㎡) 기준

    const n = std.n * factor * adjust.n;
    const p = std.p * factor * adjust.p;
    const k = std.k * factor * adjust.k;

    setResult({
      areaM2,
      n: n.toFixed(2),
      p: p.toFixed(2),
      k: k.toFixed(2),
      base: { n: (n * 0.6).toFixed(2), p: (p * 0.6).toFixed(2), k: (k * 0.6).toFixed(2) },
      top: { n: (n * 0.4).toFixed(2), p: (p * 0.4).toFixed(2), k: (k * 0.4).toFixed(2) },
      note: std.note,
    });
  }

  return (
    <div className="page-section">
      <Card accent="grain">
        <p style={{ margin: 0 }}>
          ⚠️ 아래 계산값은 <strong>데모용 참고 수치</strong>예요. 실제{" "}
          <HanjaTerm term="시비">시비</HanjaTerm>량은 흙토람의 토양검정 결과를 꼭 함께 확인하세요.
        </p>
      </Card>

      <Card title="작물 선택">
        <div className="pill-group">
          {CROPS.map((c) => (
            <button
              key={c.key}
              className={`pill ${crop === c.key ? "pill--active" : ""}`}
              onClick={() => setCrop(c.key)}
            >
              {c.icon} {c.name}
            </button>
          ))}
        </div>
      </Card>

      <Card title="재배 면적 · 토양 상태">
        <form onSubmit={handleCalculate}>
          <div className="field">
            <label htmlFor="area">재배 면적</label>
            <div className="row" style={{ gap: 8 }}>
              <input
                id="area"
                type="number"
                min="1"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                style={{ flex: 1 }}
              />
              <div className="pill-group">
                <button
                  type="button"
                  className={`pill ${unit === "pyeong" ? "pill--active" : ""}`}
                  onClick={() => setUnit("pyeong")}
                >
                  평
                </button>
                <button
                  type="button"
                  className={`pill ${unit === "m2" ? "pill--active" : ""}`}
                  onClick={() => setUnit("m2")}
                >
                  ㎡
                </button>
              </div>
            </div>
          </div>

          <div className="field">
            <label>
              토양 <HanjaTerm term="유기물">유기물</HanjaTerm> 함량
            </label>
            <div className="pill-group">
              {Object.entries(SOIL_LEVEL_ADJUST).map(([key, v]) => (
                <button
                  type="button"
                  key={key}
                  className={`pill ${soilLevel === key ? "pill--active" : ""}`}
                  onClick={() => setSoilLevel(key)}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          <button className="btn-primary" type="submit">
            시비량 계산하기
          </button>
        </form>
      </Card>

      {result && (
        <Card accent="grain" title={`${cropName(crop)} 예상 시비량`}>
          <table className="weekly-table">
            <thead>
              <tr>
                <th></th>
                <th><HanjaTerm term="질소">질소(N)</HanjaTerm></th>
                <th><HanjaTerm term="인산">인산(P)</HanjaTerm></th>
                <th><HanjaTerm term="칼리">칼리(K)</HanjaTerm></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight: 700 }}>합계</td>
                <td>{result.n}kg</td>
                <td>{result.p}kg</td>
                <td>{result.k}kg</td>
              </tr>
              <tr>
                <td className="muted"><HanjaTerm term="밑거름">밑거름</HanjaTerm> 60%</td>
                <td>{result.base.n}kg</td>
                <td>{result.base.p}kg</td>
                <td>{result.base.k}kg</td>
              </tr>
              <tr>
                <td className="muted"><HanjaTerm term="웃거름">웃거름</HanjaTerm> 40%</td>
                <td>{result.top.n}kg</td>
                <td>{result.top.p}kg</td>
                <td>{result.top.k}kg</td>
              </tr>
            </tbody>
          </table>
          <p className="muted" style={{ marginTop: 10 }}>{result.note}</p>
        </Card>
      )}

      <Card title="더 정확한 처방이 필요하다면">
        <ExternalLinkButton
          href="https://soil.rda.go.kr"
          label="흙토람에서 토양검정 처방 확인"
          description="내 밭의 실제 토양 검정 결과 기반 정밀 시비 처방"
        />
      </Card>
    </div>
  );
}
