# Project: ApplyFlow / Evidence-based Job Discovery

## Problem

신입 IT 재택 공고를 찾으려면 여러 플랫폼을 반복해서 확인해야 하고, 각 플랫폼은 경력·학력·재택·마감 조건을 서로 다른 방식으로 표시합니다. 검색 제목만 확인하면 교육 과정, 경력직, 상주 근무, 마감 공고가 함께 섞일 수 있습니다.

## Solution

ApplyFlow는 11개 플랫폼에서 후보 공고를 찾은 뒤 상세 페이지를 다시 검증합니다. 출처별 데이터를 공통 모델로 변환하고 `조건 일치`, `확인 필요`, `제외`로 분류하며 판단 근거를 함께 저장합니다.

## Supported sources

- 잡코리아
- 사람인
- 원티드
- 점핏
- 그룹바이
- 고용24
- 프리모아
- 알바몬
- 알바천국
- 인크루트
- 랠릿

로켓펀치는 공개 페이지의 서버 접근 제한을 우회하지 않고 보류했습니다.

## Architecture

```text
Search / User URL
  → HttpCollector
  → Source Adapter
  → Normalizer / Evidence Validator
  → SQLiteRepository
  → FastAPI
  → Web Dashboard
```

수집기, 출처별 파서, 정규화, 판정, 저장소를 분리해 특정 플랫폼의 구조가 바뀌면 해당 어댑터만 수정할 수 있도록 설계했습니다.

## Data quality improvement

알바천국의 일반 매장 공고가 페이지 공통 영역에 포함된 재택 관련 문구 때문에 잘못 분류될 가능성을 발견했습니다. 공고 제목과 공고별 요약처럼 해당 채용에 직접 연결된 표현만 근거로 인정하도록 수정했습니다. 근거가 없으면 조건 일치로 단정하지 않고 확인 필요로 분리했으며 회귀 테스트를 추가했습니다.

## Stack

Python, FastAPI, Pydantic, httpx, BeautifulSoup, SQLite, Pytest

## Verification

출처별 URL 추출, 상세 데이터 변환, 경력·재택·마감 판정, 중복 제거, 저장 이력을 자동 테스트로 검증합니다.
