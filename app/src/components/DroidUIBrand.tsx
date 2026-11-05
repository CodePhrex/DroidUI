import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, Stop } from 'react-native-svg';

const BRAND = { navy: '#080D1F', blue: '#398BFF', cyan: '#38E8F2', violet: '#9065FF', white: '#F4F7FF' };

export const BrandMark: React.FC<{ size?: number; showWordmark?: boolean; compact?: boolean }> = ({ size = 42, showWordmark = true, compact = false }) => (
  <View style={styles.brandRow}>
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Defs>
        <LinearGradient id="droidBlue" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={BRAND.cyan} />
          <Stop offset="52%" stopColor={BRAND.blue} />
          <Stop offset="100%" stopColor={BRAND.violet} />
        </LinearGradient>
      </Defs>
      <Path d="M50 5 91 28 91 72 50 95 9 72 9 28Z" fill="#101A36" stroke="url(#droidBlue)" strokeWidth="4" />
      <Path d="M31 25h38a10 10 0 0 1 10 10v29a10 10 0 0 1-10 10H31a10 10 0 0 1-10-10V35a10 10 0 0 1 10-10Z" fill="url(#droidBlue)" />
      <Path d="M39 18 32 9M61 18l7-9" stroke={BRAND.cyan} strokeWidth="4" strokeLinecap="round" />
      <Circle cx="39" cy="46" r="4" fill="#081126" />
      <Circle cx="61" cy="46" r="4" fill="#081126" />
      <Path d="M38 60q12 10 24 0" fill="none" stroke="#081126" strokeWidth="4" strokeLinecap="round" />
      <Path d="M50 77v10" stroke={BRAND.cyan} strokeWidth="3" strokeLinecap="round" />
    </Svg>
    {showWordmark && <View style={styles.wordmarkWrap}>
      <Text style={[styles.wordmark, compact && styles.compactWordmark]}>Droid<Text style={styles.wordmarkAccent}>UI</Text></Text>
      {!compact && <Text style={styles.wordmarkCaption}>DESIGN • BUILD • INSPIRE</Text>}
    </View>}
  </View>
);

export const BrandSplash: React.FC<{ onFinish?: () => void }> = ({ onFinish }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.82)).current;
  const glow = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 420, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        Animated.delay(1250),
        Animated.timing(opacity, { toValue: 0, duration: 420, easing: Easing.in(Easing.cubic), useNativeDriver: true })
      ]),
      Animated.spring(scale, { toValue: 1, speed: 1.5, bounciness: 8, useNativeDriver: true }),
      Animated.sequence([
        Animated.timing(glow, { toValue: 1, duration: 650, useNativeDriver: true }),
        Animated.timing(glow, { toValue: 0.45, duration: 700, useNativeDriver: true })
      ])
    ]).start(({ finished }) => { if (finished) onFinish?.(); });
  }, [opacity, scale, glow, onFinish]);

  return (
    <Animated.View pointerEvents="none" style={[styles.splash, { opacity }]}>
      <Animated.View style={[styles.orb, { opacity: glow, transform: [{ scale }] }]} />
      <Animated.View style={{ alignItems: 'center', transform: [{ scale }] }}>
        <BrandMark size={112} showWordmark={false} />
        <Text style={styles.splashTitle}>Droid<Text style={styles.splashAccent}>UI</Text></Text>
        <Text style={styles.splashTagline}>DESIGN • BUILD • INSPIRE</Text>
        <View style={styles.progressTrack}><View style={styles.progressFill} /></View>
      </Animated.View>
      <Text style={styles.splashFooter}>YOUR CREATIVE WORKSPACE</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  wordmarkWrap: { justifyContent: 'center' },
  wordmark: { color: BRAND.white, fontSize: 20, fontWeight: '900', letterSpacing: -0.6 },
  compactWordmark: { fontSize: 17 },
  wordmarkAccent: { color: BRAND.cyan },
  wordmarkCaption: { color: '#8DA4D0', fontSize: 7, fontWeight: '800', letterSpacing: 1.7, marginTop: 1 },
  splash: { ...StyleSheet.absoluteFillObject, zIndex: 9999, elevation: 30, backgroundColor: BRAND.navy, alignItems: 'center', justifyContent: 'center' },
  orb: { position: 'absolute', width: 260, height: 260, borderRadius: 130, backgroundColor: '#2357B9', shadowColor: BRAND.cyan, shadowOpacity: 0.8, shadowRadius: 60, elevation: 20 },
  splashTitle: { color: BRAND.white, fontSize: 42, fontWeight: '900', letterSpacing: -1.5, marginTop: 16 },
  splashAccent: { color: BRAND.cyan },
  splashTagline: { color: '#A7B8E2', fontSize: 10, fontWeight: '800', letterSpacing: 3, marginTop: 8 },
  progressTrack: { width: 128, height: 3, borderRadius: 3, backgroundColor: '#263454', overflow: 'hidden', marginTop: 34 },
  progressFill: { width: '72%', height: 3, backgroundColor: BRAND.cyan, borderRadius: 3 },
  splashFooter: { position: 'absolute', bottom: 42, color: '#6E82B1', fontSize: 9, fontWeight: '700', letterSpacing: 2.2 }
});
