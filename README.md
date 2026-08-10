# Synthetix RAG Portfolio

포트폴리오와 프로젝트 문서를 검색해 근거 기반 답변을 제공하는 **RAG 지식지원 서비스**입니다. 방문자가 긴 문서를 직접 탐색하지 않아도 프로젝트의 문제·구현·역할·개선 결과를 질문으로 확인할 수 있게 만들었습니다.

같은 구조를 LMS의 강의자료 질의응답, 학습 내용 복습, 운영자용 교육자료 검색 기능으로 확장할 수 있습니다.

## 해결하려던 문제

프로젝트가 많아질수록 방문자는 다음 정보를 찾기 위해 여러 페이지와 문서를 오가야 합니다.

- 프로젝트가 해결한 실제 문제
- 지원자가 직접 담당한 역할
- 기술을 선택한 이유
- 장애와 오탐을 개선한 과정
- 수치 또는 테스트로 확인할 수 있는 결과

Synthetix는 문서를 임베딩해 관련 문맥을 검색하고, 검색된 문맥을 우선 사용해 답변합니다. 사용자는 답변과 함께 어떤 문서가 사용됐는지 확인할 수 있습니다.

## 핵심 흐름

```text
Portfolio documents
  → Overlapping text chunking
  → Gemini embeddings
  → Pinecone vector index

User question + recent conversation
  → Query embedding
  → Top-K document retrieval
  → Gemini grounded answer
  → Source references in chat UI
```

## 주요 기능

- Next.js 기반 반응형 포트폴리오
- Gemini·Pinecone 기반 RAG 질의응답
- 최근 대화 이력을 반영한 후속 질문 처리
- 답변에 사용한 문서 종류·식별자·미리보기 표시
- 검색 문맥이 없을 때 정보 부족 안내
- Gemini API 할당량 오류 지수 백오프 재시도
- 관리자 지식 문서 편집 및 Pinecone 재색인
- Firebase ID Token과 Firestore 역할을 이용한 관리자 API 권한 검사
- 예상 질문과 기대 문서를 이용한 검색 평가 데이터셋

## 대표 프로젝트

1. **ApplyFlow** — 11개 외부 채용 플랫폼 연동, 공통 데이터 모델, 근거 기반 조건 판정
2. **Synthetix RAG** — 문서 검색과 근거 기반 답변, 관리자 재색인
3. **교통봇** — 음성 AI 파이프라인과 TTS 지연 개선
4. **SAFE Meals** — 알레르기·식이 제한 기반 메뉴 스캔 사용자 흐름

## 기술 스택

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS, Motion
- **RAG**: Gemini, Pinecone, 자체 문서 분할 로직
- **Backend**: Next.js Route Handlers, Firebase Admin
- **Data**: JSON·Markdown 지식 문서, Pinecone namespace

## 데이터와 재색인

RAG가 사용하는 자료는 다음 위치에 있습니다.

```text
rag-data/knowledge.json
rag-data/pdf-extract.txt
rag-data/documents/*.md
```

자료를 수정한 뒤 관리자 화면에서 재색인을 실행해야 Pinecone에 최신 벡터가 저장됩니다. 관리자 API는 Firebase 로그인과 `admin` 역할을 모두 확인합니다.

## 검색 평가

`rag-data/evaluation.json`에는 질문과 반드시 검색되어야 하는 문서 식별자를 저장합니다.

```bash
npm run rag:evaluate
```

평가 스크립트는 각 질문의 검색 결과에 기대 문서가 포함됐는지 확인합니다. 답변 품질 평가는 검색 평가와 별도로 사람이 근거 일치 여부를 검토해야 합니다.

## 로컬 실행

1. 패키지를 설치합니다.

```bash
npm install
```

2. `.env.local`에 필요한 값을 설정합니다.

```env
GEMINI_API_KEY=""
GEMINI_MODEL="gemini-2.5-flash"
GEMINI_EMBED_MODEL="text-embedding-004"

PINECONE_API_KEY=""
PINECONE_INDEX="synthetix-portfolio"
PINECONE_NAMESPACE="prod"

FIREBASE_WEB_API_KEY=""
FIREBASE_PROJECT_ID=""
FIREBASE_CLIENT_EMAIL=""
FIREBASE_PRIVATE_KEY=""
```

3. 실행합니다.

```bash
npm run dev
```

- 포트폴리오: `http://localhost:3002`
- 로그인: `http://localhost:3002/login`
- RAG 관리자: `http://localhost:3002/admin/rag`

## 검증

```bash
npm run lint
npm run build
```

## 한계와 다음 개선

- 검색 품질은 문서 분할 크기와 질문 표현에 영향을 받습니다.
- 현재 평가는 기대 문서 검색 여부를 확인하며, 답변의 사실성 자동 평가는 추가로 필요합니다.
- Pinecone 인덱스가 비어 있으면 관리자가 먼저 재색인해야 합니다.
- 사용자 질문 빈도와 실패 유형을 개인정보 없이 집계하는 운영 지표가 필요합니다.
