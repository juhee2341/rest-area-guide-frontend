import type { RestArea, RestAreaDetail } from "@/types/rest-area";
import type { Congestion } from "@/types/congestion";
import type { Menu } from "@/types/menu";

export interface FuelPrice {
  gasoline: number | null;
  diesel: number | null;
  lpg: number | null;
  oilCompany: string | null;
}

const BASE_URL = "https://data.ex.co.kr/openapi";
const API_KEY = process.env.EXPRESSWAY_API_KEY;

function buildUrl(path: string, params: Record<string, string> = {}) {
  const url = new URL(`${BASE_URL}${path}`);
  url.searchParams.set("key", API_KEY!);
  url.searchParams.set("type", "json");
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }
  return url.toString();
}

// psName 리스트에서 키워드로 시설 유무 판별
function hasKeyword(list: Array<{ psName: string }>, ...keywords: string[]) {
  return list.some((item) => keywords.some((kw) => item.psName?.includes(kw)));
}

// ✅ 명세 확인: /locationinfo/locationinfoRest
// 응답: unitCode, stdRestCd, unitName, routeNo, routeName, xValue(경도), yValue(위도)
export async function fetchRestAreas(): Promise<RestArea[]> {
  const res = await fetch(
    buildUrl("/locationinfo/locationinfoRest", { numOfRows: "9999", pageNo: "1" }),
    { next: { revalidate: 86400 } }
  );
  if (!res.ok) throw new Error("휴게소 목록 조회 실패");
  const data = await res.json();
  const list = data.list ?? [];
  return list.map((item: Record<string, string>) => ({
    id: item.unitCode,
    stdRestCd: item.stdRestCd,
    name: item.unitName,
    routeNo: item.routeNo,
    routeName: item.routeName,
    direction: item.direction ?? "",
    lat: parseFloat(item.yValue),
    lng: parseFloat(item.xValue),
    operTime: item.operTime ?? "",
  }));
}

// ✅ 명세 확인: /restinfo/restConvList
// 응답: psCode, psName, psDesc, stdRestCd, stdRestNm, routeCd, routeNm, svarAddr
// 주의: restConvList 에는 주유소 정보가 포함되지 않음 — 주유소 유무는 fetchFuel 결과로 판단
export async function fetchRestAreaDetail(id: string, stdRestCd: string): Promise<RestAreaDetail> {
  // 전체 목록 재사용 (캐시됨) + 편의시설 + 주유소 병렬 조회
  const [allRes, facilityRes, fuelData] = await Promise.all([
    fetch(
      buildUrl("/locationinfo/locationinfoRest", { numOfRows: "9999", pageNo: "1" }),
      { next: { revalidate: 86400 } }
    ),
    fetch(
      buildUrl("/restinfo/restConvList", { stdRestCd, numOfRows: "100", pageNo: "1" }),
      { next: { revalidate: 86400 } }
    ),
    fetchFuel(stdRestCd).catch(() => null),
  ]);

  if (!allRes.ok) throw new Error(`휴게소 목록 조회 실패 (status=${allRes.status})`);

  const allData = await allRes.json();
  const info = allData.list?.find((item: Record<string, string>) => item.unitCode === id);
  if (!info) throw new Error(`휴게소를 찾을 수 없습니다 (id=${id})`);

  let facList: Array<{ psName: string; stime?: string; etime?: string }> = [];
  if (facilityRes.ok) {
    const facilityData = await facilityRes.json();
    facList = facilityData.list ?? [];
  }

  // stime/etime이 있는 첫 항목에서 운영시간 추출
  const timeSample = facList.find((f) => f.stime && f.etime);
  const operTime = timeSample ? `${timeSample.stime} ~ ${timeSample.etime}` : "";

  return {
    id,
    stdRestCd,
    name: info.unitName,
    routeNo: info.routeNo,
    routeName: info.routeName,
    direction: info.direction ?? "",
    lat: parseFloat(info.yValue),
    lng: parseFloat(info.xValue),
    operTime,
    facilities: {
      gasStation:       !!(fuelData?.gasoline || fuelData?.diesel || fuelData?.lpg),
      evCharger:        hasKeyword(facList, "전기차", "급속충전", "완속충전", "전기충전"),
      shower:           hasKeyword(facList, "샤워"),
      atm:              hasKeyword(facList, "ATM", "현금자동"),
      cafe:             hasKeyword(facList, "카페", "커피", "베이커리"),
      convenienceStore: hasKeyword(facList, "편의점", "매점"),
    },
  };
}

// ✅ 명세 확인: /odtraffic/trafficAmountByUnit
// 요청 시 unitCode 필터 없음 — 전체 영업소 데이터 수신 후 unitCode로 필터링
// trafficAmout(오타) 필드 합산으로 혼잡도 추정
function getCurrentHour(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}`;
}

function toCongestionLevel(total: number): Congestion {
  const level: 1 | 2 | 3 = total < 300 ? 1 : total < 800 ? 2 : 3;
  const labelMap = { 1: "여유", 2: "보통", 3: "혼잡" } as const;
  return { level, label: labelMap[level], updatedAt: getCurrentHour() };
}

export async function fetchAllCongestion(): Promise<Record<string, Congestion>> {
  const stdHour = getCurrentHour();
  const res = await fetch(
    buildUrl("/odtraffic/trafficAmountByUnit", {
      sumTmUnitTypeCode: "3",
      stdHour,
      numOfRows: "9999",
      pageNo: "1",
    }),
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error("교통량 조회 실패");
  const data = await res.json();
  const list: Array<{ unitCode: string; trafficAmout: string; stdDate: string }> = data.list ?? [];

  const totals: Record<string, { sum: number; stdDate: string }> = {};
  for (const item of list) {
    const code = item.unitCode;
    if (!totals[code]) totals[code] = { sum: 0, stdDate: item.stdDate };
    totals[code].sum += parseInt(item.trafficAmout ?? "0");
  }

  const result: Record<string, Congestion> = {};
  for (const [code, { sum, stdDate }] of Object.entries(totals)) {
    const c = toCongestionLevel(sum);
    result[code] = { ...c, updatedAt: stdDate ?? stdHour };
  }
  return result;
}

export async function fetchCongestion(unitCode: string): Promise<Congestion> {
  const all = await fetchAllCongestion();
  return all[unitCode] ?? toCongestionLevel(0);
}

// ✅ 명세 확인: /business/curStateStation (uses serviceAreaCode2 = stdRestCd)
// 응답: gasolinePrice, diselPrice(오타), lpgPrice, oilCompany
export async function fetchFuel(stdRestCd: string): Promise<FuelPrice> {
  const res = await fetch(
    buildUrl("/business/curStateStation", { serviceAreaCode2: stdRestCd, numOfRows: "10", pageNo: "1" }),
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) throw new Error("주유 단가 조회 실패");
  const data = await res.json();
  const item = data.list?.[0] ?? null;
  return {
    gasoline: item?.gasolinePrice ? parseInt(item.gasolinePrice) : null,
    diesel: item?.diselPrice ? parseInt(item.diselPrice) : null,
    lpg: item?.lpgPrice ? parseInt(item.lpgPrice) : null,
    oilCompany: item?.oilCompany ?? null,
  };
}

// ✅ 명세 확인: /restinfo/restBestfoodList (uses stdRestCd)
export async function fetchMenus(stdRestCd: string): Promise<Menu[]> {
  const res = await fetch(
    buildUrl("/restinfo/restBestfoodList", { stdRestCd, numOfRows: "100", pageNo: "1" }),
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) throw new Error("메뉴 조회 실패");
  const data = await res.json();
  const list = data.list ?? [];
  return list.map((item: Record<string, string>) => ({
    id: item.seq,
    name: item.foodNm,
    price: parseInt(item.foodCost ?? "0"),
    isBest: item.bestfoodyn === "Y",
    isRecommended: item.recommendyn === "Y",
    isPremium: item.premiumyn === "Y",
    isSeason: item.seasonMenu === "Y",
  }));
}
