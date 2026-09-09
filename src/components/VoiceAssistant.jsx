import { useEffect, useState } from "react";
import { Mic, MicOff, X, Volume2, Send } from "lucide-react";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import { getAssistantReply, speak } from "../utils/voiceAssistant";
import "./VoiceAssistant.css";

// 앱 전체(모든 탭)에서 접근 가능한 음성 질의 기능.
// 요청사항의 "전체기능 - 음성인식기능+음성AI"를 화면 전역 FAB로 구현했습니다.
export default function VoiceAssistant({ crop }) {
  const [open, setOpen] = useState(false);
  const [reply, setReply] = useState(null);
  const [typedQuery, setTypedQuery] = useState("");
  const { supported, listening, transcript, error, start, stop } = useSpeechRecognition();

  useEffect(() => {
    if (!listening && transcript) {
      const answer = getAssistantReply(transcript, { crop });
      setReply(answer);
      speak(answer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listening]);

  function handleOpen() {
    setOpen(true);
    setReply(null);
  }

  function handleClose() {
    stop();
    setOpen(false);
  }

  function handleTypedSubmit(e) {
    e.preventDefault();
    if (!typedQuery.trim()) return;
    const answer = getAssistantReply(typedQuery, { crop });
    setReply(answer);
    speak(answer);
  }

  return (
    <>
      <button className="voice-fab" onClick={handleOpen} aria-label="음성으로 물어보기">
        <Mic size={24} />
      </button>

      {open && (
        <div className="voice-sheet-backdrop" onClick={handleClose}>
          <div className="voice-sheet" onClick={(e) => e.stopPropagation()}>
            <header className="voice-sheet__header">
              <h2>음성으로 물어보기</h2>
              <button className="voice-sheet__close" onClick={handleClose} aria-label="닫기">
                <X size={20} />
              </button>
            </header>

            {supported ? (
              <div className="voice-sheet__mic-area">
                <button
                  className={`voice-mic-btn ${listening ? "voice-mic-btn--listening" : ""}`}
                  onClick={listening ? stop : start}
                >
                  {listening ? <MicOff size={28} /> : <Mic size={28} />}
                </button>
                <p className="voice-sheet__hint">
                  {listening ? "듣고 있어요… 다시 누르면 멈춰요" : "눌러서 말해보세요"}
                </p>
                {transcript && <p className="voice-sheet__transcript">“{transcript}”</p>}
                {error && <p className="voice-sheet__error">음성 인식 오류: {error}</p>}
              </div>
            ) : (
              <p className="voice-sheet__unsupported">
                이 브라우저는 음성 인식을 지원하지 않아요. 아래에 글자로 입력해보세요.
              </p>
            )}

            <form className="voice-sheet__type-form" onSubmit={handleTypedSubmit}>
              <input
                type="text"
                value={typedQuery}
                onChange={(e) => setTypedQuery(e.target.value)}
                placeholder="예) 오늘 날씨 어때? / 고추 병해충 알려줘"
              />
              <button type="submit" aria-label="질문 보내기">
                <Send size={18} />
              </button>
            </form>

            {reply && (
              <div className="voice-sheet__reply">
                <Volume2 size={18} />
                <p>{reply}</p>
              </div>
            )}

            <p className="voice-sheet__disclaimer">
              지금은 목업 데이터로 답하는 데모예요. 실제 서비스에서는 AI가 실시간으로 답변해요.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
