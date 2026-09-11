import Card from "../components/Card";
import ExternalLinkButton from "../components/ExternalLinkButton";
import { CROPS } from "../data/mockCrops";
import { REGIONS } from "../data/regions";
export default function Settings({ settings, onChange }) {
  function updatePersonal(field, value) {
    onChange({ ...settings, personal: { ...settings.personal, [field]: value } });
  }

  function updateFarm(field, value) {
    onChange({ ...settings, farm: { ...settings.farm, [field]: value } });
  }

  function toggleCrop(key) {
    const has = settings.crops.includes(key);
    const crops = has ? settings.crops.filter((c) => c !== key) : [...settings.crops, key];
    let primaryCrop = settings.primaryCrop;
    if (has && primaryCrop === key) primaryCrop = crops[0] ?? null;
    if (!has && !primaryCrop) primaryCrop = key;
    onChange({ ...settings, crops, primaryCrop });
  }

  return (
    <div className="page-section">
      <Card title="개인정보 설정">
        <p className="muted" style={{ marginTop: 0 }}>
          입력한 정보는 서버로 전송되지 않고 이 기기에만 저장돼요.
        </p>
        <div className="field">
          <label htmlFor="name">이름</label>
          <input
            id="name"
            type="text"
            value={settings.personal.name}
            onChange={(e) => updatePersonal("name", e.target.value)}
            placeholder="홍길동"
          />
        </div>
        <div className="field">
          <label htmlFor="contact">연락처</label>
          <input
            id="contact"
            type="tel"
            value={settings.personal.contact}
            onChange={(e) => updatePersonal("contact", e.target.value)}
            placeholder="010-0000-0000"
          />
        </div>
      </Card>

      <Card title="농가 설정">
        <div className="field">
          <label htmlFor="farmName">농가명</label>
          <input
            id="farmName"
            type="text"
            value={settings.farm.farmName}
            onChange={(e) => updateFarm("farmName", e.target.value)}
            placeholder="예) 동림 농장"
          />
        </div>
        <div className="field">
          <label htmlFor="location">농가 위치</label>
          <input
            id="location"
            type="text"
            value={settings.farm.location}
            onChange={(e) => updateFarm("location", e.target.value)}
            placeholder="예) 전남 광주광역시 OO구"
          />
        </div>
               <div className="field">
          <label htmlFor="region">지역 선택 (날씨 조회 기준)</label>
          <select
            id="region"
            value={settings.farm.region || ""}
            onChange={(e) => updateFarm("region", e.target.value)}
          >
            <option value="">지역을 선택하세요</option>
            {REGIONS.map((r) => (
              <option key={r.key} value={r.key}>
                {r.name}
              </option>
            ))}
          </select>
          <p className="muted" style={{ marginTop: 4, marginBottom: 0, fontSize: "var(--fs-small)" }}>
            선택한 지역 기준으로 날씨분석 탭의 날씨 정보를 보여드려요.
          </p>
        </div>
      </Card>

      <Card title="작물 선택">
        <p className="muted" style={{ marginTop: 0 }}>
          여러 작물을 재배 중이라면 모두 선택하고, 대표 작물을 하나 지정해주세요.
        </p>
        <div className="pill-group">
          {CROPS.map((c) => (
            <button
              key={c.key}
              className={`pill ${settings.crops.includes(c.key) ? "pill--active" : ""}`}
              onClick={() => toggleCrop(c.key)}
            >
              {c.icon} {c.name}
            </button>
          ))}
        </div>

        {settings.crops.length > 0 && (
          <div style={{ marginTop: 14 }}>
            <label className="muted" style={{ fontSize: "var(--fs-small)", fontWeight: 600 }}>
              대표 작물 (홈 화면 · 비료계산 기본값)
            </label>
            <div className="pill-group" style={{ marginTop: 6 }}>
              {settings.crops.map((key) => {
                const c = CROPS.find((x) => x.key === key);
                return (
                  <button
                    key={key}
                    className={`pill ${settings.primaryCrop === key ? "pill--active" : ""}`}
                    onClick={() => onChange({ ...settings, primaryCrop: key })}
                  >
                    {c?.icon} {c?.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </Card>

      <Card title="관련 사이트 바로가기">
        <ExternalLinkButton
          href="https://www.rda.go.kr"
          label="농촌진흥청"
          description="농업 정책 · 연구 정보"
        />
        <ExternalLinkButton
          href="https://www.nongsaro.go.kr"
          label="농사로"
          description="영농 기술 · 병해충 · 농가 정보"
        />
        <ExternalLinkButton
          href="https://soil.rda.go.kr"
          label="흙토람"
          description="토양검정 기반 시비 처방"
        />
      </Card>

           <Card title="데이터 연동 상태">
        <p style={{ marginTop: 0 }}>
          날씨 정보는 <strong>기상청 실시간 데이터</strong>로 연동되어 있어요.
        </p>
        <p className="muted" style={{ margin: 0 }}>
          비료 · 농가 정보는 아직 <strong>목업(예시) 데이터</strong>로 동작하고 있어요. 농사로
          공공데이터 API 키를 발급받으면 실제 데이터로 바꿀 수 있어요.
        </p>
      </Card>

    </div>
  );
}
