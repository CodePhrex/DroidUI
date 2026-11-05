import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ComponentNode } from '../types/schema';
import { useEditorStore } from '../store/useEditorStore';

type Tokens = { primary: string; surface: string; canvas: string; text: string; muted: string; radius: number; spacing: number; fontSize: number };
const PRESETS: Array<{ name: string; tokens: Tokens }> = [
 { name:'Midnight Blue',tokens:{primary:'#3b82f6',surface:'#1e293b',canvas:'#0f172a',text:'#f8fafc',muted:'#94a3b8',radius:12,spacing:16,fontSize:16}},
 { name:'Emerald',tokens:{primary:'#10b981',surface:'#064e3b',canvas:'#022c22',text:'#ecfdf5',muted:'#a7f3d0',radius:14,spacing:16,fontSize:16}},
 { name:'Warm Editorial',tokens:{primary:'#b45309',surface:'#fffbeb',canvas:'#fef3c7',text:'#292524',muted:'#78716c',radius:8,spacing:20,fontSize:17}},
 { name:'Violet Glass',tokens:{primary:'#a78bfa',surface:'#272044',canvas:'#120d24',text:'#f5f3ff',muted:'#c4b5fd',radius:18,spacing:18,fontSize:16}}
];
const HEX=/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
const transformTree=(node:ComponentNode,t:Tokens):ComponentNode=>{
 const style:Record<string,any>={...node.style,borderRadius:t.radius};
 if(node.type==='Container'){style.backgroundColor=t.canvas;style.padding=t.spacing;}
 if(node.type==='Card'){style.backgroundColor=t.surface;style.padding=t.spacing;}
 if(node.type==='Button'||node.type==='Badge')style.backgroundColor=t.primary;
 if(node.type==='Text'){style.color=t.text;style.fontSize=t.fontSize;}
 if(node.type==='Input'){style.backgroundColor=t.surface;style.color=t.text;}
 return {...node,style,children:node.children?.map(child=>transformTree(child,t))};
};
export const DesignSystemStudio=()=>{
 const [tokens,setTokens]=useState<Tokens>(PRESETS[0].tokens);
 const [presetName,setPresetName]=useState(PRESETS[0].name);
 const valid=[tokens.primary,tokens.surface,tokens.canvas,tokens.text,tokens.muted].every(v=>HEX.test(v));
 const update=(key:keyof Tokens,value:string)=>setTokens(current=>({...current,[key]:['radius','spacing','fontSize'].includes(key)?Number(value):value}));
 const apply=()=>{
  if(!valid){Alert.alert('Invalid color','Use a valid 3- or 6-digit HEX color.');return;}
  if(!Number.isFinite(tokens.radius)||tokens.radius<0||tokens.radius>48||!Number.isFinite(tokens.spacing)||tokens.spacing<0||tokens.spacing>64||!Number.isFinite(tokens.fontSize)||tokens.fontSize<8||tokens.fontSize>48){Alert.alert('Invalid dimensions','Use radius 0–48, spacing 0–64, and font size 8–48.');return;}
  const state=useEditorStore.getState();
  useEditorStore.setState({history:[...state.history,state.rootNode],future:[],rootNode:transformTree(state.rootNode,tokens)});
  Alert.alert('Design system applied','Mapped component styles were updated. One Undo restores the previous canvas.');
 };
 const fields:Array<[keyof Tokens,string]>=[['primary','Primary / action'],['surface','Card / input surface'],['canvas','Container background'],['text','Primary text'],['muted','Secondary text']];
 return <ScrollView style={styles.container} contentContainerStyle={{paddingBottom:28}}>
  <Text style={styles.title}>Design System Studio</Text>
  <Text style={styles.help}>Create a consistent visual language, preview it, then explicitly apply it to the current screen. Mapped component colors and dimensions will be replaced; unrelated properties are preserved.</Text>
  <Text style={styles.heading}>Starter systems</Text><View style={styles.row}>{PRESETS.map(p=><TouchableOpacity key={p.name} onPress={()=>{setTokens(p.tokens);setPresetName(p.name);}} style={[styles.preset,presetName===p.name&&styles.selected]}><View style={styles.swatches}><View style={[styles.dot,{backgroundColor:p.tokens.canvas}]}/><View style={[styles.dot,{backgroundColor:p.tokens.primary}]}/><View style={[styles.dot,{backgroundColor:p.tokens.text}]}/></View><Text style={styles.presetText}>{p.name}</Text></TouchableOpacity>)}</View>
  <Text style={styles.heading}>Color tokens (HEX)</Text>{fields.map(([key,label])=><View key={key} style={styles.field}><Text style={styles.label}>{label}</Text><TextInput autoCapitalize="none" value={String(tokens[key])} onChangeText={v=>update(key,v)} style={styles.input}/><View style={[styles.sample,{backgroundColor:HEX.test(String(tokens[key]))?String(tokens[key]):'transparent'}]}/></View>)}
  <Text style={styles.heading}>Typography & shape</Text>{(['fontSize','radius','spacing'] as const).map(key=><View key={key} style={styles.field}><Text style={styles.label}>{key==='fontSize'?'Base text size':key==='radius'?'Corner radius':'Container padding'}</Text><TextInput keyboardType="numeric" value={String(tokens[key])} onChangeText={v=>update(key,v)} style={styles.input}/></View>)}
  <Text style={styles.heading}>Live token preview</Text><View style={[styles.preview,{backgroundColor:tokens.canvas,borderRadius:tokens.radius}]}><Text style={{color:tokens.text,fontSize:tokens.fontSize,fontWeight:'700'}}>Your screen title</Text><Text style={{color:tokens.muted,marginTop:4}}>Supporting text and descriptions</Text><View style={[styles.previewCard,{backgroundColor:tokens.surface,borderRadius:tokens.radius,padding:tokens.spacing}]}><Text style={{color:tokens.text}}>Content card</Text><View style={[styles.previewButton,{backgroundColor:tokens.primary,borderRadius:tokens.radius}]}><Text style={{color:'#ffffff',fontWeight:'700'}}>Primary action</Text></View></View></View>
  <TouchableOpacity disabled={!valid} onPress={apply} style={[styles.apply,!valid&&{opacity:0.4}]}><Text style={styles.applyText}>Apply design system to current canvas</Text></TouchableOpacity>
  <Text style={styles.note}>Mapping: Container = canvas; Card = surface; Button and Badge = primary; Input = surface and text; Text = primary text and base size. All mapped nodes receive the selected corner radius. Save or export the project to preserve applied styles.</Text>
 </ScrollView>;
};
const styles=StyleSheet.create({container:{padding:14},title:{fontSize:18,fontWeight:'800',color:'#f8fafc'},help:{fontSize:11,lineHeight:17,color:'#94a3b8',marginTop:6,marginBottom:14},heading:{fontSize:13,fontWeight:'700',color:'#38bdf8',marginTop:14,marginBottom:8},row:{flexDirection:'row',flexWrap:'wrap',gap:8},preset:{width:'48%',padding:10,borderRadius:8,borderWidth:1,borderColor:'#475569',backgroundColor:'#1e293b'},selected:{borderColor:'#3b82f6',borderWidth:2},swatches:{flexDirection:'row',gap:6,marginBottom:7},dot:{width:18,height:18,borderRadius:9,borderWidth:1,borderColor:'#64748b'},presetText:{fontSize:11,color:'#f8fafc',fontWeight:'600'},field:{flexDirection:'row',alignItems:'center',gap:8,marginBottom:8},label:{flex:1,fontSize:11,color:'#cbd5e1'},input:{width:104,backgroundColor:'#0f172a',color:'#f8fafc',padding:8,borderRadius:6,borderWidth:1,borderColor:'#475569',fontSize:12},sample:{width:28,height:28,borderRadius:6,borderWidth:1,borderColor:'#64748b'},preview:{padding:14,borderWidth:1,borderColor:'#475569',marginTop:4},previewCard:{marginTop:12},previewButton:{alignSelf:'flex-start',paddingHorizontal:14,paddingVertical:9,marginTop:12},apply:{marginTop:16,padding:13,backgroundColor:'#2563eb',borderRadius:8,alignItems:'center'},applyText:{color:'#fff',fontSize:12,fontWeight:'800'},note:{fontSize:10,color:'#94a3b8',lineHeight:15,marginTop:8}});
