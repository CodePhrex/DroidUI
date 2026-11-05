import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { detectCurrentDeviceProfile, DetectedDeviceProfile } from '../device/deviceProfile';
import { useEditorStore } from '../store/useEditorStore';

export function DeviceDetectionStudio({ onDetected }: { onDetected?: () => void }) {
  const [profile, setProfile] = useState<DetectedDeviceProfile | null>(null);
  const [status, setStatus] = useState('Not detected yet');
  const createTemplate = () => {
    try {
      const detected = profile || detectCurrentDeviceProfile();
      const { createNewProject, addChildNode, updateStyle, updateProps } = useEditorStore.getState();
      const name = `${detected.brand} ${detected.modelName} Design`.trim();
      createNewProject(name);
      const rootId = useEditorStore.getState().rootNode.id;
      updateStyle(rootId, { width: detected.widthDp, minHeight: detected.heightDp, padding: 16, backgroundColor: '#0b1220' });
      addChildNode(rootId, 'Text');
      const headingId = useEditorStore.getState().selectedNodeId;
      if (headingId) {
        updateProps(headingId, { text: name });
        updateStyle(headingId, { fontSize: 22, fontWeight: '700', color: '#f8fafc', marginBottom: 12 });
      }
      addChildNode(rootId, 'Text');
      const captionId = useEditorStore.getState().selectedNodeId;
      if (captionId) {
        updateProps(captionId, { text: `${detected.widthDp} × ${detected.heightDp} dp · ${detected.pixelRatio}x density` });
        updateStyle(captionId, { fontSize: 12, color: '#94a3b8' });
      }
      setStatus('Template created in the editor');
      Alert.alert('Design template created', `A new project sized for ${detected.modelName} is ready. Save it to keep it.`);
    } catch (error) {
      Alert.alert('Template creation failed', error instanceof Error ? error.message : String(error));
    }
  };
  const detect = () => {
    const next = detectCurrentDeviceProfile();
    setProfile(next);
    setStatus('Device profile detected');\n    onDetected?.();
  };
  return <View style={s.root}>
    <View style={s.hero}><Text style={s.kicker}>DEVICE INTELLIGENCE</Text><Text style={s.title}>Detect & Design</Text><Text style={s.copy}>Read the current Android device identity and live display metrics, then create a project canvas sized to its available screen in dp.</Text>
      <TouchableOpacity style={s.primary} onPress={detect}><Text style={s.primaryText}>⌕  Detect This Device</Text></TouchableOpacity>
    </View>
    {profile ? <View style={s.card}>
      <View style={s.row}><Text style={s.label}>DEVICE</Text><Text style={s.value}>{profile.brand} {profile.modelName}</Text></View>
      <View style={s.row}><Text style={s.label}>MANUFACTURER</Text><Text style={s.value}>{profile.manufacturer}</Text></View>
      <View style={s.row}><Text style={s.label}>MODEL ID</Text><Text style={s.value}>{profile.modelId}</Text></View>
      <View style={s.row}><Text style={s.label}>ANDROID / OS</Text><Text style={s.value}>{profile.osVersion}</Text></View>
      <View style={s.row}><Text style={s.label}>AVAILABLE WINDOW</Text><Text style={s.value}>{profile.widthDp} × {profile.heightDp} dp</Text></View>
      <View style={s.row}><Text style={s.label}>SCREEN PIXELS</Text><Text style={s.value}>{profile.widthPx} × {profile.heightPx} px</Text></View>
      <View style={s.row}><Text style={s.label}>PIXEL DENSITY</Text><Text style={s.value}>{profile.pixelRatio}x</Text></View>
      <View style={s.row}><Text style={s.label}>DEVICE TYPE</Text><Text style={s.value}>{profile.deviceType}</Text></View>
      <TouchableOpacity style={s.primary} onPress={createTemplate}><Text style={s.primaryText}>＋  Create Design Template</Text></TouchableOpacity>
    </View> : <View style={s.empty}><Text style={s.emptyIcon}>▣</Text><Text style={s.emptyTitle}>No device profile yet</Text><Text style={s.copy}>Tap Detect This Device to inspect model information and screen dimensions.</Text></View>}
    <Text style={s.status}>{status}</Text>
    <Text style={s.note}>Detection uses device metadata plus React Native window/screen metrics. Available window dp is the recommended initial design canvas; physical pixels are shown separately. Foldables and multi-window layouts should be re-detected when the display configuration changes.</Text>
  </View>;
}
const s=StyleSheet.create({root:{flex:1,backgroundColor:'#0b1220',padding:14},hero:{backgroundColor:'#14243a',borderColor:'#2b4564',borderWidth:1,borderRadius:16,padding:16,marginBottom:12},kicker:{color:'#38bdf8',fontSize:10,fontWeight:'900',letterSpacing:1.5},title:{color:'#f8fafc',fontSize:23,fontWeight:'900',marginTop:6},copy:{color:'#9aacc4',fontSize:12,lineHeight:18,marginTop:7},primary:{backgroundColor:'#2563eb',borderRadius:10,padding:13,alignItems:'center',marginTop:14},primaryText:{color:'#fff',fontWeight:'900',fontSize:12},card:{backgroundColor:'#15243a',borderColor:'#2c405a',borderWidth:1,borderRadius:14,padding:14},row:{paddingVertical:8,borderBottomWidth:1,borderBottomColor:'#283a52'},label:{color:'#8295ae',fontSize:9,fontWeight:'900',letterSpacing:1},value:{color:'#f1f5f9',fontSize:12,fontWeight:'700',marginTop:3},empty:{alignItems:'center',padding:30,backgroundColor:'#14243a',borderRadius:14,borderWidth:1,borderColor:'#2b405c'},emptyIcon:{fontSize:34,color:'#38bdf8'},emptyTitle:{fontSize:15,fontWeight:'800',color:'#fff',marginTop:8},status:{color:'#38bdf8',fontSize:11,fontWeight:'700',marginTop:12},note:{color:'#71839b',fontSize:10,lineHeight:16,marginTop:14}});
