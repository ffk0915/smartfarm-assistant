import TestWeather from "./TestWeather";
import { useState } from "react";
import Header from "./components/Header";
import TabBar from "./components/TabBar";
import VoiceAssistant from "./components/VoiceAssistant";
import Home from "./pages/Home";
import WeatherAnalysis from "./pages/WeatherAnalysis";
import FertilizerCalc from "./pages/FertilizerCalc";
import FarmInfo from "./pages/FarmInfo";
import Settings from "./pages/Settings";
import { useLocalStorage } from "./hooks/useLocalStorage";
import "./App.css";

const DEFAULT_SETTINGS = {
  personal: { name: "", contact: "" },
  farm: { farmName: "", location: "", areaPyeong: "", region: "" },
  crops: ["pepper"],
  primaryCrop: "pepper",
};

const PAGE_META = {
  home: { title: "농업AI비서", subtitle: "오늘의 농장 브리핑" },
  weather: { title: "날씨분석", subtitle: "기상청 데이터 기반 농업기상" },
  fertilizer: { title: "비료계산", subtitle: "작물별 시비량 계산" },
  farms: { title: "농가정보", subtitle: "주변 농가 현황 · 병해충 대책" },
  settings: { title: "설정", subtitle: "농가 · 작물 · 연동 사이트" },
};

export default function App() {
  const [tab, setTab] = useState("home");
  const [settings, setSettings] = useLocalStorage("smartfarm.settings", DEFAULT_SETTINGS);
  const meta = PAGE_META[tab];

  return (
    <div className="app-shell">
      <Header title={meta.title} subtitle={meta.subtitle} />
<TestWeather />

      <main className="app-main">
        {tab === "home" && <Home settings={settings} onNavigate={setTab} />}
        {tab === "weather" && <WeatherAnalysis settings={settings} />}
        {tab === "fertilizer" && <FertilizerCalc settings={settings} />}
        {tab === "farms" && <FarmInfo settings={settings} />}
        {tab === "settings" && <Settings settings={settings} onChange={setSettings} />}
      </main>

      <VoiceAssistant crop={settings.primaryCrop} />
      <TabBar active={tab} onChange={setTab} />
    </div>
  );
}
