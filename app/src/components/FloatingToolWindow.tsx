import React, { useMemo, useRef } from 'react';
import { Animated, Modal, PanResponder, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  visible: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
}

/** A draggable, always-on-top utility window for the mobile studio workspace. */
export const FloatingToolWindow: React.FC<Props> = ({ visible, title, subtitle, onClose, children }) => {
  const position = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const responder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => false,
    onMoveShouldSetPanResponder: (_event, gesture) => Math.abs(gesture.dx) > 3 || Math.abs(gesture.dy) > 3,
    onPanResponderGrant: () => {
      position.extractOffset();
    },
    onPanResponderMove: Animated.event([null, { dx: position.x, dy: position.y }], { useNativeDriver: false }),
    onPanResponderRelease: () => {
      position.flattenOffset();
    },
  }), [position]);

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Animated.View style={[styles.window, { transform: position.getTranslateTransform() }]}>
          <View style={styles.titleBar} {...responder.panHandlers}>
            <View style={styles.grip}><View style={styles.gripLine} /></View>
            <View style={styles.heading}>
              <Text style={styles.eyebrow}>DROIDUI • FLOATING STUDIO</Text>
              <Text style={styles.title}>{title}</Text>
              {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            </View>
            <TouchableOpacity onPress={onClose} style={styles.close}><Text style={styles.closeText}>×</Text></TouchableOpacity>
          </View>
          <View style={styles.content}>{children}</View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(3,8,22,0.48)', justifyContent: 'center', alignItems: 'center', padding: 12 },
  window: { width: '100%', maxWidth: 560, height: '76%', backgroundColor: '#0D1730', borderRadius: 18, borderWidth: 1, borderColor: '#3A5E96', overflow: 'hidden', elevation: 28, shadowColor: '#000', shadowOpacity: 0.4, shadowRadius: 24 },
  titleBar: { minHeight: 68, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 13, backgroundColor: '#142442', borderBottomWidth: 1, borderBottomColor: '#2B4269' },
  grip: { width: 22, height: 38, justifyContent: 'center', marginRight: 8 },
  gripLine: { width: 4, height: 25, borderRadius: 3, backgroundColor: '#5276A9' },
  heading: { flex: 1 },
  eyebrow: { color: '#38E8F2', fontSize: 8, fontWeight: '900', letterSpacing: 1.3 },
  title: { color: '#F4F7FF', fontSize: 15, fontWeight: '900', marginTop: 2 },
  subtitle: { color: '#9AADD6', fontSize: 9, marginTop: 2 },
  close: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#253B61', alignItems: 'center', justifyContent: 'center' },
  closeText: { color: '#F4F7FF', fontSize: 24, lineHeight: 27 },
  content: { flex: 1 },
});
