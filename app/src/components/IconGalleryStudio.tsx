import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons, Ionicons, Feather, FontAwesome5, AntDesign } from '@expo/vector-icons';
import { useEditorStore } from '../store/useEditorStore';

type IconFamily = 'MaterialCommunityIcons' | 'MaterialIcons' | 'Ionicons' | 'Feather' | 'FontAwesome5' | 'AntDesign';
type IconItem = { name: string; tags: string };
const FAMILIES: { id: IconFamily; label: string; Icon: any; names: string[] }[] = [
  { id:'MaterialCommunityIcons', label:'Material Community', Icon:MaterialCommunityIcons, names:[
    'home','home-outline','account','account-circle','account-group','account-multiple','account-cog','menu','dots-horizontal','dots-vertical','arrow-left','arrow-right','arrow-up','arrow-down','chevron-left','chevron-right','chevron-up','chevron-down','close','check','plus','minus','pencil','delete','trash-can','content-save','folder','folder-open','file','file-document','file-code','magnify','filter','sort','tune','cog','wrench','tools','bell','bell-outline','heart','heart-outline','star','star-outline','bookmark','bookmark-outline','share-variant','link','open-in-new','download','upload','cloud','cloud-upload','cloud-download','image','image-multiple','camera','video','play','pause','stop','volume-high','volume-low','volume-off','microphone','music','headphones','palette','brush','vector-square','shape','layers','view-grid','view-list','grid','apps','cellphone','tablet','laptop','monitor','television','watch','battery','battery-charging','wifi','bluetooth','signal','bluetooth-connect','lock','lock-open','shield','shield-check','key','fingerprint','eye','eye-off','lightbulb','flash','flashlight','rocket','creation','auto-fix','magic-staff','fire','lightning-bolt','check-circle','alert-circle','alert','information','help-circle','clock','calendar','timer','map-marker','map','compass','navigation','crosshairs-gps','cart','basket','shopping','credit-card','cash','wallet','gift','trophy','medal','chart-bar','chart-line','chart-pie','trending-up','web','earth','email','message','chat','forum','phone','contacts','calendar-check','clipboard','clipboard-list','printer','qrcode','barcode','code-json','xml','database','server','api','bug','test-tube','cloud-check','refresh','sync','history','undo','redo','fullscreen','fullscreen-exit','magnify-plus','magnify-minus','gesture-tap','gesture-pinch','gesture-swipe','drag','cursor-move','target','crosshairs','format-text','format-bold','format-italic','format-color-text','format-size','border-color','opacity','rotate-right','rotate-left','crop','resize','ruler','ruler-square','ruler-square-compass','vector-line','animation','motion-play','timer-sand','progress-clock'
  ]},
  { id:'MaterialIcons', label:'Material', Icon:MaterialIcons, names:['home','search','settings','person','people','menu','close','add','remove','edit','delete','check','arrow_back','arrow_forward','notifications','favorite','star','share','camera_alt','image','videocam','play_arrow','pause','stop','volume_up','mic','shopping_cart','payment','place','map','phone_android','tablet_android','laptop','watch','wifi','bluetooth','battery_full','lock','security','cloud','download','upload','refresh','info','warning','error','help','calendar_today','access_time','bar_chart','pie_chart','code','dashboard','widgets','view_quilt','apps','palette','brush','layers','animation','tune']},
  { id:'Ionicons', label:'Ionicons', Icon:Ionicons, names:['home','home-outline','person','person-outline','people','menu','close','add','remove','search','settings','heart','heart-outline','star','star-outline','notifications','camera','image','videocam','play','pause','stop','volume-high','mic','cart','card','location','map','phone-portrait','tablet-portrait','laptop','watch','wifi','bluetooth','battery-full','lock-closed','shield-checkmark','cloud','download','cloud-upload','refresh','information-circle','alert-circle','calendar','time','stats-chart','grid','apps','color-palette','layers','code-slash']},
  { id:'Feather', label:'Feather', Icon:Feather, names:['home','user','users','menu','x','plus','minus','search','settings','heart','star','bell','camera','image','video','play','pause','volume-2','mic','shopping-cart','map-pin','map','smartphone','tablet','monitor','watch','wifi','bluetooth','battery','lock','shield','cloud','download','upload','refresh-cw','info','alert-circle','calendar','clock','bar-chart-2','pie-chart','grid','layers','code','edit-2','trash-2','share-2','link','eye','eye-off','move','maximize','minimize','sliders','zap']},
  { id:'FontAwesome5', label:'Font Awesome', Icon:FontAwesome5, names:['home','user','users','bars','times','plus','minus','search','cog','heart','star','bell','camera','image','video','play','pause','volume-up','microphone','shopping-cart','map-marker-alt','map','mobile-alt','tablet-alt','laptop','clock','wifi','bluetooth','battery-full','lock','shield-alt','cloud','download','upload','sync','info-circle','exclamation-triangle','calendar','chart-bar','chart-pie','th-large','layer-group','code','edit','trash','share-alt','eye','palette','magic','rocket']},
  { id:'AntDesign', label:'Ant Design', Icon:AntDesign, names:['home','user','team','menu','close','plus','minus','search','setting','heart','star','bell','camera','picture','video-camera','play-circle','pause-circle','sound','shopping-cart','environment','mobile','tablet','laptop','wifi','lock','safety','cloud','download','upload','reload','info-circle','warning','calendar','clock-circle','bar-chart','pie-chart','appstore','appstore-o','code','edit','delete','share-alt','eye','skin','rocket']
  }
];

export function IconGalleryStudio() {
  const { selectedNodeId, rootNode, addChildNode, updateProps } = useEditorStore();
  const [family, setFamily] = useState<IconFamily>('MaterialCommunityIcons');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [iconColor, setIconColor] = useState('#38bdf8');
  const [iconSize, setIconSize] = useState('28');
  const current = FAMILIES.find(f => f.id === family)!;
  const filtered = useMemo(() => current.names.filter(n => n.toLowerCase().includes(query.trim().toLowerCase())), [current, query]);
  const apply = (name: string) => {
    setSelected(name);
    const props = { iconName: name, iconLibrary: family, iconSymbol: name };
    const style = { color: iconColor, fontSize: Math.max(8, Math.min(128, Number(iconSize) || 28)) };
    const findNode = (node: any, id: string): any => node.id === id ? node : (node.children || []).map((child: any) => findNode(child, id)).find(Boolean);
    const selectedNode = selectedNodeId ? findNode(rootNode, selectedNodeId) : null;
    const parentId = selectedNode && selectedNode.type !== 'Icon' ? selectedNode.id : rootNode.id;
    if (selectedNode?.type === 'Icon') {
      updateProps(selectedNode.id, props);
      useEditorStore.getState().updateStyle(selectedNode.id, style);
      return;
    }
    addChildNode(parentId, 'Icon');
    const id = useEditorStore.getState().selectedNodeId;
    if (id) {
      useEditorStore.getState().updateProps(id, props);
      useEditorStore.getState().updateStyle(id, style);
    }
  };
  return <ScrollView style={s.root} contentContainerStyle={s.content}>
    <View style={s.hero}><Text style={s.eyebrow}>DROIDUI ASSET WORKSPACE</Text><Text style={s.title}>Icon Gallery</Text><Text style={s.subtitle}>Browse, preview and apply scalable vector icons to your selected component.</Text></View>
    <TextInput value={query} onChangeText={setQuery} placeholder="Search 300+ icon names…" placeholderTextColor="#8292aa" style={s.search}/>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.familyRow}>
      {FAMILIES.map(f=><TouchableOpacity key={f.id} onPress={()=>{setFamily(f.id);setQuery('');}} style={[s.family,f.id===family&&s.familyActive]}><Text style={[s.familyText,f.id===family&&s.familyTextActive]}>{f.label}</Text></TouchableOpacity>)}
    </ScrollView>
    <View style={s.previewCard}>
      <View style={s.previewIcon}>{selected ? <current.Icon name={selected as never} size={Number(iconSize)||28} color={iconColor}/> : <MaterialCommunityIcons name="gesture-tap" size={30} color={iconColor}/>}</View>
      <View style={{flex:1}}><Text style={s.previewTitle}>{selected || 'Choose an icon'}</Text><Text style={s.previewMeta}>{family} · {filtered.length} results</Text></View>
      <TouchableOpacity style={s.apply} onPress={()=>selected&&apply(selected)} disabled={!selected}><Text style={s.applyText}>Apply</Text></TouchableOpacity>
    </View>
    <View style={s.customRow}>
      <View style={{flex:1}}><Text style={s.fieldLabel}>ICON COLOR</Text><TextInput value={iconColor} onChangeText={setIconColor} style={s.field} autoCapitalize="none"/></View>
      <View style={{width:88}}><Text style={s.fieldLabel}>SIZE (DP)</Text><TextInput value={iconSize} onChangeText={setIconSize} keyboardType="numeric" style={s.field}/></View>
    </View>
    <Text style={s.section}>{current.label} <Text style={s.count}>({filtered.length})</Text></Text>
    <View style={s.grid}>{filtered.map(name=><TouchableOpacity key={name} onPress={()=>setSelected(name)} style={[s.tile,selected===name&&s.tileSelected]}><current.Icon name={name as never} size={25} color={selected===name?'#fff':iconColor}/><Text style={s.iconLabel} numberOfLines={1}>{name.replace(/-/g,' ')}</Text></TouchableOpacity>)}</View>
    {!filtered.length&&<Text style={s.empty}>No icons match that search.</Text>}
    <Text style={s.footnote}>Icon fonts are bundled with the app. Selected icon family, name, size and color are stored as component properties. Confirm font licensing and export mappings before shipping generated projects.</Text>
  </ScrollView>;
}
const s=StyleSheet.create({
 root:{flex:1,backgroundColor:'#0b1220'},content:{padding:16,paddingBottom:32},hero:{padding:16,backgroundColor:'#15243a',borderWidth:1,borderColor:'#263b57',borderRadius:16,marginBottom:14},eyebrow:{fontSize:10,fontWeight:'800',letterSpacing:1.6,color:'#38bdf8'},title:{fontSize:24,fontWeight:'800',color:'#f8fafc',marginTop:5},subtitle:{fontSize:12,color:'#9fb0c7',marginTop:5,lineHeight:18},search:{backgroundColor:'#162338',borderColor:'#34465f',borderWidth:1,borderRadius:11,paddingHorizontal:14,paddingVertical:11,color:'#fff',marginBottom:10},familyRow:{gap:8,paddingBottom:12},family:{paddingHorizontal:13,paddingVertical:9,backgroundColor:'#17253a',borderRadius:20,borderWidth:1,borderColor:'#33445c'},familyActive:{backgroundColor:'#1d4ed8',borderColor:'#60a5fa'},familyText:{fontSize:11,color:'#b6c4d7',fontWeight:'700'},familyTextActive:{color:'#fff'},previewCard:{flexDirection:'row',alignItems:'center',gap:12,padding:12,backgroundColor:'#17263c',borderRadius:14,borderWidth:1,borderColor:'#314760'},previewIcon:{width:56,height:56,backgroundColor:'#0b1424',borderRadius:12,alignItems:'center',justifyContent:'center'},previewTitle:{fontSize:13,fontWeight:'800',color:'#fff'},previewMeta:{fontSize:10,color:'#94a3b8',marginTop:3},apply:{backgroundColor:'#2563eb',paddingHorizontal:14,paddingVertical:9,borderRadius:9},applyText:{color:'#fff',fontWeight:'800',fontSize:11},customRow:{flexDirection:'row',gap:10,marginTop:12,marginBottom:14},fieldLabel:{fontSize:9,color:'#8292aa',fontWeight:'800',letterSpacing:1,marginBottom:5},field:{backgroundColor:'#162338',borderColor:'#34465f',borderWidth:1,borderRadius:8,paddingHorizontal:10,paddingVertical:8,color:'#fff',fontSize:12},section:{fontSize:13,fontWeight:'800',color:'#e5edf8',marginBottom:10},count:{color:'#7f91aa',fontWeight:'500'},grid:{flexDirection:'row',flexWrap:'wrap',gap:8},tile:{width:'23%',minHeight:76,backgroundColor:'#15243a',borderWidth:1,borderColor:'#2c405a',borderRadius:11,alignItems:'center',justifyContent:'center',padding:6},tileSelected:{backgroundColor:'#1d4ed8',borderColor:'#60a5fa'},iconLabel:{fontSize:9,color:'#aebbd0',marginTop:6,textAlign:'center'},empty:{color:'#9fb0c7',textAlign:'center',padding:20},footnote:{fontSize:10,color:'#71839b',lineHeight:16,marginTop:18}
});
