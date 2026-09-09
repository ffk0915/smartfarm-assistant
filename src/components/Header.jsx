import "./Header.css";

export default function Header({ title, subtitle, right }) {
  return (
    <header className="app-header">
      <div>
        <h1 className="app-header__title">{title}</h1>
        {subtitle && <p className="app-header__subtitle">{subtitle}</p>}
      </div>
      {right && <div className="app-header__right">{right}</div>}
    </header>
  );
}
