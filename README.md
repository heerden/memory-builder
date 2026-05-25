# Memory Builder 2.0 🧠

A beautiful, responsive memory training game built with **React**, **TypeScript**, **Vite**, and **Capacitor** for seamless deployment on Web, Android, and iOS.

---

## 🚀 Features
* **Modern Refactored Core**: Completely migrated from Angular to an idiomatic, lightweight React 19 + TypeScript 6 context architecture.
* **Pixel-Perfect Aesthetics**: Styled with the Bulma CSS framework, offering vibrant layouts and premium responsive designs.
* **Offline Cross-Platform Support**: Powered by Capacitor v6, supporting native compilation on Android and iOS devices.
* **Custom Stable Drag & Drop**: Native HTML5 Drag and Drop events featuring custom hover state colors and zero visual layout shifts.
* **Progress Persistence**: Automatically loads and saves your active score progress and game settings configurations to `localStorage`.

---

## 🛠️ Technology Stack
* **Core Framework**: React 19 & React DOM 19
* **Language & Typings**: TypeScript 6
* **Build System & Dev Server**: Vite 8
* **Styling Framework**: Bulma CSS 1.0
* **Mobile Runtime Wrapper**: Capacitor 6 (Android & iOS)

---

## 💻 Prerequisites
* **Node.js**: `node >= v24.16.0`
* **Package Manager**: `npm`

---

## 📦 Installation & Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Local Development Server**:
   Launches the ultra-fast Vite dev server locally at `http://localhost:5173/`:
   ```bash
   npm run dev
   ```

3. **Production Web Compilation**:
   Generates production-ready, minified static HTML, CSS, and JS bundles to the `dist/` directory:
   ```bash
   npm run build
   ```

---

## 📱 Mobile Platforms (Capacitor Workflow)

Before running Capacitor commands, make sure you have successfully compiled the production assets using `npm run build`.

1. **Synchronize Web Assets to Native Platforms**:
   Copies web assets to Android/iOS shells and updates native plugins/dependencies:
   ```bash
   npx cap sync
   ```

2. **Open iOS Project in Xcode**:
   ```bash
   npx cap open ios
   ```

3. **Open Android Project in Android Studio**:
   ```bash
   npx cap open android
   ```

---

## 🧪 Testing Architecture & Code Coverage

### Developer Test Commands

* **Run Interactive Watch Mode**:
  ```bash
  npm run test
  ```
* **Run CI Pipeline Suite**:
  ```bash
  npm run test:run
  ```
* **Generate Code Coverage Report**:
  ```bash
  npm run test:coverage
  ```
  **Interactive HTML Reports**
```bash
# Open interactive report (macOS)
open coverage/index.html
```

### Code Coverage Matrix

Executing a full V8 coverage report (`npm run test:coverage`) compiles the following metrics across the game's core modules:

| Metric Type | Coverage Score | Covered Logic Areas |
| :--- | :--- | :--- |
| **Statements** | 🟢 **87.25%** | Core settings wrappers, round increments, grid generators, action callbacks |
| **Branches** | 🟡 **51.80%** | State-driven round paths, drop operations, and evaluation branches |
| **Functions** | 🟢 **100.00%** | Full constructor logic, reducer-like context boundaries, hook exporters |
| **Lines** | 🟢 **88.15%** | Complete state-updating logic pipelines |

> [!NOTE]  
> The remaining branch gaps reside inside `localStorage` safety boundaries (catch-blocks handling storage-full quotas or private browser mode blockages) and assertions detecting provider boundary calls outside React nodes.

## 🔍 Debugging

### Checking the Console
Open your browser's developer tools (usually by pressing **F12**) and navigate to the **Console** tab.
* **[i] INFO**: General information about game state.
* **[✅] CORRECT**: Successful round completions.
* **[❌] WRONG**: Errors or incorrect choices.
* **[⚠] WARN**: Important messages or warnings.

### View LocalStorage
You can also check the game's `localStorage` to verify settings and score persistence:
1. Open your browser's developer tools.
2. Go to the **Application** tab (in Chrome/Edge) or **Storage** tab (in Firefox).
3. Select **Local Storage** from the sidebar.
4. Look for keys starting with `memory_` to see game settings and scores.
