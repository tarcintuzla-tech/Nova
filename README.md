# NOVA

*Kendini keşfet. Dünyayı anla. İz bırak.* · *Discover yourself. Understand the world. Leave a mark.*

NOVA is an open-source, local-first personal development app for Android, built with Expo, React Native and TypeScript.
The interface and all bundled content are available in **Turkish and English** (language is chosen on first launch, switchable in Profile).

## Features
Six modules, each with real, working features:

| Module | What you can do |
|---|---|
| Self Discovery | Answer the daily question, keep a journal (create/edit/delete), choose up to 5 values, strength-reflection exercises, personal goals, history, summary |
| Daily Learning | Daily card, library with categories and search, favorites, reading history, knowledge quiz. Cards are labelled *verified fact* or *interpretation/model* |
| Awareness | Daily thought, short exercises, gratitude journal, reflection prompts, history |
| Personal Growth | Daily tasks, custom habits, 28-day habit calendar, goals, weekly progress, milestones (no shaming for missed days) |
| Kindness Chain | Daily suggestion, ideas (helping, environment, community), completion history. Nothing about other people is stored |
| Understand People | Educational cards, interactive scenarios, reflection prompts, quiz, saved cards. Body-language content is framed as possibilities, not certainty |

Plus: onboarding (skippable steps, no account), Home with daily progress, Discover (search), My Progress, Profile
(language, light/dark theme, daily reminder, **export** and **delete all data**).

## Quick start
```bash
npm install
npx expo install --fix      # aligns package versions with the installed Expo SDK
npm run typecheck
npm test
npm run lint
npx expo start --android    # needs an emulator or a phone with Expo Go / a dev build
```
`expo-sqlite` and `expo-notifications` work best in a development build:
`eas build -p android --profile development`.

## Build an installable APK
```bash
npm i -g eas-cli
eas login
eas build -p android --profile preview      # installable .apk
eas build -p android --profile production   # .aab for Google Play
```
Download the APK from the link EAS prints, copy it to the phone and open it (allow "install unknown apps" once).
Android package id: `app.nova.mobile` · version `0.1.0` (`app.json`) · icon/splash in `assets/`.
Change the package id before publishing if you want your own.

## Architecture
```
app/            Expo Router screens (tabs, onboarding, module/[id])
src/components  Reusable UI (Card, Button, QuickForm, JournalList, Quiz, ...)
src/modules     Section screens per module + registry.tsx
src/db          SQLite client, versioned migrations, repositories (pure functions over a small Db interface)
src/store       Zustand: preferences (persisted in SQLite) and a data-version counter
src/hooks       useData (reads, auto-refresh), write(), useColors, reminder toggle
src/content     Bundled bilingual content (cards, quizzes, exercises, ...)
src/i18n        i18next setup and tr/en locale files
tests/          Jest tests (real SQL through better-sqlite3)
```
Repositories only depend on the `Db` interface, so a sync layer can be added later without touching screens.

### Decisions
- Preferences live in the SQLite `preferences` table (no AsyncStorage).
- Daily-question answers are stored in `journal_entries` with `kind = 'daily'` (instead of a separate table); the same table holds gratitude, strengths, awareness and reflection notes.
- Learning content ships with the app (not in the DB) so it works offline and updates with app versions; favorites/history reference it by id.
- Reminder: one local notification daily at 20:00; no push token, no server.
- Schema versioning uses `PRAGMA user_version`; add new steps to `src/db/migrations.ts`.

## Privacy
All data stays on the device. No accounts, analytics, ads, tracking SDKs or network calls. You can export (share as JSON) or delete everything from Profile.

## Status
Code for all phases is written. **It has not been compiled or run in the authoring environment**, so expect to fix some TypeScript/dependency-version errors on first run. No APK has been built yet. See `CHANGELOG.md`.

## License
AGPL-3.0-only (proposed; pending the project owner's approval). Replace the placeholder `LICENSE` with the official text:
`curl -o LICENSE https://www.gnu.org/licenses/agpl-3.0.txt`
