import { useEffect, useState } from "react";

// 로그인 없이 기기에만 데이터를 저장하기 위한 훅.
// (요청사항: "로그인 없이 기기에만 저장")
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // 저장 공간이 없거나 접근이 막힌 경우 조용히 무시합니다.
    }
  }, [key, value]);

  return [value, setValue];
}
