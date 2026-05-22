# Project: SafeMeals / Allergy-aware Menu Scan App

## RAG Summary
SafeMeals는 알레르기와 식이 제한 정보를 관리하고, 메뉴판이나 음식 정보를 스캔해 외식 시 안전한 메뉴 선택을 돕는 다국어 모바일 우선 앱입니다. 프로젝트는 Next.js 14 웹 앱과 Expo React Native 모바일 앱을 결합한 모노레포 하이브리드 구조로 구성되어 있습니다. 핵심 기능은 메뉴 스캔, Gemini/Google Vision 기반 OCR, 알레르기 위험도 분석, PIN 보호 Safety Card, 온보딩/프로필 관리, 다국어 UI, Supabase 연동 준비입니다.

## Source Repository
- GitHub: https://github.com/hanck1324-ship-it/code-camp_SAFE_Meals
- Figma reference: https://www.figma.com/design/fGAuThpvHIa1La2c6waZJB/SafeMeals-App-Design

## Basic Information
- Project name: SafeMeals
- English description: Allergy-aware menu scan and safety card app
- Project type: Mobile-first food safety / allergy assistant
- Architecture: Monorepo with Next.js web app, Expo React Native mobile app, and shared package
- Main purpose: Help users with allergies or dietary restrictions choose safer food when eating out, especially in multilingual or unfamiliar restaurant environments.
- Portfolio relation: SafeMeals is one of the projects Kim Garam participated in and should be included when users ask which projects Kim Garam worked on.

## Kim Garam's Participation
김가람은 SafeMeals 프로젝트에 참여했습니다. 김가람이 참여한 프로젝트 목록을 물으면 SafeMeals와 교통봇을 함께 답해야 합니다. SafeMeals는 알레르기/식단 정보 관리, 메뉴 스캔, OCR/AI 분석, Safety Card, 다국어 UI, Next.js/Expo 기반 하이브리드 앱 구조를 보여주는 프로젝트입니다.

## Problem Background
SafeMeals addresses three user problems.
1. People with food allergies have difficulty identifying risky menu items when eating out.
2. Language barriers make it hard to communicate allergy information to restaurant staff while traveling.
3. Users must manually inspect menus and ingredients, which is slow and error-prone.

## Solution
SafeMeals solves these problems with a camera-based menu scanning workflow, an AI allergy analysis pipeline, and a protected Safety Card. Users can register allergies and dietary restrictions during onboarding, scan a menu or food item, and receive a risk result such as Safe, Caution, Warning, or Danger. The Safety Card can be protected by a 4-digit PIN and shown to restaurant staff in Korean and English.

## Key Features
### 1. Menu Scan
SafeMeals allows users to scan a menu using the mobile camera or web upload flow. The system extracts text from the image, analyzes menu items and ingredients, and compares them against the user's allergy and diet profile.

### 2. OCR and AI Analysis
The project supports multiple OCR strategies.
- Google Cloud Vision API: fastest and most accurate option, around 1-2 seconds and 95%+ expected accuracy.
- Gemini Vision: fallback or free option, around 2-3 seconds with 85-90% expected accuracy.
- Tesseract.js: fully free option, but slower at around 5-10 seconds.
- Race strategy: Google Vision and Gemini are executed in parallel, and the faster result is used.

### 3. Allergy Risk Rating
SafeMeals classifies menu safety using risk levels.
- Safe: green, likely safe for the user's profile.
- Caution: yellow, potentially requires attention.
- Warning: orange, likely contains concerning ingredients.
- Danger: red, contains a matching allergen or high-risk ingredient.
The project uses a conservative safety principle: if uncertain, it should return Caution rather than incorrectly marking a risky item as Safe.

### 4. Safety Card
Safety Card is a PIN-protected allergy information card. It displays user allergy and diet information in Korean and English so the user can show it to restaurant staff. It uses severity color coding and is designed for real-world restaurant communication.

### 5. Onboarding and Profile
The onboarding flow collects allergy information and dietary restrictions. Profile and settings screens let users manage language, security, notifications, and safety information.

### 6. Multilingual Support
SafeMeals supports five languages: Korean, English, Japanese, Chinese, and Spanish. Translation keys are managed with type safety, and hardcoded user-facing text is discouraged.

### 7. Authentication and Backend Readiness
The project includes login and signup flows and Supabase integration preparation. Supabase is used or planned for user profile, allergy data, scan history, image storage, payment history, and backend persistence.

## Technical Stack
- Web: Next.js 14, App Router, TypeScript strict mode, Tailwind CSS
- UI: Radix UI, shadcn/ui, React Hook Form, Lucide React
- Mobile: Expo, React Native, Expo Router, react-native-webview
- State and Data: React Query, Zustand, useAppStore, useLanguageStore
- Backend/Data: Supabase client and database migrations
- AI/OCR: Gemini, Google Cloud Vision API, Tesseract.js
- Shared Layer: packages/shared for bridge protocol, shared types, constants, and utilities
- Testing: Jest, Playwright, feature-level test specs

## Architecture
SafeMeals uses a monorepo architecture.
- apps/web: Next.js web app used as web views for complex UI screens such as dashboard, onboarding, profile, scan results, and analysis pages.
- apps/mobile: Expo React Native shell for native features such as camera access, splash screen, tabs, permissions, settings, and WebView routing.
- packages/shared: Shared bridge protocol, common types, constants, and utilities used by both web and mobile.

## Hybrid Design Intention
The project intentionally separates screens by implementation type. Camera and settings screens are native because they need device-level access and performance. Dashboard, onboarding, profile, and scan result screens are web views because they involve complex UI and can be updated quickly. This approach balances native performance with web development speed.

## WebView Bridge Protocol
SafeMeals uses a bridge protocol between web views and the native shell. The shared package defines type-safe messages so that the web app can request native actions such as camera scanning or navigation, and the native app can pass data back into web views. This reduces integration errors and keeps web/mobile behavior consistent.

## Main User Flow
1. The app starts with a native splash screen.
2. The app checks whether onboarding is complete.
3. If onboarding is incomplete, the user enters allergy and diet information through webview onboarding screens.
4. If onboarding is complete, the user enters the main native tab structure.
5. Main tabs include Home, Scan, Profile, and Settings.
6. Scan uses native camera functionality and then routes to a webview result screen.
7. The result screen shows safety status, reasons, matched allergens, ingredients, and recommendations.
8. The user can open Safety Card from profile or result flows.

## Example Test Scenario: 꽃게탕 and Shellfish Allergy
A documented scenario uses a user with shellfish allergy and a scanned menu item 꽃게탕 / Spicy Blue Crab Stew. Gemini AI detects crab as a shellfish ingredient and returns DANGER. The database verification step checks allergen mappings and confirms that 꽃게 maps to shellfish. The final UI shows a red Danger badge and warns the user not to consume the menu.

## Development Principles
- Feature-based architecture: features such as auth, scan, dashboard, and profile are separated into independent modules.
- Type safety: TypeScript strict mode, explicit interfaces, and shared types are emphasized.
- Accessibility: Radix UI and shadcn/ui are used for accessible UI components.
- Maintainability: Tailwind CSS, absolute imports, reusable components, and consistent coding rules are used.
- Internationalization: user-facing text should avoid hardcoding and use typed translation keys.
- Conservative safety: never mark uncertain or risky food as Safe without sufficient evidence.

## Portfolio Talking Points
- SafeMeals demonstrates product-oriented AI application design, not just a model demo.
- It combines mobile camera capture, webview UX, OCR, Gemini/Google Vision analysis, allergy database validation, multilingual UI, and Supabase-backed persistence.
- The project shows understanding of real user risk: allergy information must be handled conservatively and clearly.
- The monorepo and bridge-protocol structure demonstrate architecture planning across web, mobile, and shared code.

## Frequently Asked Questions
### What is SafeMeals?
SafeMeals is a mobile-first app that helps people with allergies or dietary restrictions identify safer menu choices when eating out.

### What problem does SafeMeals solve?
It reduces the difficulty of reading menus, detecting allergen risks, and communicating allergy information across language barriers.

### What are the main features?
Menu scan, OCR, allergy risk analysis, Safety Card, onboarding, profile management, multilingual support, and scan history.

### What technologies does SafeMeals use?
Next.js 14, TypeScript, Tailwind CSS, Radix UI/shadcn, Expo React Native, React Query, Zustand, Supabase, Gemini, Google Vision, and Tesseract.js.

### How does the menu scan work?
The user captures a menu image, OCR extracts menu text, AI identifies menu items and ingredients, user allergy/diet context is applied, and the app displays Safe/Caution/Warning/Danger results.

### What is Safety Card?
Safety Card is a PIN-protected card that displays allergy and diet information in Korean and English for restaurant staff.
