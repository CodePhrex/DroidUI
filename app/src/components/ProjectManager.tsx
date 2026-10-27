import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { useEditorStore } from '../store/useEditorStore';

export const ProjectManager = () => {
  const {
    currentProjectId,
    currentProjectName,
    savedProjects,
    saveCurrentProject,
    loadProject,
    refreshProjectList,
    deleteProject,
    createNewProject
  } = useEditorStore();

  const [projectNameInput, setProjectNameInput] = useState(currentProjectName);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    refreshProjectList();
  }, []);

  useEffect(() => {
    setProjectNameInput(currentProjectName);
  }, [currentProjectName]);

  const handleSave = async () => {
    setIsSaving(true);
    await saveCurrentProject(projectNameInput);
    setIsSaving(false);
    Alert.alert('Project Saved', `"${projectNameInput}" was saved to local storage.`);
  };

  const handleCreateNew = () => {
    createNewProject('Untitled UI Design');
    setProjectNameInput('Untitled UI Design');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Workspace Project Manager</Text>
      <Text style={styles.subtitle}>Save & load local UI design projects on device</Text>

      {/* Save Active Project Section */}
      <View style={styles.card}>
        <Text style={styles.cardHeader}>Active Workspace Project</Text>
        <TextInput
          style={styles.textInput}
          value={projectNameInput}
          onChangeText={setProjectNameInput}
          placeholder="Project Name"
          placeholderTextColor="#64748b"
        />
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={isSaving}>
            <Text style={styles.btnText}>{isSaving ? 'Saving...' : '💾 Save Project'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.newBtn} onPress={handleCreateNew}>
            <Text style={styles.btnText}>➕ New Design</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Saved Projects List */}
      <Text style={styles.sectionHeader}>Saved Local Projects ({savedProjects.length})</Text>
      <ScrollView style={styles.projectList}>
        {savedProjects.length === 0 ? (
          <Text style={styles.emptyText}>No saved projects found on device.</Text>
        ) : (
          savedProjects.map((p) => {
            const isActive = p.id === currentProjectId;
            return (
              <View key={p.id} style={[styles.projectRow, isActive && styles.activeProjectRow]}>
                <TouchableOpacity style={styles.projectInfo} onPress={() => loadProject(p.id)}>
                  <Text style={styles.projectName}>{p.name} {isActive && '(Active)'}</Text>
                  <Text style={styles.projectMeta}>
                    Nodes: {p.nodeCount} | Updated: {new Date(p.updatedAt).toLocaleDateString()}
                  </Text>
                </TouchableOpacity>
                <View style={styles.projectActions}>
                  <TouchableOpacity style={styles.loadBtn} onPress={() => loadProject(p.id)}>
                    <Text style={styles.actionText}>Load</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteBtn} onPress={() => deleteProject(p.id)}>
                    <Text style={styles.actionText}>✕</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#1e293b',
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 16,
  },
  cardHeader: {
    fontSize: 13,
    fontWeight: '600',
    color: '#cbd5e1',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#0f172a',
    color: '#f8fafc',
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#475569',
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  saveBtn: {
    flex: 1,
    backgroundColor: '#3b82f6',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  newBtn: {
    backgroundColor: '#334155',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  btnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#e2e8f0',
    marginBottom: 8,
  },
  projectList: {
    maxHeight: 280,
  },
  emptyText: {
    color: '#64748b',
    fontSize: 12,
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 20,
  },
  projectRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  activeProjectRow: {
    borderColor: '#3b82f6',
    backgroundColor: '#1e293b',
  },
  projectInfo: {
    flex: 1,
  },
  projectName: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#f8fafc',
  },
  projectMeta: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
  },
  projectActions: {
    flexDirection: 'row',
    gap: 6,
  },
  loadBtn: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
  },
  deleteBtn: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 4,
  },
  actionText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 'bold',
  },
});
