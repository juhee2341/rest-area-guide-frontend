export interface RestArea {
  id: string;        // unitCode
  stdRestCd: string; // 편의시설 API 조회용 코드
  name: string;
  routeNo: string;
  routeName: string;
  direction: string;
  lat: number;
  lng: number;
  operTime: string;
}

export interface RestAreaDetail extends RestArea {
  facilities: Facilities;
}

export interface Facilities {
  gasStation: boolean;
  evCharger: boolean;
  shower: boolean;
  atm: boolean;
  cafe: boolean;
  convenienceStore: boolean;
  toilet: boolean;
  parking: boolean;
}

export interface RecentVisit {
  id: string;
  name: string;
  visitedAt: string;
}
