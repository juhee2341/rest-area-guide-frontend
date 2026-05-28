// 날씨 데이터 통합: Open-Meteo(무료, 키 불필요) → 기상청 초단기실황(DATA_GO_KR_API_KEY 필요)
// Open-Meteo: ECMWF 모델 기반, 전 세계 무료 제공 (https://open-meteo.com)
// 기상청: 한국 공식 기상 데이터 (DATA_GO_KR_API_KEY 설정 시 우선 사용)

const KMA_API_KEY = process.env.DATA_GO_KR_API_KEY;
const KMA_BASE_URL = "https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0";

export interface WeatherInfo {
  temp: number;
  sky: string;
  rainType: string;
  humidity: number;
  windSpeed: number;
  icon: string;
  summary: string;
  source: "기상청" | "Open-Meteo";
}

// ── Open-Meteo (WMO weather code → 한국어) ──────────────────────────────────

const WMO_CODE: Record<number, { sky: string; icon: string }> = {
  0:  { sky: "맑음",      icon: "☀️" },
  1:  { sky: "주로 맑음", icon: "🌤️" },
  2:  { sky: "구름 많음", icon: "⛅" },
  3:  { sky: "흐림",      icon: "☁️" },
  45: { sky: "안개",      icon: "🌫️" },
  48: { sky: "안개",      icon: "🌫️" },
  51: { sky: "이슬비",    icon: "🌦️" },
  53: { sky: "이슬비",    icon: "🌦️" },
  55: { sky: "이슬비",    icon: "🌧️" },
  61: { sky: "비",        icon: "🌧️" },
  63: { sky: "비",        icon: "🌧️" },
  65: { sky: "강한 비",   icon: "🌧️" },
  71: { sky: "눈",        icon: "❄️" },
  73: { sky: "눈",        icon: "❄️" },
  75: { sky: "강한 눈",   icon: "❄️" },
  80: { sky: "소나기",    icon: "🌦️" },
  81: { sky: "소나기",    icon: "🌧️" },
  82: { sky: "강한 소나기", icon: "🌧️" },
  95: { sky: "뇌우",      icon: "⛈️" },
  99: { sky: "우박 동반 뇌우", icon: "⛈️" },
};

async function fetchOpenMeteo(lat: number, lng: number): Promise<WeatherInfo | null> {
  try {
    const url = new URL("https://api.open-meteo.com/v1/forecast");
    url.searchParams.set("latitude", String(lat));
    url.searchParams.set("longitude", String(lng));
    url.searchParams.set("current", "temperature_2m,relativehumidity_2m,precipitation,weathercode,windspeed_10m");
    url.searchParams.set("timezone", "Asia/Seoul");

    const res = await fetch(url.toString(), { next: { revalidate: 1800 } });
    if (!res.ok) return null;

    const data = await res.json();
    const c = data.current;
    const code: number = c.weathercode ?? 0;
    const wmo = WMO_CODE[code] ?? { sky: "알 수 없음", icon: "🌡️" };

    const temp = Math.round(c.temperature_2m);
    const rainType = c.precipitation > 0 ? "비" : "없음";

    return {
      temp,
      sky: wmo.sky,
      rainType,
      humidity: c.relativehumidity_2m,
      windSpeed: Math.round(c.windspeed_10m * 10) / 10,
      icon: wmo.icon,
      summary: `${temp}°C · ${wmo.sky}`,
      source: "Open-Meteo",
    };
  } catch {
    return null;
  }
}

// ── 기상청 초단기실황 (위경도 → 격자 변환 포함) ────────────────────────────

function latLngToGrid(lat: number, lng: number): { nx: number; ny: number } {
  const RE = 6371.00877, GRID = 5.0, SLAT1 = 30.0, SLAT2 = 60.0;
  const OLON = 126.0, OLAT = 38.0, XO = 43, YO = 136;
  const DEGRAD = Math.PI / 180.0;
  const re = RE / GRID;
  const slat1 = SLAT1 * DEGRAD, slat2 = SLAT2 * DEGRAD;
  const olon = OLON * DEGRAD, olat = OLAT * DEGRAD;

  let sn = Math.tan(Math.PI * 0.25 + slat2 * 0.5) / Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
  let sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
  sf = (Math.pow(sf, sn) * Math.cos(slat1)) / sn;
  let ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
  ro = (re * sf) / Math.pow(ro, sn);

  const ra = Math.tan(Math.PI * 0.25 + lat * DEGRAD * 0.5);
  const r = (re * sf) / Math.pow(ra, sn);
  let theta = lng * DEGRAD - olon;
  if (theta > Math.PI) theta -= 2.0 * Math.PI;
  if (theta < -Math.PI) theta += 2.0 * Math.PI;
  theta *= sn;

  return {
    nx: Math.floor(r * Math.sin(theta) + XO + 0.5),
    ny: Math.floor(ro - r * Math.cos(theta) + YO + 0.5),
  };
}

function getKmaBaseTime(): { baseDate: string; baseTime: string } {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  let h = now.getHours();
  const m = now.getMinutes();
  if (m < 40) h = h === 0 ? 23 : h - 1;
  return {
    baseDate: `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`,
    baseTime: `${pad(h)}30`,
  };
}

const KMA_SKY: Record<string, string> = { "1": "맑음", "3": "구름 많음", "4": "흐림" };
const KMA_RAIN: Record<string, string> = {
  "0": "없음", "1": "비", "2": "비/눈", "3": "눈", "4": "소나기",
};

async function fetchKma(lat: number, lng: number): Promise<WeatherInfo | null> {
  if (!KMA_API_KEY) return null;
  try {
    const { nx, ny } = latLngToGrid(lat, lng);
    const { baseDate, baseTime } = getKmaBaseTime();

    const url = new URL(`${KMA_BASE_URL}/getUltraSrtNcst`);
    url.searchParams.set("serviceKey", KMA_API_KEY);
    url.searchParams.set("numOfRows", "10");
    url.searchParams.set("pageNo", "1");
    url.searchParams.set("dataType", "JSON");
    url.searchParams.set("base_date", baseDate);
    url.searchParams.set("base_time", baseTime);
    url.searchParams.set("nx", String(nx));
    url.searchParams.set("ny", String(ny));

    const res = await fetch(url.toString(), { next: { revalidate: 1800 } });
    if (!res.ok) return null;

    const data = await res.json();
    const items: Array<{ category: string; obsrValue: string }> =
      data.response?.body?.items?.item ?? [];
    if (!items.length) return null;

    const get = (cat: string) => items.find((i) => i.category === cat)?.obsrValue ?? "0";
    const temp = parseFloat(get("T1H"));
    const sky = KMA_SKY[get("SKY")] ?? "알 수 없음";
    const rainType = KMA_RAIN[get("PTY")] ?? "없음";
    const humidity = parseInt(get("REH"));
    const windSpeed = parseFloat(get("WSD"));

    const raining = rainType !== "없음";
    const icon = raining ? (rainType.includes("눈") ? "❄️" : "🌧️") :
      sky === "맑음" ? "☀️" : sky === "구름 많음" ? "⛅" : "☁️";

    return {
      temp, sky, rainType, humidity, windSpeed, icon,
      summary: `${temp}°C · ${sky}`,
      source: "기상청",
    };
  } catch {
    return null;
  }
}

// ── 공개 인터페이스: 기상청 우선, Open-Meteo 폴백 ───────────────────────────

export async function fetchWeather(lat: number, lng: number): Promise<WeatherInfo | null> {
  const kma = await fetchKma(lat, lng);
  if (kma) return kma;
  return fetchOpenMeteo(lat, lng);
}
