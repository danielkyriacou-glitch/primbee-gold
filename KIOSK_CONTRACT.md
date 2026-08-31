# Offline Android Tablet Kiosk Contract

Every game added to this repository must build beneath `dist/games/<game-id>/`, be launched by a relative link from `dist/index.html`, and return with `location.replace()` to avoid a history loop. Each game must expose a persistent, clearly labelled HOME control with at least a 56 × 56 CSS-pixel target; HOME must synchronously save before navigation.

Games must work on first launch without internet. Runtime HTML, JavaScript, CSS, images, audio and fonts must be local and use relative paths. External URLs, external hyperlinks, network requests, `window.open()`, advertising, analytics, payments and application launches are forbidden. A service worker may supplement but must never be the sole offline mechanism.

Each game owns a namespaced, schema-versioned local-storage record. It must validate every restored field and recover missing, malformed or unsupported records to documented safe defaults without crashing. Credits, audio and family settings, feature progress, and any calculated-but-not-visually-completed outcome must be durable. A spin transaction must deduct, calculate the entire result, apply credits/features, and save the completed outcome before animation. Recovery displays/acknowledges that outcome without repeating wager or payout. Save on HOME, `visibilitychange` when hidden, and `pagehide`.

Landscape layouts must keep primary game content, credits, play control and HOME visible without scrolling or overlap at 1024×600, 1280×800, 1920×1200 and 2560×1600. Portrait shows a rotate-tablet message without resetting state.

Do not alter approved mathematics while integrating a game. Tests must cover persistence, interrupted transactions, navigation, and offline safety. Production builds must be scanned for remote dependencies and must remain ignored by Git. Android orientation locking, immersive/kiosk policy, boot launch and OS escape prevention belong to the later native wrapper and cannot be promised by browser code. Physical tablets must be tested separately.
