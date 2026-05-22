# Project: 교통봇 / Voice-based Public Transit Assistant

## RAG Summary
교통봇 프로젝트는 음성 기반 실시간 버스 도착 안내 서비스입니다. 사용자가 "교통봇"이라는 호출어를 말한 뒤 버스 번호와 정류소를 음성으로 질문하면, 시스템이 음성을 인식하고 광주광역시 BIS OpenAPI를 조회한 뒤 TTS 음성으로 버스 도착 정보를 안내합니다. 프로젝트 참가 인원은 총 3명이며, 팀원은 김현진, 문서현, 김가람입니다. 김현진은 KWS(openWakeWord) 파인튜닝, 문서현은 STT(Whisper)와 BIS OpenAPI 연동, 김가람은 TTS(GPT-SoVITS) 및 API 서버 구성을 담당했습니다.

## Source Repository
- GitHub: https://github.com/seohyeonmun/first-project
- Demo: https://youtu.be/wwp4TqpGx4g

## Basic Information
- Project name: 교통봇
- English description: Voice-based real-time public transit/bus arrival assistant
- Development period: 2026.04.16 ~ 2026.04.29
- Project type: Team AI voice assistant / public transportation information service
- Primary language: Python

## Problem Background
교통봇 프로젝트는 출근 시간대에 빠르게 버스 도착 정보를 확인해야 하는 상황과, 시력 불편 등으로 화면 접근이 어려운 사용자를 고려해 기획되었습니다. 사용자가 화면을 조작하지 않고 호출어와 음성 질문만으로 버스 도착 정보를 들을 수 있게 만드는 것이 핵심 목적입니다.

## Team Members and Roles
교통봇 프로젝트 참가 인원은 총 3명입니다.
- 김현진: KWS(openWakeWord) 파인튜닝 담당. 직접 녹음한 호출어 데이터와 네거티브 데이터를 활용해 호출어 인식 안정성을 개선했습니다.
- 문서현: STT(Whisper-base) 및 광주광역시 BIS OpenAPI 연동 담당. 사용자 음성을 텍스트로 변환하고 버스 번호와 정류소명을 추출해 실시간 도착 정보를 조회했습니다.
- 김가람: TTS(GPT-SoVITS-v2Pro) 및 API 서버 구성 담당. 생성된 답변을 자연스러운 한국어 음성으로 출력하고, 모델 메모리 상주 방식의 API 서버로 TTS 응답 지연을 줄였습니다.

## Kim Garam's Role
김가람은 교통봇 프로젝트에서 TTS와 API 서버 구성을 담당했습니다. GPT-SoVITS-v2Pro 기반 한국어 음성 출력 기능을 구현했고, 로컬 추론 시 약 20초 소요되던 TTS 응답 시간을 API 서버 도입 후 1~3초 수준으로 단축했습니다. 또한 Cloudflare Tunnel을 활용해 외부 환경에서도 API 서버에 접근할 수 있도록 구성했습니다.

## Key Features
### 1. KWS: Wake Word Detection
- 호출어: "교통봇"
- 기술: openWakeWord
- 직접 녹음한 약 200개의 호출어 데이터를 기반으로 데이터 증강을 수행해 약 1000개의 학습 데이터를 구축했습니다.
- 유사 발음 단어를 네거티브 데이터로 추가해 오탐을 줄였습니다.
- 연속 4회 감지 방식을 적용해 안정성을 높였습니다.
- 호출어 감지 score 0.97을 달성했습니다.

### 2. STT and Bus API
- 기술: Whisper-base + 광주광역시 BIS OpenAPI
- 호출어 감지 후 사용자 음성을 텍스트로 변환합니다.
- 사용자 질문에서 버스 번호와 정류소 이름을 추출합니다.
- Levenshtein Ratio 기반 문자열 유사도 비교로 정류소명이 완전히 일치하지 않아도 유사한 정류소를 탐색합니다.
- 동일한 이름의 정류소가 상행/하행으로 나뉘는 경우를 고려해 정류소 방향 정보를 함께 안내합니다.

### 3. TTS
- 기술: GPT-SoVITS-v2Pro
- 생성된 답변을 신뢰감 있는 여성 아나운서 스타일 음성으로 출력합니다.
- 자연스러운 한국어 발화와 빠른 추론 속도의 균형을 고려했습니다.
- API 서버를 도입해 모델을 메모리에 상주시켜 즉시 추론 가능하도록 최적화했습니다.

## Technical Stack
- Language: Python
- AI: openWakeWord, Whisper-base, GPT-SoVITS-v2Pro
- API: 광주광역시 BIS OpenAPI / 공공데이터포털
- Network: Cloudflare Tunnel
- Tools: VSCode, GitHub

## System Pipeline
교통봇의 전체 파이프라인은 다음 순서로 동작합니다.
1. KWS 모듈이 "교통봇" 호출어를 감지합니다.
2. Orchestrator가 STT 모듈에 사용자 음성 파일을 전달합니다.
3. STT 모듈이 음성을 텍스트로 변환합니다.
4. Bus API 모듈이 버스 번호와 정류소 정보를 바탕으로 실시간 도착 정보를 조회합니다.
5. 필요한 경우 LLM 또는 응답 생성 로직이 안내 문장을 다듬습니다.
6. TTS 모듈이 안내 문장을 음성 파일로 변환합니다.
7. 시스템이 생성된 음성을 재생합니다.

## Interface Contract
교통봇 프로젝트는 KWS, STT+Bus API, TTS 모듈을 역할별로 나누어 개발했기 때문에, 모듈 간 I/O 규약을 문서화했습니다. 공통 규칙은 UTF-8 문자열, ISO 8601 시간 형식, snake_case 필드명, request_id 유지입니다. 에러는 ok=false와 error.code, error.message, retryable, request_id를 포함하는 공통 포맷을 사용합니다.

## Troubleshooting and Improvements
- KWS 오탐 문제: 일상 대화 중 유사 발음을 호출어로 잘못 인식하는 문제가 있었습니다. 유사 발음 단어를 네거티브 데이터로 추가 학습하고 연속 4회 감지 방식을 적용해 오탐을 줄였습니다.
- STT 정류소명 인식 오류: Whisper가 정류소명을 완전히 정확하게 인식하지 못하는 경우가 있었습니다. Levenshtein Ratio 기반 문자열 유사도 비교를 적용해 유사 정류소명을 탐색하도록 개선했습니다.
- TTS 응답 지연: 로컬 환경에서 GPT-SoVITS 추론 시 약 20초가 걸렸습니다. API 서버로 모델을 메모리에 상주시켜 응답 시간을 1~3초 수준으로 단축했습니다.

## Execution Notes
실행에는 Python 패키지 설치, Whisper/GPT-SoVITS 모델, ffmpeg, 마이크와 스피커, 광주광역시 BIS API KEY 설정이 필요합니다. README 기준으로 현재 광주광역시 BIS API는 사용 불가 상태이며 대체 API 교체가 필요하다고 명시되어 있습니다.

## Portfolio Talking Points
- 음성 AI 파이프라인 전체를 KWS → STT → API 조회 → TTS로 연결한 프로젝트입니다.
- 팀 프로젝트에서 역할 분담과 I/O 계약의 중요성을 경험했습니다.
- 김가람은 TTS 추론 지연 문제를 API 서버 구조로 해결해 실사용성 개선에 기여했습니다.
- 한국어 음성 인식, 공공 API 연동, 음성 합성, 네트워크 터널링을 조합한 실용형 AI 서비스입니다.
