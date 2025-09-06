# 📱 Building an Android APK with Expo EAS

## 1. Install EAS CLI
Make sure the correct CLI is installed (not `eas@0.1.0`).
```bash
npm install -g eas-cli
````

Verify installation:

```bash
eas --version
```

---

## 2. Log in to Expo

```bash
eas login
```

* Use your Expo account (create one if needed).

---

## 3. Configure your project

Run this once in your project folder:

```bash
eas build:configure
```

This will:

* Create/update `eas.json`
* Set up Android/iOS build profiles

---

## 4. Prebuild (if using custom native code)

```bash
npx expo prebuild
```

If you’re using a **managed Expo app**, you can skip this.

---

## 5. Build an APK (Preview build)

```bash
eas build -p android --profile preview --local
```

* `-p android` → target platform
* `--profile preview` → uses the `preview` config from `eas.json`
* `--local` → builds directly on your computer (no cloud credits needed)

📂 The APK will be in:

```
./build-output/android/
```

---

## 6. Build an APK (Cloud build)

If you want Expo servers to build it:

```bash
eas build -p android --profile preview
```

* Wait for Expo servers to finish the build.
* Download the `.apk` or `.aab` file from the Expo dashboard.

---

## 7. Install on your Android device

* Transfer the `.apk` file to your phone.
* Tap it and allow installation from unknown sources.
* Done ✅

---

## 8. Common profiles (`eas.json`)

Example `eas.json`:

```json
{
  "build": {
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "distribution": "store",
      "android": {
        "buildType": "aab"
      }
    }
  }
}
```

* **preview** → creates an `.apk` (easy to sideload & test)
* **production** → creates an `.aab` (needed for Play Store upload)

---

## 9. Useful commands

* Start local dev server:

  ```bash
  npx expo start
  ```
* Clean builds:

  ```bash
  eas build:clean
  ```
* Help:

  ```bash
  eas build --help
  ```

