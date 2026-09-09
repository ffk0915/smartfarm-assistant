import { useCallback, useEffect, useRef, useState } from "react";

// 브라우저 내장 Web Speech API를 사용합니다 (별도 서버/키 필요 없음).
// ⚠️ iOS Safari는 아직 SpeechRecognition을 지원하지 않는 경우가 많아요.
//    지원하지 않는 브라우저에서는 supported=false로 안내 문구를 보여주세요.
export function useSpeechRecognition({ lang = "ko-KR" } = {}) {
  const RecognitionCtor =
    typeof window !== "undefined" ? window.SpeechRecognition || window.webkitSpeechRecognition : null;
  const supported = Boolean(RecognitionCtor);

  const recognitionRef = useRef(null);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!supported) return undefined;

    const recognition = new RecognitionCtor();
    recognition.lang = lang;
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      let text = "";
      for (let i = 0; i < event.results.length; i += 1) {
        text += event.results[i][0].transcript;
      }
      setTranscript(text);
    };

    recognition.onerror = (event) => {
      setError(event.error || "unknown-error");
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      recognition.abort();
    };
  }, [RecognitionCtor, supported, lang]);

  const start = useCallback(() => {
    if (!recognitionRef.current) return;
    setError(null);
    setTranscript("");
    try {
      recognitionRef.current.start();
      setListening(true);
    } catch {
      // 이미 시작된 상태에서 재호출하면 예외가 발생할 수 있어 무시합니다.
    }
  }, []);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  return { supported, listening, transcript, error, start, stop };
}
