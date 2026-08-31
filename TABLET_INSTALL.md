# Tablet preview and future Android installation

## Browser review

1. Run `npm run build` and `npm run serve` from the repository.
2. On the same machine open `http://localhost:4173`; use landscape fullscreen from the five-second top-left family-settings press.
3. For an offline review, load once from `dist/` with a local server and disable networking in browser developer tools. All runtime files are local.

## Android (intentionally deferred)

APK packaging was explicitly deferred pending web approval. After approval, copy `dist/` into a minimal maintained Capacitor project, set landscape orientation and immersive fullscreen, remove `INTERNET`, reject external WebView navigation, enable keep-awake, then run `npx cap sync android` and `./gradlew assembleDebug`. No APK or actual-device result is claimed in v1 review.
