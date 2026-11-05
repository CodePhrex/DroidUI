'use strict';

const { AndroidConfig, withAndroidColors } = require('@expo/config-plugins');

module.exports = function withAndroidSplashBackground(config) {
  return withAndroidColors(config, (modConfig) => {
    modConfig.modResults = AndroidConfig.Colors.assignColorValue(
      modConfig.modResults,
      { name: 'splashscreen_background', value: '#080D1F' }
    );
    return modConfig;
  });
};
