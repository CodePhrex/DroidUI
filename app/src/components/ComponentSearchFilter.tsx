import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useEditorStore } from '../store/useEditorStore';
import { ComponentNode } from '../types/schema';

type FilterType = 'ALL' | 'Container' | 'Text' | 'Button' | 'Input' | 'Media';

export const ComponentSearchFilter = () => {
  const { rootNode, selectedNodeId, selectNode } = useEditorStore();
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');

  // Flatten component tree to searchable nodes array
  const getAllNodes = (node: ComponentNode, path = 'Root'): Array<{ node: ComponentNode; path: string }> => {
    let list: Array<{ node: ComponentNode; path: string }> = [{ node, path }];
    if (node.children) {
      node.children.forEach((child) => {
        list = list.concat(getAllNodes(child, `${path} > ${node.id}`));
      });
    }
    return list;
  };

  const allNodes = getAllNodes(rootNode);

  const filteredNodes = allNodes.filter(({ node }) => {
    // Category Filter
    if (activeFilter === 'Container' && node.type !== 'Container') return false;
    if (activeFilter === 'Text' && node.type !== 'Text') return false;
    if (activeFilter === 'Button' && node.type !== 'Button') return false;
    if (activeFilter === 'Input' && node.type !== 'Input') return false;
    if (activeFilter === 'Media' && node.type !== 'Image' && node.type !== 'Icon') return false;

    // Search Query Matching
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    const idMatch = node.id.toLowerCase().includes(q);
    const typeMatch = node.type.toLowerCase().includes(q);
    const labelMatch = node.props?.label?.toLowerCase().includes(q) || node.props?.text?.toLowerCase().includes(q);
    return idMatch || typeMatch || labelMatch;
  });

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>UI Component Search & Filter</Text>

      {/* Search Input Bar */}
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search components by ID, label, or type..."
          placeholderTextColor="#64748b"
          value={query}
          onChangeText={setQuery}
        />
        {query.length > 0 && (
          <TouchableOpacity style={styles.clearBtn} onPress={() => setQuery('')}>
            <Text style={styles.clearBtnText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Category Chips */}
      <View style={styles.filterRow}>
        {(['ALL', 'Container', 'Text', 'Button', 'Input', 'Media'] as FilterType[]).map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[styles.filterChip, activeFilter === filter && styles.activeChip]}
            onPress={() => setActiveFilter(filter)}
          >
            <Text style={[styles.filterChipText, activeFilter === filter && styles.activeChipText]}>
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Search Results Count */}
      <Text style={styles.resultsCount}>
        Found {filteredNodes.length} matching node{filteredNodes.length === 1 ? '' : 's'}
      </Text>

      {/* Search Results List */}
      <ScrollView style={styles.resultsList}>
        {filteredNodes.map(({ node, path }) => {
          const isSelected = selectedNodeId === node.id;
          return (
            <TouchableOpacity
              key={node.id}
              style={[styles.resultItem, isSelected && styles.selectedResultItem]}
              onPress={() => selectNode(node.id)}
            >
              <View style={styles.resultHeader}>
                <Text style={styles.resultTypeBadge}>[{node.type}]</Text>
                <Text style={styles.resultId}>{node.id}</Text>
              </View>

              {node.props?.label || node.props?.text ? (
                <Text style={styles.resultSnippet}>
                  "{node.props.label || node.props.text}"
                </Text>
              ) : null}

              <Text style={styles.resultPath}>{path}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: '#0f172a' },
  headerTitle: { fontSize: 14, fontWeight: 'bold', color: '#f8fafc', marginBottom: 8 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e293b', borderRadius: 8, paddingHorizontal: 10, borderWidth: 1, borderColor: '#334155', marginBottom: 8 },
  searchInput: { flex: 1, color: '#f8fafc', paddingVertical: 8, fontSize: 12 },
  clearBtn: { padding: 4 },
  clearBtnText: { color: '#94a3b8', fontSize: 12, fontWeight: 'bold' },
  filterRow: { flexDirection: 'row', gap: 6, marginBottom: 8, flexWrap: 'wrap' },
  filterChip: { backgroundColor: '#1e293b', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, borderWidth: 1, borderColor: '#334155' },
  activeChip: { backgroundColor: '#3b82f6', borderColor: '#3b82f6' },
  filterChipText: { color: '#94a3b8', fontSize: 10, fontWeight: 'bold' },
  activeChipText: { color: '#ffffff' },
  resultsCount: { fontSize: 10, color: '#64748b', marginBottom: 8, fontWeight: '600' },
  resultsList: { flex: 1 },
  resultItem: { backgroundColor: '#1e293b', padding: 10, borderRadius: 8, marginBottom: 6, borderWidth: 1, borderColor: '#334155' },
  selectedResultItem: { borderColor: '#3b82f6', backgroundColor: '#1e3a8a' },
  resultHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  resultTypeBadge: { color: '#38bdf8', fontSize: 10, fontWeight: 'bold' },
  resultId: { color: '#f8fafc', fontSize: 12, fontWeight: 'bold' },
  resultSnippet: { color: '#94a3b8', fontSize: 11, fontStyle: 'italic', marginTop: 2 },
  resultPath: { color: '#64748b', fontSize: 9, marginTop: 4 },
});
