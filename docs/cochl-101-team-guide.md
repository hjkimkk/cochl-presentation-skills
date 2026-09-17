# Cochl 101 — 팀 사용 가이드 (Team Guide)

"Cochl 101" 강의/클래스 덱을 팀에서 쓰는 방법입니다. **하려는 일에 따라 두 갈래**예요.

---

## TL;DR

| 하려는 일 | 무엇을 쓰나 | 항상 최신? |
|---|---|---|
| 덱을 **열어서 발표·테스트** | 공유 **Figma** 파일을 복제(Duplicate) | ✅ 항상 최신 (설치 불필요) |
| 스킬로 **새 덱을 생성** | Claude Code `/cochl-presentation` | ⚠️ 자동 업데이트 1회 설정 후 최신 |

---

## 1) 발표·테스트만 할 거면 → Figma 복제 (설치 불필요)

코클 101의 **단일 원본**은 이 Figma 파일입니다. 언제나 최신입니다:

**https://www.figma.com/slides/pXQZ3uLG34fLpafWDA92dl/Cochl-—-101-Class---Lecture-Template**

- 파일 열기 → 우측 상단 **⌄ → Duplicate**(또는 `File → Duplicate`)로 내 사본을 만든 뒤 내용 채우기.
- 33슬라이드(라이트 본문 + 다크 섹션 디바이더, 8개 섹션: Introduce · Explain · Compare · Prove · Apply · Practice · Process · Close). 필요한 포맷만 남기고 나머지는 지우면 됩니다.
- **스킬 설치와 무관** — 클론/설치 없이 바로 됩니다. 팀 테스트는 이 링크만 공유하면 끝.

## 2) 스킬로 새 덱을 생성하려면 → `/cochl-presentation`

Claude Code에서 `/cochl-presentation` 호출 후 "Cochl 101 강의 덱"을 요청하면 최신 `101-class-lecture-template` 스펙으로 만들어 줍니다.

단, 스킬은 `~/.claude/skills/`에 **복사된 스냅샷**이라 저절로 갱신되지 않습니다. **매번 최신으로 쓰려면 자동 업데이트를 한 번만 설정**하세요 → [README의 "Stay up to date (auto-update)"](../README.md#stay-up-to-date-auto-update)

설정 후에는 **새 세션마다 자동으로 최신 템플릿**을 당겨옵니다. 팀원마다 매번 pull 부탁할 필요가 없어집니다.

## 3) "옛날 버전이 보여요" 증상 해결

예전 `cochl-101-template.md`(빈 계획 파일)가 보이거나 스펙이 Figma와 다르면 = **로컬이 옛 버전**입니다:

```bash
cd cochl-presentation-skills
git checkout main && git pull
bash .claude/install-skills.sh
```

그리고 **Claude Code 세션을 새로 시작**하세요. (자동 업데이트를 설정해 뒀다면 이 과정이 세션마다 자동으로 일어납니다.)

**최신 확인 한 줄:**
```bash
grep "Cochl 101" cochl-presentation-skills/skills/cochl-presentation/references/registry.md
```
→ `101-class-lecture-template.md … ✅ … pXQZ3uLG34fLpafWDA92dl` 가 나오면 최신입니다.

---

## 주의사항 (facts discipline)

101 클래스는 초심자에게 틀린 숫자가 가장 오래 박히는 자리입니다. 템플릿의 모든 `[ placeholder ]` — 토픽, 정의, 용어, 지표, `[ +NN% ]`, 날짜, 고객사명, 인용 — 는 **발표자가 확인한 실제 값을 넣기 전까지 `[NEEDS INPUT]`으로 두세요.** 스킬은 확인되지 않은 숫자·회사명·경쟁사명을 절대 지어내지 않습니다.
