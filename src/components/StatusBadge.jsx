import "./StatusBadge.css";

const LEVEL_CLASS = {
  ok: "status-badge--ok",
  warn: "status-badge--warn",
  danger: "status-badge--danger",
};

export default function StatusBadge({ level, children }) {
  return <span className={`status-badge ${LEVEL_CLASS[level] ?? ""}`}>{children}</span>;
}
