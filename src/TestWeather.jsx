import { useEffect, useState } from "react";
import { fetchVilageForecast } from "./kmaWeather";

function TestWeather() {
  const [temp, setTemp] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchVilageForecast(37.5665, 126.9780)
      .then((items) => {
        const tmp = items.find((i) => i.category === "TMP");
        setTemp(tmp?.fcstValue);
      })
      .catch((e) => setError(e.message));
  }, []);

  if (error) return <div>날씨 정보를 불러오지 못했어요: {error}</div>;
  if (temp === null) return <div>불러오는 중...</div>;

  return <div>현재 기온: {temp}℃</div>;
}

export default TestWeather;