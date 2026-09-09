import "./Card.css";

// accent: "primary" | "sky" | "soil" | "grain" | "danger" | undefined
export default function Card({ accent, title, action, children, className = "" }) {
  return (
    <section className={`card ${accent ? `card--${accent}` : ""} ${className}`}>
      {(title || action) && (
        <header className="card__header">
          {title && <h3 className="card__title">{title}</h3>}
          {action}
        </header>
      )}
      <div className="card__body">{children}</div>
    </section>
  );
}
