# 🎨 AI Image Editor Chat - Cloud Edition

Ein 100% Cloud-basierter Bildbearbeitungs-Chat, der Puter.js nutzt. Erstelle, bearbeite und analysiere Bilder direkt im Browser.

## 🚀 Features

- **Bildbearbeitung:** Hintergründe entfernen, Objekte ändern, Virtual Try-On.
- **Drag & Drop:** Einfaches Hochladen von Bildern.
- **PWA Support:** Installierbar auf Desktop und Smartphone.
- **Dark/Light Mode:** Umschaltbares Design.
- **Zero Cost für Entwickler:** Nutzt das User-Pays-Modell von Puter.js.
- **Downloads:** Bearbeitete Bilder direkt herunterladen.

## 🛠️ Installation & Start

### Lokal ausführen:
```bash
npm install
npm run build
npm start
```
Öffne http://localhost:3000

### Deployment:
Einfach auf Render.com oder einem anderen Cloud-Provider deployen. Die App benötigt kaum Ressourcen, da die KI-Logik im Frontend läuft.

## 📝 Verwendung

1. Melde dich mit deinem Puter-Account an (oben links).
2. Ziehe ein Bild in das Fenster oder klicke auf die Upload-Zone.
3. Gib eine Anweisung ein, z.B. "Entferne den Hintergrund" oder "Mache den Himmel lila".
4. Lade das Ergebnis herunter.

## 📱 Android-App (Leichtgewichtiger Build)

Du kannst die App direkt über die Kommandozeile in eine Android-APK verwandeln:

1. **Voraussetzung:** Java (JDK) und Android SDK müssen auf deinem Laptop installiert sein.
2. **Build ausführen:**
   ```bash
   npm run android:build
   ```
3. **APK finden:** Die fertige Datei liegt nach dem Build hier:
   `android/app/build/outputs/apk/debug/app-debug.apk`

Alternativ kannst du das Projekt in Android Studio öffnen:
```bash
npm run android:open
```

---
**Erstellt mit ❤️ und Puter.js**
