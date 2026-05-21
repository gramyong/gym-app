# PRD: 운동 기록 웹앱

## Problem Statement

매일 운동을 하지만 기록이 없어 얼마나 꾸준히 했는지, 총 얼마나 운동했는지 파악이 어렵다. 별도 앱 설치 없이 모바일에서 빠르게 운동을 기록하고, 주간/월간 통계를 한눈에 볼 수 있는 도구가 필요하다.

## Solution

PWA 형태의 모바일 우선 웹앱으로, 하단 탭바를 통해 기록·통계·히스토리 세 화면을 오간다. 즐겨찾기에 자주 쓰는 운동을 등록해두고 탭 한 번으로 선택해 세션을 빠르게 추가한다. 통계 화면은 주간 막대 차트, 월간 히트맵, 추세선을 모두 제공해 운동 패턴을 시각적으로 파악한다.

## User Stories

1. As a user, I want to add a workout session with a date, exercise name, duration, and optional note, so that I can keep a record of each workout.
2. As a user, I want to select an exercise name from my favorites list by tapping, so that I can avoid typing on mobile.
3. As a user, I want to add a new exercise name to my favorites, so that it appears in future session inputs.
4. As a user, I want to remove an exercise from my favorites, so that I can keep the list tidy.
5. As a user, I want to type in an exercise name that is not in my favorites, so that I can record one-off sessions without cluttering favorites.
6. As a user, I want the session date to default to today, so that I can record quickly without adjusting the date.
7. As a user, I want to see a weekly bar chart showing daily workout duration for the current week, so that I can see how active I was each day.
8. As a user, I want to see a monthly heatmap showing which days I worked out, so that I can track my consistency at a glance.
9. As a user, I want to see a trend line showing my total weekly workout duration over time, so that I can spot improvement or decline.
10. As a user, I want to browse all past sessions in reverse chronological order in the History tab, so that I can review what I did.
11. As a user, I want to delete a session from the history, so that I can correct mistakes.
12. As a user, I want to edit a session from the history, so that I can fix wrong entries.
13. As a user, I want my data to persist across browser sessions, so that I don't lose records when I close the app.
14. As a user, I want to install the app on my phone's home screen via PWA, so that I can open it like a native app.
15. As a user, I want the app to work offline after the first load, so that I can record workouts without internet.
16. As a user, I want the UI to be optimized for one-handed mobile use, so that I can record quickly while at the gym.
17. As a user, I want the stats tab to show a summary card (total sessions this month, total minutes this month) at the top, so that I can see key numbers without reading charts.
18. As a user, I want the history list to show exercise name, duration, and date for each session at a glance, so that I can scan past records quickly.
19. As a user, I want notes to be expandable in the history list, so that the list stays compact.
20. As a user, I want the bottom navigation to show a badge or highlight on the active tab, so that I always know where I am.

## Implementation Decisions

### Modules

**DataStore (Deep Module)**
- 인터페이스: `getSessions()`, `addSession(session)`, `updateSession(id, session)`, `deleteSession(id)`, `getFavorites()`, `addFavorite(name)`, `removeFavorite(name)`
- localStorage를 단일 소스로 사용. JSON 직렬화/역직렬화를 캡슐화
- 외부에서는 localStorage 구조를 알 필요 없음

**StatsEngine (Deep Module)**
- 인터페이스: `getWeeklyStats(sessions, weekStart)`, `getMonthlyHeatmap(sessions, year, month)`, `getTrendData(sessions, weeksBack)`
- 순수 함수. 외부 의존 없음. 세션 배열을 받아 차트용 데이터 객체를 반환
- 날짜 처리는 내장 `Date` API만 사용 (외부 날짜 라이브러리 없음)

**UI: RecordTab**
- 즐겨찾기 목록을 가로 스크롤 칩으로 표시
- 칩 선택 시 운동 이름 필드에 자동 입력
- 날짜 기본값: 오늘
- 제출 시 DataStore.addSession 호출

**UI: StatsTab**
- 상단 요약 카드: 이번 달 총 세션 수, 총 분
- 주간 막대 차트 (Recharts BarChart)
- 월간 히트맵 (커스텀 그리드 컴포넌트 또는 Recharts)
- 추세선 (Recharts LineChart)
- StatsEngine에서 계산된 데이터를 props로 수신

**UI: HistoryTab**
- 역순 세션 목록
- 각 항목: 운동 이름, 소요 시간, 날짜, 메모(접기/펼치기)
- 스와이프 또는 버튼으로 삭제/편집

**UI: BottomNav**
- 기록 / 통계 / 히스토리 탭
- 현재 탭 하이라이트

**PWA Config**
- `manifest.json`: 앱 이름, 아이콘, 테마 색상, display: standalone
- Service Worker: 정적 에셋 캐시 (Cache First 전략)

### 기술 스택

- React + Vite
- Tailwind CSS (모바일 우선)
- Recharts (차트)
- localStorage (데이터 영속성)
- PWA (vite-plugin-pwa)

### 데이터 스키마 (localStorage)

```
sessions: Session[]
  id: string (uuid)
  date: string (YYYY-MM-DD)
  exerciseName: string
  durationMinutes: number
  note: string (optional)
  createdAt: string (ISO)

favorites: string[]
  (운동 이름 목록)
```

## Testing Decisions

**좋은 테스트 기준**: 외부 동작만 테스트한다. DataStore의 내부 localStorage 키 구조나 StatsEngine의 중간 계산 변수를 테스트하지 않는다. "세션을 추가하면 getSessions에 나타나는가", "이번 주 데이터를 넣으면 올바른 집계가 나오는가"처럼 입력-출력 계약을 검증한다.

**테스트 대상 모듈**:

1. **DataStore** — localStorage mock 환경에서 CRUD 전체 커버
   - 세션 추가 후 조회
   - 세션 수정 후 조회
   - 세션 삭제 후 조회
   - 즐겨찾기 추가/제거
   - 빈 상태 초기값

2. **StatsEngine** — 순수 함수이므로 mock 없이 단위 테스트
   - 주간 집계: 운동 없는 날은 0, 있는 날은 합산
   - 월간 히트맵: 운동한 날 true, 안 한 날 false
   - 추세선: n주 분량 데이터 반환 개수 검증
   - 경계값: 주 경계 날짜, 월 첫날/마지막날

**테스트 제외 대상**: UI 컴포넌트 (BottomNav, RecordTab 등) — 렌더링 테스트는 유지보수 비용 대비 가치가 낮음.

## Out of Scope

- 멀티유저 / 회원가입 / 로그인
- 서버 동기화 또는 클라우드 백업
- 웨이트/유산소 특화 필드 (세트, 횟수, 거리, 심박수)
- 소셜 기능 (공유, 친구 비교)
- 알림 / 푸시 노티피케이션
- 운동 루틴 템플릿
- 데이터 내보내기 (CSV, JSON)
- 다크모드 (초기 버전)

## Further Notes

- 데이터는 브라우저 localStorage에만 저장되므로, 브라우저 데이터 삭제 시 기록이 사라진다. 초기 버전에서는 이를 허용한다.
- StatsEngine을 순수 함수로 분리하면, 추후 서버 집계로 전환할 때 UI 컴포넌트 변경 없이 데이터 소스만 교체하면 된다.
- 추세선은 데이터가 2주 미만일 경우 의미 없으므로, 충분한 데이터가 없을 때 안내 메시지를 표시한다.
