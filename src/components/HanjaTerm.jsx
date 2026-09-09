import { useState } from "react";
import { GLOSSARY } from "../data/glossary";
import "./HanjaTerm.css";

// 문장 속 농업 한자어를 감싸면 탭했을 때 한자/훈음/뜻풀이를 보여줍니다.
// 초보 농업인이 낯선 용어를 바로바로 확인할 수 있게 하기 위한 컴포넌트예요.
export default function HanjaTerm({ term, children }) {
  const [open, setOpen] = useState(false);
  const entry = GLOSSARY[term];
  const label = children ?? term;

  if (!entry) return <>{label}</>;

  return (
    <span className="hanja-term-wrap">
      <button
        type="button"
        className="hanja-term"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {label}
      </button>
      {open && (
        <span className="hanja-term__note" role="note">
          {entry.hanja !== "-" && <strong className="hanja-term__hanja">{entry.hanja}</strong>}
          <span className="hanja-term__reading">{entry.reading}</span>
          <span className="hanja-term__meaning">{entry.meaning}</span>
        </span>
      )}
    </span>
  );
}
