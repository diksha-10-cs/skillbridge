# 🚀 SkillBridge - Quick Run Guide (Visual Studio Code)

SkillBridge is pre-configured for **zero-friction 1-click execution** in Visual Studio Code.

---

## ⚡ Super Easy Ways to Run

### Method 1: Just Press `F5` (Easiest & Automatic)
1. Open this project in **Visual Studio Code**.
2. Press **<kbd>F5</kbd>** on your keyboard.
3. ✨ **Done!** Both Backend & Frontend start automatically, and your default web browser opens directly to `http://localhost:5173`.

---

### Method 2: Click "Play ▶" in VS Code Sidebar (No Typing)
1. In VS Code, look at the bottom of the left file explorer sidebar for the **NPM SCRIPTS** panel.
2. Hover over **`start`** (or **`dev`**) and click the **Play ▶** button.
3. Both servers will start immediately in the integrated terminal.

---

### Method 3: One-Key Shortcut `<Ctrl> + <Shift> + <B>`
1. Inside VS Code, press:
   <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>B</kbd>
2. The full-stack build task starts both the Express API and Vite React frontend concurrently.

---

### Method 4: Double-Click `RUN_PROJECT.bat` (No VS Code Required)
1. Open the project folder in Windows Explorer:
   `F:\Mini Projectt\SkillBridgee`
2. Double-click on **`RUN_PROJECT.bat`**.
3. It checks MongoDB, starts both servers, and opens `http://localhost:5173` in your browser automatically!

---

### Method 5: Integrated Terminal
Open the terminal in VS Code (<kbd>Ctrl</kbd> + <kbd>`</kbd>) and type:
```bash
npm start
```
*(or simply `npm run dev`)*

---

## 🌐 URLs & Ports
- **Frontend App**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000](http://localhost:5000)
- **API Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)
- **Database**: `mongodb://127.0.0.1:27017/skillbridge`

---

## 📱 How to Open on Mobile or Share with Mentor (Without GitHub)

### Option A: On the Same Wi-Fi / Mobile Hotspot (Instant & Free)
1. Connect your phone and laptop to the **same Wi-Fi network** (or connect your laptop to your phone's mobile hotspot).
2. Start the project (`RUN_PROJECT.bat` or `npm start`).
3. In the terminal window, Vite displays a **Network** address:
   ```
   ➜  Network: http://192.168.X.X:5173/
   ```
4. Type that exact `http://192.168.X.X:5173` URL into Chrome/Safari on your mobile phone!

### Option B: Generate a Public Internet Link (Works Anywhere)
1. Make sure your app is running.
2. Double-click **`SHARE_ON_MOBILE.bat`** (or run `ssh -p 443 -R0:localhost:5173 a.pinggy.io` or `npx localtunnel --port 5173`).
3. Copy the generated `https://...` link and send it to your mentor or open it on your phone via mobile data.

