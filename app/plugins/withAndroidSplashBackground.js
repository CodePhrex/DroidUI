'use strict';

const { AndroidConfig, withAndroidColors } = require('@expo/config-plugins');

const SPLASH_BACKGROUND_COLOR = '#080D1F';
const SPLASH_BACKGROUND_RESOURCE = 'splashscreen_background';

module.exports = function withAndroidSplashBackground(config) {
  return withAndroidColors(config, (modConfig) => {
    modConfig.modResults = AndroidConfig.Colors.assignColorValue(
      modConfig.modResults,
      {
        name: SPLASH_BACKGROUND_RESOURCE,
        value: SPLASH_BACKGROUND_COLOR
      }
    );

    return modConfig;
  });
};
