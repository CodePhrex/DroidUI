export interface DeepLinkRoute {
  path: string;
  screenName: string;
  params: string[];
  description: string;
}

export const DEFAULT_DEEP_LINK_ROUTES: DeepLinkRoute[] = [
  { path: 'home', screenName: 'HomeScreen', params: [], description: 'Main application dashboard' },
  { path: 'catalog/:id', screenName: 'CatalogDetailScreen', params: ['id'], description: 'Direct link to catalog item detail' },
  { path: 'cart', screenName: 'CartScreen', params: [], description: 'Direct access to shopping cart' },
  { path: 'settings/account', screenName: 'AccountSettingsScreen', params: [], description: 'Direct access to account settings' },
];

export const generateAndroidManifestIntentFilters = (schemeName = 'droidui', domainHost = 'example.com'): string => {
  return `<!-- AndroidManifest.xml Intent Filters for Deep Linking -->
<activity
    android:name=".MainActivity"
    android:exported="true"
    android:launchMode="singleTask">

    <!-- Standard Launcher Intent -->
    <intent-filter>
        <action android:name="android.intent.action.MAIN" />
        <category android:name="android.intent.category.LAUNCHER" />
    </intent-filter>

    <!-- Custom URI Scheme (e.g., ${schemeName}://catalog/123) -->
    <intent-filter android:autoVerify="true">
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />

        <data android:scheme="${schemeName}" />
    </intent-filter>

    <!-- App Links HTTPS Domain Association (https://${domainHost}/...) -->
    <intent-filter android:autoVerify="true">
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />

        <data android:scheme="https" android:host="${domainHost}" />
    </intent-filter>
</activity>`;
};

export const generateExpoLinkingConfig = (schemeName = 'droidui', domainHost = 'example.com'): string => {
  return `// Expo Linking Configuration (src/navigation/linking.ts)
import * as Linking from 'expo-linking';

export const linkingConfig = {
  prefixes: [
    Linking.createURL('/'),
    '${schemeName}://',
    'https://${domainHost}',
  ],
  config: {
    screens: {
      Home: 'home',
      CatalogDetail: 'catalog/:id',
      Cart: 'cart',
      AccountSettings: 'settings/account',
    },
  },
};
`;
};

export const generateAppJsonIconConfig = (schemeName = 'droidui', domainHost = 'example.com'): string => {
  return `// app.json Configuration with Adaptive App Icons & Schemes
{
  "expo": {
    "name": "DroidUI Mobile App",
    "slug": "droidui-mobile-app",
    "scheme": "${schemeName}",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#0f172a"
    },
    "android": {
      "package": "com.droidui.app",
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#0f172a"
      },
      "intentFilters": [
        {
          "action": "VIEW",
          "autoVerify": true,
          "data": [
            { "scheme": "${schemeName}" },
            { "scheme": "https", "host": "${domainHost}" }
          ],
          "category": ["BROWSABLE", "DEFAULT"]
        }
      ]
    }
  }
}
`;
};
