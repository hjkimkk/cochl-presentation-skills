---
name: cochl-brochure
description: Cochl 브로셔를 편집 가능한 SVG(Adobe Illustrator용)로 제작한다. 3개 버전(V1 Visual 이미지중심 / V2 Balanced 균형 / V3 Editorial 텍스트중심) × 세로·가로 × 앞·뒤 총 12개 레이아웃과 32종 기술 아이콘(line/fill)을 사용한다. Use when the user asks for a Cochl brochure, 브로셔, 제품 소개서, 1-pager, leaflet, or datasheet.
---

# Cochl Brochure Skill

Cochl 브로셔를 **Illustrator에서 편집 가능한 SVG**로 만든다.

## 작업 순서

1. **요청 파악** — 아래 항목을 확인한다. 빠진 게 있으면 물어보되, "추천해줘"면 내용 성격에 맞춰 직접 정한다.
   - 버전(V1/V2/V3), 방향(세로/가로), 면(앞/뒤)
   - 표지 제목 + 한 줄 설명
   - 본문 섹션 제목·설명, 강조 수치, 아이콘, 이미지 자리
2. **템플릿 복사** — `templates/{version}--{orientation}-{side}.svg` 를 읽어 출발점으로 삼는다.
   파일명 예: `v2-balanced--portrait-front.svg`, `v3-editorial--landscape-back.svg`
3. **내용 채우기** — `<text>` 요소의 내용만 교체한다. 섹션 수가 다르면 `<g>` 그룹 단위로 복제/삭제한다.
4. **아이콘 삽입** — `icons/icon-data.json` 에서 geometry를 가져와 브로셔 액센트 색에 맞춰 넣는다.
5. **결과 전달** — 편집 가능한 SVG 파일로 저장한다.

## 수치·성능치 하드가드 (stat-band — 값 단위 NEEDS INPUT)

브로셔의 **stat-band**(뒷면 통계·스펙 행, V3 Editorial의 통계 행 포함)는 **사용자가 명시적으로 제공한 값만** 표시한다. 정확도·F1·지연시간(ms)·온디바이스 비율·클래스/폴트 수 같은 성능 수치는 확인된 소스가 없으면 '그럴듯한' 값을 지어내지 않고 **값마다 개별적으로** `[NEEDS INPUT]`(brand-core.md §1b `.needs-input` 컴포넌트)로 렌더링한다.

- **필드 단위가 아니라 값 단위로 검사한다** — 같은 stat-band 안의 다른 필드가 이미 올바르게 NEEDS INPUT 처리되어 있어도 예외 없음.
- `ILLUSTRATIVE` / `예시` 같은 라벨이 붙어도 면제되지 않는다 (상위 [`../../SKILL.md`](../../SKILL.md) → Facts & fabrication 규칙과 동일).
- 완료 전, 생성된 SVG의 stat-band `<text>` 수치를 훑어 사용자 입력과 매칭되지 않는 값을 전부 `[NEEDS INPUT]`로 바꾸고 사용자에게 목록으로 보고한다.

## 버전 선택 기준

| 버전 | 성격 | 추천 상황 | 액센트 |
|---|---|---|---|
| **V1 Visual** | 이미지 중심, 텍스트 적음, 큰 인덱스 숫자 | 임팩트 있는 표지, 비주얼 중심 | 중립 `#141414` |
| **V2 Balanced** | 텍스트↔이미지 균형, 테크 그리드 | 범용 제품 소개 (기본 추천) | 블루 `#4B68FF` |
| **V3 Editorial** | 텍스트 많음, 통계·스펙 행, 회로·파형 장식 | 설명·수치·항목이 많은 기술 자료 | 그린 `#0FA068` |

크기: 세로 `595 × 842`, 가로 `842 × 595` (A4 비율)

## 아이콘

`icons/icon-data.json` 에 32종. 각 아이콘은 `line` / `fill` 두 버전, 24×24 viewBox, `currentColor` 기반.

구조: `{ categories: [{id, ko, en}], icons: [{id, name, ko, cat, line, fill}] }` — `line`/`fill` 은 24×24 viewBox 기준 inner SVG 마크업 문자열.

카테고리: 사운드 AI · 엣지/온디바이스 · 보안/방위 · 산업/모빌리티 · 일반 UI · 성능/지표

삽입 방법 — `line` 은 `fill="none" stroke="{색}" stroke-width="1.7"` 그룹으로, `fill` 은 `fill="{색}"` 그룹으로 감싸고 `transform="translate(x,y) scale(s)"` 로 배치한다.

```svg
<g id="icon-drone" transform="translate(60,320) scale(1.5)" fill="none" stroke="#0FA068" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
  <!-- icon-data.json 의 line 마크업 -->
</g>
```

사용자가 직접 아이콘을 넣겠다고 하면, 아이콘 자리에 점선 박스 placeholder만 둔다.

## 편집 가능 SVG 필수 규칙 (Illustrator 호환)

- 텍스트는 반드시 `<text>` 태그 — **절대 path로 변환하지 않는다.**
- 폰트는 **Helvetica, Arial** 등 범용 시스템 폰트만 사용.
- 모든 그래픽 요소는 개별 `<g>` 그룹으로 분리하고 `id` 부여.
- `clipPath`, `mask`, `filter` 사용 최소화.
- 레이어 구조 유지: `background` / `graphic-elements` / `images` / `text-content`
- 장식 요소(그리드·선·도형·회로·파형)는 각각 독립적으로 선택/삭제 가능하게 그룹 분리.
- 이미지 자리는 사각형 placeholder + 캡션 `<text>` 로 둔다.

## 파일 구조

```
templates/   12개 브로셔 원본 SVG (v1|v2|v3 × portrait|landscape × front|back)
assets/      Cochl 로고 (basic / symbol / gray)
icons/       icon-data.json — 32종 아이콘 geometry
```
