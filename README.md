# Ember QR

A simple QR code generator built with React Native and Expo. It runs entirely on the device: no server, no
account, nothing leaves the phone.

## What it does

Pick a tab at the bottom (Text, URL, Wi-Fi or Phone), fill in the form, and the QR code appears live as you type.
Each tab keeps what you typed when you switch away and back.

| Type | You enter | Scanning it |
|---|---|---|
| **Text** | any text, including Bangla and emoji | shows the text |
| **URL** | a website link (`https://` is added if you leave it out) | opens the website |
| **Wi-Fi** | network name, password, and WPA/WEP/None | joins the network |
| **Phone** | a phone number | offers to call it |

**Share QR code** sends a 1024 × 1024 PNG through the phone's share sheet (WhatsApp, Save Image, Photos, …). In the
web preview the button becomes **Download PNG**.

The app follows the phone's light or dark setting and uses the Ember colours, the Bricolage Grotesque typeface and
Material Symbols icons.

## What you need

- **Node 22 or newer.** Check with `node -v`.
- **Expo Go for SDK 57** on an Android phone/emulator or the iPhone simulator, or any browser for the web preview.
  See [Troubleshooting](#troubleshooting) for real iPhones.

## Quick start

```bash
cd mobile
npm install
npm start
```

When Metro is running, press <kbd>a</kbd> for Android, <kbd>i</kbd> for the iPhone simulator, or <kbd>w</kbd> for
the browser.

## Scripts

Run these from `mobile/`, the one place with a `package.json`:

| Command | What it does |
|---|---|
| `npm start` | starts the Expo dev server |
| `npm run web` | starts it with the browser preview on |
| `npm run typecheck` | type-checks the app with `tsc --noEmit` |
| `npm run lint` | runs Expo's ESLint rules |

## What's inside

```text
ember-qr/
└── mobile/                   the Expo app: SDK 57, Expo Router, React Compiler on
    ├── package.json          the only manifest — dependencies install into mobile/node_modules
    ├── app.json              name, icons, splash screen, bundle identifier
    ├── assets/               fonts (Bricolage, Material Symbols) and app images
    └── src/
        ├── app/                  every file here is a screen (Expo Router)
        │   ├── _layout.tsx       loads the fonts and sets up the bottom tab bar
        │   ├── index.tsx         Text tab
        │   ├── url.tsx           URL tab
        │   ├── wifi.tsx          Wi-Fi tab
        │   └── phone.tsx         Phone tab
        ├── qr/
        │   ├── QrScreen.tsx      the shared layout: tab title, live QR card, Share button, form fields
        │   ├── payload.ts        turns each tab's fields into the text stored in the QR code
        │   └── QrCode.tsx        encodes the QR code and draws it as SVG (and PNG on web)
        ├── components/
        │   ├── EmberBackground.tsx  animated Ember gradient (expo-gl shader)
        │   ├── LiquidTabBar.tsx     liquid-glass icon-only tab bar (orange water-drop indicator)
        │   ├── SunMoonToggle.tsx    sun/moon theme toggle (arc swap, night/day sky, persisted)
        │   └── Icon.tsx      Material Symbols icons from the bundled font
        └── theme.tsx         light and dark colours + persisted theme-mode provider
```

| | Version |
|---|---|
| Expo SDK | 57 |
| React Native | 0.86 (New Architecture) |
| React | 19.2, with the React Compiler |
| TypeScript | 6.0, strict |

QR codes are made with [`qrcode-generator`](https://github.com/kazuhikoarase/qrcode-generator), drawn with
`react-native-svg`, and shared with `react-native-view-shot` + `expo-sharing`.

## Make it yours

- **Change the bundle identifier before you build.** `mobile/app.json` uses `com.reactbd.ember` for iOS and Android.
  App Store Connect and Google Play need one that's unique to you.
- **Never edit `mobile/ios` or `mobile/android` by hand.** Expo generates them from `app.json`.

## Fonts and licences

- **Bricolage Grotesque**: © The Bricolage Grotesque Project Authors, under the
  [SIL Open Font License 1.1](https://openfontlicense.org/).
- **Material Symbols**: © Google, under the [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0).

## Troubleshooting

**"Project is incompatible with this version of Expo Go"**
Expo Go runs exactly one SDK and this project uses SDK 57. Install the SDK 57 build from
[expo.dev/go](https://expo.dev/go) on Android, or use the iPhone simulator. The App Store's Expo Go can't open it; on
a real iPhone, make a development build with `npx expo run:ios`.

**The screen is blank, or you see an old version of it**
Restart Metro with a clean cache: `cd mobile && npx expo start --clear`.

**Port 8081 is already in use**
Another Metro server is still running. Stop it, or press <kbd>Y</kbd> when Expo offers another port.
