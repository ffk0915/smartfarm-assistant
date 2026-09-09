import { Home, CloudSun, FlaskConical, Users, Settings } from "lucide-react";
import "./TabBar.css";

const TABS = [
  { key: "home", label: "홈", Icon: Home },
  { key: "weather", label: "날씨분석", Icon: CloudSun },
  { key: "fertilizer", label: "비료계산", Icon: FlaskConical },
  { key: "farms", label: "농가정보", Icon: Users },
  { key: "settings", label: "설정", Icon: Settings },
];

export default function TabBar({ active, onChange }) {
  return (
    <nav className="tabbar" role="tablist" aria-label="주요 화면 전환">
      {TABS.map(({ key, label, Icon }) => {
        const isActive = key === active;
        return (
          <button
            key={key}
            role="tab"
            aria-selected={isActive}
            className={`tabbar__item ${isActive ? "tabbar__item--active" : ""}`}
            onClick={() => onChange(key)}
          >
            <Icon size={22} strokeWidth={isActive ? 2.4 : 1.8} />
            <span>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
