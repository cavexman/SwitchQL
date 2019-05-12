const Store = require("electron-store");

const appSettingsStore = new Store();

function LoadSettings() {
  if (appSettingsStore.size === 0) {
    SaveSettings(
      (defaultSettings = {
        databaseTimeout: 10000
      })
    );
  }
}

function SaveSettings(settingsData) {
  for (const setting of Object.keys(settingsData)) {
    appSettingsStore.set(setting, settingsData[setting]);
  }
}

module.exports = { LoadSettings, SaveSettings, appSettingsStore };
