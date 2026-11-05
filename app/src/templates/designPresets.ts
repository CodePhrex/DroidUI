import { ComponentNode } from '../types/schema';

export type DesignPresetCategory = 'Complete Screens' | 'Component Kits' | 'Navigation' | 'Forms' | 'Cards & Content' | 'Premium Components';
export interface DesignPreset {
  id: string;
  name: string;
  category: DesignPresetCategory;
  description: string;
  styleName: string;
  node: ComponentNode;
}

const text = (id: string, value: string, size: number, color: string, weight: 'normal' | 'bold' = 'normal'): ComponentNode => ({
  id, type: 'Text', props: { text: value }, style: { fontSize: size, color, fontWeight: weight, marginBottom: 6 },
});
const button = (id: string, label: string, backgroundColor: string, color = '#ffffff'): ComponentNode => ({
  id, type: 'Button', props: { label }, style: { backgroundColor, color, paddingVertical: 13, paddingHorizontal: 16, borderRadius: 12, alignItems: 'center', marginVertical: 5 },
});
const card = (id: string, children: ComponentNode[], backgroundColor = '#ffffff', borderColor = '#e2e8f0'): ComponentNode => ({
  id, type: 'Card', style: { padding: 16, backgroundColor, borderRadius: 18, borderWidth: 1, borderColor, marginVertical: 7 }, children,
});
const input = (id: string, placeholder: string): ComponentNode => ({
  id, type: 'Input', props: { placeholder }, style: { backgroundColor: '#f1f5f9', color: '#0f172a', padding: 14, borderRadius: 11, borderWidth: 1, borderColor: '#cbd5e1', marginVertical: 5 },
});
const root = (id: string, children: ComponentNode[], backgroundColor = '#f8fafc'): ComponentNode => ({
  id, type: 'Container', style: { flexDirection: 'column', padding: 16, backgroundColor, borderRadius: 0, minHeight: 640 }, children,
});

export const DESIGN_PRESETS: DesignPreset[] = [
  {
    id: 'screen_finance_dashboard', name: 'Fintech Dashboard', category: 'Complete Screens',
    description: 'A polished finance overview with balance, quick actions, spending progress and recent activity.',
    styleName: 'Clean Fintech',
    node: root('finance_screen', [
      text('finance_greeting', 'Good morning, Alex', 14, '#64748b'),
      text('finance_heading', 'Your finances', 28, '#0f172a', 'bold'),
      card('finance_balance', [text('balance_label', 'TOTAL BALANCE', 11, '#cbd5e1', 'bold'), text('balance_value', '$24,680.50', 32, '#ffffff', 'bold'), text('balance_change', '+8.4% this month', 13, '#86efac')], '#172554', '#1e40af'),
      { id: 'finance_actions', type: 'Container', style: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 }, children: [
        button('finance_send', 'Send', '#2563eb'), button('finance_add', 'Add money', '#0f766e'), button('finance_more', 'More', '#475569'),
      ]},
      text('finance_activity_title', 'Spending overview', 19, '#0f172a', 'bold'),
      card('finance_spend', [text('spend_value', '$2,450 of $4,000', 21, '#0f172a', 'bold'), { id: 'finance_progress', type: 'ProgressBar', props: { label: 'Monthly budget', progress: 61, barColor: '#2563eb' }, style: {} }]),
      text('finance_recent_title', 'Recent activity', 19, '#0f172a', 'bold'),
      card('finance_tx_1', [text('tx1_name', 'Grocery Market', 14, '#0f172a', 'bold'), text('tx1_meta', 'Today · Shopping', 11, '#64748b'), text('tx1_amount', '-$84.25', 15, '#dc2626', 'bold')]),
      card('finance_tx_2', [text('tx2_name', 'Monthly salary', 14, '#0f172a', 'bold'), text('tx2_meta', 'Yesterday · Income', 11, '#64748b'), text('tx2_amount', '+$3,850.00', 15, '#059669', 'bold')]),
    ]),
  },
  {
    id: 'screen_storefront', name: 'Modern Storefront', category: 'Complete Screens',
    description: 'Shopping home screen with search, category chips, featured offer and product cards.',
    styleName: 'Commerce Light',
    node: root('store_screen', [
      text('store_brand', 'NOVA / STORE', 13, '#7c3aed', 'bold'),
      text('store_title', 'Discover your next favorite.', 27, '#18181b', 'bold'),
      input('store_search', 'Search products and brands'),
      { id: 'store_categories', type: 'Container', style: { flexDirection: 'row', gap: 7 }, children: [
        { id: 'cat_all', type: 'Badge', props: { text: 'All' }, style: { backgroundColor: '#7c3aed', padding: 9, borderRadius: 16 }},
        { id: 'cat_style', type: 'Badge', props: { text: 'Style' }, style: { backgroundColor: '#ede9fe', color: '#5b21b6', padding: 9, borderRadius: 16 }},
        { id: 'cat_tech', type: 'Badge', props: { text: 'Tech' }, style: { backgroundColor: '#ede9fe', color: '#5b21b6', padding: 9, borderRadius: 16 }},
      ]},
      card('store_feature', [text('store_feature_tag', 'LIMITED DROP', 10, '#ddd6fe', 'bold'), text('store_feature_title', 'The new season starts here.', 23, '#ffffff', 'bold'), text('store_feature_sub', 'Fresh picks selected for you.', 13, '#e9d5ff'), button('store_feature_cta', 'Explore collection', '#ffffff', '#5b21b6')], '#5b21b6', '#7c3aed'),
      text('store_products_title', 'Trending now', 20, '#18181b', 'bold'),
      { id: 'store_product_grid', type: 'Container', style: { flexDirection: 'row', gap: 10 }, children: [
        card('store_product_1', [text('product_1_emoji', '◈', 34, '#7c3aed', 'bold'), text('product_1_name', 'Studio Headphones', 13, '#18181b', 'bold'), text('product_1_price', '$129.00', 15, '#7c3aed', 'bold')], '#ffffff'),
        card('store_product_2', [text('product_2_emoji', '◇', 34, '#ea580c', 'bold'), text('product_2_name', 'Everyday Pack', 13, '#18181b', 'bold'), text('product_2_price', '$74.00', 15, '#7c3aed', 'bold')], '#ffffff'),
      ]},
    ]),
  },
  {
    id: 'screen_social_profile', name: 'Creator Profile', category: 'Complete Screens',
    description: 'Social creator profile with identity, follow action, statistics, bio and content tabs.',
    styleName: 'Creator Social',
    node: root('creator_profile', [
      text('profile_cover', '✦  CREATOR SPACE', 13, '#a78bfa', 'bold'),
      { id: 'profile_avatar', type: 'Icon', props: { iconSymbol: '◉' }, style: { fontSize: 58, color: '#7c3aed', alignSelf: 'center' }},
      text('profile_name', 'Jordan Rivera', 25, '#111827', 'bold'),
      text('profile_handle', '@jordan.creates', 13, '#7c3aed'),
      text('profile_bio', 'Designer, maker and visual storyteller. Sharing ideas in progress.', 14, '#4b5563'),
      button('profile_follow', '＋  Follow creator', '#7c3aed'),
      { id: 'profile_stats', type: 'Container', style: { flexDirection: 'row', justifyContent: 'space-around', padding: 12 }, children: [
        text('profile_posts', '128 Posts', 12, '#111827', 'bold'), text('profile_followers', '24.8K Followers', 12, '#111827', 'bold'), text('profile_following', '412 Following', 12, '#111827', 'bold'),
      ]},
      text('profile_content_heading', 'Latest creations', 19, '#111827', 'bold'),
      { id: 'profile_content', type: 'Container', style: { flexDirection: 'row', gap: 8 }, children: [
        card('profile_post_1', [text('post1', '✧', 32, '#7c3aed'), text('post1_caption', 'Visual study', 11, '#374151')]),
        card('profile_post_2', [text('post2', '◈', 32, '#0891b2'), text('post2_caption', 'New direction', 11, '#374151')]),
        card('profile_post_3', [text('post3', '✺', 32, '#ea580c'), text('post3_caption', 'Color play', 11, '#374151')]),
      ]},
    ]),
  },
  {
    id: 'screen_login', name: 'Premium Login & Signup', category: 'Complete Screens',
    description: 'Complete authentication screen with brand header, email/password fields, social sign-in placeholders and CTA.',
    styleName: 'Midnight Premium',
    node: root('auth_screen', [
      text('auth_mark', '✦  NORTHSTAR', 14, '#a5b4fc', 'bold'),
      text('auth_heading', 'Welcome back.', 31, '#ffffff', 'bold'),
      text('auth_subtitle', 'Sign in to continue to your workspace.', 14, '#94a3b8'),
      text('auth_email_label', 'EMAIL ADDRESS', 10, '#cbd5e1', 'bold'),
      input('auth_email', 'you@example.com'),
      text('auth_password_label', 'PASSWORD', 10, '#cbd5e1', 'bold'),
      input('auth_password', 'Enter your password'),
      text('auth_forgot', 'Forgot password?', 12, '#a5b4fc', 'bold'),
      button('auth_submit', 'Sign in', '#6366f1'),
      text('auth_or', '────────  OR CONTINUE WITH  ────────', 10, '#64748b'),
      button('auth_google', 'Continue with Google', '#334155'),
      text('auth_signup', "New here? Create an account", 13, '#c7d2fe'),
    ], '#0f172a'),
  },
  {
    id: 'screen_settings', name: 'Settings & Preferences', category: 'Complete Screens',
    description: 'Settings screen with grouped account, notification, privacy and support rows.',
    styleName: 'System Clean',
    node: root('settings_screen', [
      text('settings_title', 'Settings', 28, '#111827', 'bold'),
      text('settings_sub', 'Manage your account and app preferences.', 13, '#64748b'),
      text('settings_account', 'ACCOUNT', 11, '#2563eb', 'bold'),
      card('settings_account_card', [
        text('settings_profile', 'Personal information     ›', 15, '#111827', 'bold'),
        text('settings_security', 'Password & security       ›', 15, '#111827'),
        text('settings_devices', 'Connected devices         ›', 15, '#111827'),
      ]),
      text('settings_preferences', 'PREFERENCES', 11, '#2563eb', 'bold'),
      card('settings_preferences_card', [
        { id: 'settings_dark', type: 'Switch', props: { label: 'Dark appearance', value: false }, style: {} },
        { id: 'settings_push', type: 'Switch', props: { label: 'Push notifications', value: true }, style: {} },
        { id: 'settings_email', type: 'Switch', props: { label: 'Email updates', value: false }, style: {} },
      ]),
      text('settings_support', 'SUPPORT', 11, '#2563eb', 'bold'),
      card('settings_support_card', [text('settings_help', 'Help center                  ›', 14, '#111827'), text('settings_about', 'About this app               ›', 14, '#111827')]),
      button('settings_logout', 'Sign out', '#fee2e2', '#b91c1c'),
    ]),
  },
  {
    id: 'kit_app_header', name: 'Modern App Title Bar', category: 'Navigation',
    description: 'Reusable header with back affordance, title and action slot.',
    styleName: 'Soft Surface',
    node: { id: 'kit_header', type: 'Container', style: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' }, children: [
      text('header_back', '‹', 28, '#334155', 'bold'), text('header_title', 'Screen title', 18, '#0f172a', 'bold'), text('header_action', '⋯', 24, '#334155', 'bold'),
    ]},
  },
  {
    id: 'kit_search_field', name: 'Search Textbox', category: 'Forms',
    description: 'Rounded search field with search affordance and placeholder.',
    styleName: 'Soft Surface',
    node: { id: 'kit_search', type: 'Container', style: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, backgroundColor: '#f1f5f9', borderRadius: 14, borderWidth: 1, borderColor: '#cbd5e1' }, children: [
      text('search_icon', '⌕', 22, '#64748b'), { ...input('search_text', 'Search anything'), style: { flex: 1, borderWidth: 0, backgroundColor: 'transparent' } },
    ]},
  },
  {
    id: 'kit_input_group', name: 'Labeled Input Group', category: 'Forms',
    description: 'Label, editable field and helper text as a reusable form pattern.',
    styleName: 'Clean Form',
    node: { id: 'kit_input_group', type: 'Container', style: { padding: 10 }, children: [
      text('field_label', 'Email address', 12, '#334155', 'bold'), input('field_value', 'name@example.com'), text('field_hint', 'We will never share your email.', 11, '#64748b'),
    ]},
  },
  {
    id: 'kit_primary_button', name: 'Primary & Secondary Actions', category: 'Component Kits',
    description: 'Paired primary and secondary call-to-action buttons.',
    styleName: 'Action Set',
    node: { id: 'kit_actions', type: 'Container', style: { flexDirection: 'column', padding: 8 }, children: [
      button('kit_primary', 'Continue', '#2563eb'), { ...button('kit_secondary', 'Cancel', '#e2e8f0', '#334155'), style: { backgroundColor: '#e2e8f0', color: '#334155', padding: 12, borderRadius: 12, alignItems: 'center', marginVertical: 5 }},
    ]},
  },
  {
    id: 'kit_info_card', name: 'Rich Information Card', category: 'Cards & Content',
    description: 'Eyebrow, headline, supporting text and action in a styled card.',
    styleName: 'Elevated Card',
    node: card('kit_info', [text('info_eyebrow', 'FEATURED', 10, '#2563eb', 'bold'), text('info_heading', 'A clearer way to work.', 21, '#0f172a', 'bold'), text('info_body', 'Bring your tools and ideas together in one simple workspace.', 13, '#64748b'), button('info_action', 'Learn more', '#2563eb')]),
  },
  {
    id: 'kit_bottom_nav', name: 'Bottom Navigation Bar', category: 'Navigation',
    description: 'Four-item bottom navigation pattern with active destination.',
    styleName: 'Navigation Surface',
    node: { id: 'kit_bottom_nav', type: 'Container', style: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', padding: 12, backgroundColor: '#ffffff', borderTopWidth: 1, borderTopColor: '#e2e8f0' }, children: [
      text('nav_home', '⌂  Home', 11, '#2563eb', 'bold'), text('nav_search', '⌕  Search', 11, '#64748b'), text('nav_saved', '♡  Saved', 11, '#64748b'), text('nav_profile', '◉  Profile', 11, '#64748b'),
    ]},
  },
  {
    id: 'kit_glass_card', name: 'Glassmorphism Panel', category: 'Cards & Content',
    description: 'Translucent dark panel with subtle border and luminous accent.',
    styleName: 'Glass Dark',
    node: card('kit_glass', [text('glass_tag', 'INSIGHT', 10, '#67e8f9', 'bold'), text('glass_title', 'Your next idea starts here.', 21, '#ffffff', 'bold'), text('glass_body', 'A reusable glass-style panel for modern interfaces.', 13, '#cbd5e1')], 'rgba(15, 23, 42, 0.92)', '#475569'),
  },

  {
    id: 'premium_creator_hero', name: 'Creator Spotlight Hero', category: 'Premium Components',
    description: 'Editorial creator header with portrait placeholder, verification mark, stats and follow action.',
    styleName: 'Creator Spotlight',
    node: card('premium_creator_hero', [
      { id: 'creator_cover', type: 'Container', style: { height: 74, backgroundColor: '#312e81', borderRadius: 14, justifyContent: 'center', alignItems: 'center' }, children: [text('creator_cover_mark', '✦  CREATOR SPOTLIGHT', 11, '#e0e7ff', 'bold')] },
      { id: 'creator_identity', type: 'Container', style: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10 }, children: [
        { id: 'creator_avatar', type: 'Icon', props: { iconSymbol: '◉' }, style: { fontSize: 42, color: '#818cf8' } },
        { id: 'creator_name_group', type: 'Container', style: { flex: 1 }, children: [text('creator_name', 'Alex Morgan  ✓', 17, '#0f172a', 'bold'), text('creator_handle', '@alexcreates', 12, '#64748b')] },
      ]},
      text('creator_bio', 'Designer • storyteller • building what is next.', 13, '#475569'),
      { id: 'creator_stats', type: 'Container', style: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10 }, children: [text('creator_posts', '128 posts', 11, '#334155', 'bold'), text('creator_followers', '24.8K followers', 11, '#334155', 'bold'), text('creator_likes', '96K likes', 11, '#334155', 'bold')] },
      button('creator_follow_action', '＋ Follow creator', '#4f46e5'),
    ], '#ffffff', '#e0e7ff'),
  },
  {
    id: 'premium_pricing', name: 'SaaS Pricing Selector', category: 'Premium Components',
    description: 'Three-tier pricing presentation with a highlighted recommended plan.',
    styleName: 'Product Pricing',
    node: { id: 'premium_pricing', type: 'Container', style: { padding: 12, backgroundColor: '#f8fafc' }, children: [
      text('pricing_heading', 'Choose your plan', 23, '#0f172a', 'bold'),
      card('pricing_basic', [text('pricing_basic_name', 'STARTER', 11, '#64748b', 'bold'), text('pricing_basic_price', '$0 / month', 24, '#0f172a', 'bold'), text('pricing_basic_desc', 'Explore the essentials.', 12, '#64748b'), button('pricing_basic_cta', 'Get started', '#334155')]),
      card('pricing_pro', [text('pricing_pro_badge', 'MOST POPULAR', 10, '#c4b5fd', 'bold'), text('pricing_pro_name', 'PRO', 12, '#ffffff', 'bold'), text('pricing_pro_price', '$19 / month', 26, '#ffffff', 'bold'), text('pricing_pro_desc', 'More power for growing teams.', 12, '#e0e7ff'), button('pricing_pro_cta', 'Start free trial', '#8b5cf6')], '#312e81', '#6366f1'),
      card('pricing_team', [text('pricing_team_name', 'TEAM', 11, '#64748b', 'bold'), text('pricing_team_price', '$49 / month', 24, '#0f172a', 'bold'), text('pricing_team_desc', 'Collaboration at scale.', 12, '#64748b'), button('pricing_team_cta', 'Contact sales', '#0f766e')]),
    ]},
  },
  {
    id: 'premium_media_player', name: 'Media Player Card', category: 'Premium Components',
    description: 'Compact audio/video player treatment with cover placeholder, timeline and playback controls.',
    styleName: 'Media Studio',
    node: card('premium_media_player', [
      { id: 'media_cover', type: 'Container', style: { height: 110, backgroundColor: '#172554', borderRadius: 12, justifyContent: 'center', alignItems: 'center' }, children: [text('media_cover_symbol', '♫', 42, '#bfdbfe', 'bold')] },
      text('media_title', 'Midnight Sessions', 17, '#0f172a', 'bold'), text('media_artist', 'Original audio • 03:42', 11, '#64748b'),
      { id: 'media_progress', type: 'ProgressBar', props: { label: '01:24 / 03:42', progress: 38, barColor: '#6366f1' }, style: { marginVertical: 8 } },
      { id: 'media_controls', type: 'Container', style: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }, children: [text('media_prev', '◀◀', 16, '#475569'), text('media_play', '▶', 25, '#4f46e5', 'bold'), text('media_next', '▶▶', 16, '#475569')] },
    ]),
  },
  {
    id: 'premium_stats_glass', name: 'Glass Analytics KPI', category: 'Premium Components',
    description: 'Dark glass-inspired metric card with trend indicator, value and progress visualization.',
    styleName: 'Glass Analytics',
    node: card('premium_stats_glass', [
      text('stats_label', 'TOTAL REVENUE', 10, '#a5b4fc', 'bold'), text('stats_value', '$128,450', 30, '#ffffff', 'bold'),
      text('stats_trend', '↗  +18.6% vs last month', 12, '#6ee7b7', 'bold'),
      { id: 'stats_chart', type: 'Graph', props: { title: 'Performance trend', values: [24, 32, 28, 45, 42, 61, 74] }, style: { height: 90 } },
    ], '#111827', '#3730a3'),
  },
  {
    id: 'premium_notification', name: 'Smart Notification Toast', category: 'Premium Components',
    description: 'Compact notification with icon, message, timestamp and action affordance.',
    styleName: 'Notification Surface',
    node: card('premium_notification', [
      { id: 'notification_row', type: 'Container', style: { flexDirection: 'row', alignItems: 'center', gap: 10 }, children: [
        { id: 'notification_icon', type: 'Icon', props: { iconSymbol: '✦' }, style: { fontSize: 25, color: '#4f46e5' } },
        { id: 'notification_copy', type: 'Container', style: { flex: 1 }, children: [text('notification_title', 'Your design is ready', 13, '#0f172a', 'bold'), text('notification_body', 'Your latest export finished successfully.', 11, '#64748b')] },
        text('notification_time', 'now', 10, '#94a3b8'),
      ]},
      text('notification_action', 'View export  →', 11, '#4f46e5', 'bold'),
    ]),
  },
  {
    id: 'premium_profile_completion', name: 'Profile Completion Panel', category: 'Premium Components',
    description: 'Onboarding progress card with completion meter and next-step action.',
    styleName: 'Onboarding Pro',
    node: card('premium_profile_completion', [
      text('completion_label', 'YOUR WORKSPACE', 10, '#64748b', 'bold'), text('completion_title', 'Complete your profile', 19, '#0f172a', 'bold'),
      { id: 'completion_progress', type: 'ProgressBar', props: { label: '3 of 5 steps completed', progress: 60, barColor: '#0d9488' }, style: { marginVertical: 8 } },
      text('completion_tip', 'Add a profile image and connect your social accounts to finish setup.', 12, '#64748b'),
      button('completion_action', 'Continue setup', '#0f766e'),
    ]),
  },
  {
    id: 'premium_social_post', name: 'Social Post Composer', category: 'Premium Components',
    description: 'Social content composer with avatar, text entry placeholder, media action row and publish CTA.',
    styleName: 'Social Creator',
    node: card('premium_social_post', [
      { id: 'social_author', type: 'Container', style: { flexDirection: 'row', alignItems: 'center', gap: 8 }, children: [{ id: 'social_avatar', type: 'Icon', props: { iconSymbol: '◉' }, style: { fontSize: 32, color: '#7c3aed' } }, text('social_author_name', 'Your creator profile', 13, '#0f172a', 'bold')] },
      text('social_prompt', 'What would you like to share with your community?', 14, '#475569'),
      { id: 'social_media_actions', type: 'Container', style: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 8 }, children: [text('social_photo', '▧ Photo', 11, '#0d9488'), text('social_video', '▷ Video', 11, '#7c3aed'), text('social_tag', '@ Mention', 11, '#2563eb')] },
      button('social_publish', 'Prepare post', '#7c3aed'),
    ]),
  },
  {
    id: 'premium_feature_comparison', name: 'Feature Comparison Table', category: 'Premium Components',
    description: 'Plan comparison layout with feature rows and highlighted recommended tier.',
    styleName: 'Comparison Grid',
    node: card('premium_feature_comparison', [
      text('compare_title', 'Compare plans', 20, '#0f172a', 'bold'),
      { id: 'compare_header', type: 'Container', style: { flexDirection: 'row', justifyContent: 'space-between' }, children: [text('compare_feature', 'FEATURE', 10, '#64748b', 'bold'), text('compare_free', 'FREE', 10, '#64748b', 'bold'), text('compare_pro', 'PRO', 10, '#4f46e5', 'bold')] },
      ...['Projects          3       Unlimited','Cloud assets      —       ✓','Premium kits      —       ✓','Priority export   —       ✓'].map((line,i)=>text('compare_row_'+i,line,11,'#334155')),
      button('compare_action', 'Choose Pro', '#4f46e5'),
    ]),
  },

];

export const DESIGN_PRESET_CATEGORIES: DesignPresetCategory[] = ['Complete Screens', 'Component Kits', 'Navigation', 'Forms', 'Cards & Content', 'Premium Components'];
