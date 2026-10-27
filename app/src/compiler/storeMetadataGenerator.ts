import { ComponentNode } from '../types/schema';

export interface StoreListingConfig {
  appName: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  supportEmail: string;
  privacyPolicyUrl: string;
  targetAudience: string;
}

export const generateStoreListingText = (rootNode: ComponentNode, config?: Partial<StoreListingConfig>): string => {
  const appName = config?.appName || 'My Android App';
  const shortDesc = config?.shortDescription || 'A powerful, sleek Android application built for performance.';
  const category = config?.category || 'Tools & Productivity';
  const supportEmail = config?.supportEmail || 'support@example.com';
  const privacyUrl = config?.privacyPolicyUrl || 'https://example.com/privacy';

  return `====================================================================
GOOGLE PLAY STORE LISTING METADATA
====================================================================

1. APP TITLE (Max 30 characters):
--------------------------------------------------------------------
${appName.slice(0, 30)}

2. SHORT DESCRIPTION (Max 80 characters):
--------------------------------------------------------------------
${shortDesc.slice(0, 80)}

3. FULL DESCRIPTION (Max 4,000 characters):
--------------------------------------------------------------------
Welcome to ${appName} — your ultimate companion for modern mobile productivity!

Designed with high performance, intuitive Material 3 design tokens, and smooth user interactions, ${appName} provides an effortless experience tailored for all Android devices.

🌟 KEY FEATURES:
• Sleek & Intuitive Interface: Optimized for phone, tablet, and foldable displays.
• Fast & Responsive: Built with modern native rendering architectures.
• Accessible for Everyone: Full TalkBack screen reader support and customizable contrast themes.
• Multi-Language Support: Global translation dictionaries built right in.
• Secure & Private: Complete data privacy with zero unauthorized data tracking.

DOWNLOAD ${appName.toUpperCase()} TODAY AND ELEVATE YOUR MOBILE EXPERIENCE!

--------------------------------------------------------------------
4. CATEGORY & STORE CLASSIFICATION:
• Primary Category: ${category}
• Target Audience Age Rating: Everyone (3+)
• Contains Ads: No
• In-App Purchases: No

5. CONTACT & COMPLIANCE URLS:
• Support Email: ${supportEmail}
• Privacy Policy URL: ${privacyUrl}
====================================================================
`;
};

export const generatePrivacyPolicyMarkdown = (appName = 'My Android App', companyName = 'App Studio'): string => {
  return `# PRIVACY POLICY FOR ${appName.toUpperCase()}

**Effective Date:** ${new Date().toISOString().split('T')[0]}  
**Publisher:** ${companyName}  

---

## 1. Overview
At **${companyName}**, accessible from our application **${appName}**, one of our main priorities is the privacy of our visitors. This Privacy Policy document outlines the types of information that is collected and recorded by ${appName} and how we use it.

## 2. Information We Collect
${appName} is designed to operate locally on your device with minimal data transmission.

* **Local Storage & Preferences:** Project files, application settings, and customized user preferences are saved locally on your device via secure system storage.
* **Device & Hardware Information:** Minimal non-identifiable device architecture parameters (such as screen aspect ratio and Android OS version) are used strictly for local layout rendering.
* **No Unauthorized Personal Tracking:** We do not track, harvest, or sell personal identifiers, location data, or contact lists.

## 3. How We Use Your Information
The local information processed by ${appName} is used solely to:
- Provide, operate, and maintain application functionality.
- Save and restore user project state across sessions.
- Ensure optimal layout scaling across phone, tablet, and foldable screens.

## 4. Third-Party Services
${appName} may utilize standard platform libraries (such as Google Play Services and Expo Runtime) which may collect non-personally identifiable diagnostic logs for stability.

## 5. Security & Data Protection
We value your trust in providing us your information, and we strive to use commercially acceptable means of protecting it locally on your Android device.

## 6. Children's Privacy
${appName} does not knowingly collect any Personal Identifiable Information from children under the age of 13.

## 7. Contact Us
If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.

* **Email:** support@example.com  
* **Website:** https://example.com/support  
`;
};
