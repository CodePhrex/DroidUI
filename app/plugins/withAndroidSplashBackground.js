'use strict';

const { withAndroidColors } = require('@expo/config-plugins');

module.exports = function withAndroidSplashBackground(config) {
  return withAndroidColors(config, (modConfig) => {
    const resources = modConfig.modResults.resources || [];
    const existing = resources.find(
      (resource) => resource.$ && resource.$.name === 'splashscreen_background'
    );

    if (existing) {
      existing._ = '#0B1020';
    } else {
      resources.push({
        $: { name: 'splashscreen_background' },
        _: '#0B1020'
      });
    }

    modConfig.modResults.resources = resources;
    return modConfig;
  });
};
