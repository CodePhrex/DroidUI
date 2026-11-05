'use strict';

const { withAndroidColors } = require('@expo/config-plugins');

module.exports = function withAndroidSplashBackground(config) {
  return withAndroidColors(config, (modConfig) => {
    const resources = modConfig.modResults.resources || {};
    const colors = Array.isArray(resources.color) ? resources.color : [];
    const existing = colors.find(
      (resource) => resource.$ && resource.$.name === 'splashscreen_background'
    );

    if (existing) {
      existing._ = '#0B1020';
    } else {
      colors.push({
        $: { name: 'splashscreen_background' },
        _: '#0B1020'
      });
    }

    resources.color = colors;
    modConfig.modResults.resources = resources;
    return modConfig;
  });
};
