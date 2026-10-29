import React, { useState, useLayoutEffect } from 'react';
import { View, Text, ScrollView, FlatList, TouchableOpacity, Alert, Platform, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { C } from './theme';
import { CATEGORIES, RECIPES } from './recipes';
import { useApp } from './AppContext';
import RecipeCard from './RecipeCard';

const BAR = ['All', ...CATEGORIES, 'My Food'];

export default function HomeScreen({ navigation }) {
  const [cat, setCat] = useState('All');
  const { myRecipes, deleteRecipe } = useApp();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('Favorites')} style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="heart" size={20} color={C.accent} />
          <Text style={{ color: C.accent, fontWeight: '700', marginLeft: 4 }}>Favorites</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const confirmDelete = (r) => {
    if (Platform.OS === 'web') {
      if (window.confirm(`Delete "${r.name}"?`)) deleteRecipe(r.id);
    } else {
      Alert.alert('Delete recipe', `Delete "${r.name}"?`, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteRecipe(r.id) },
      ]);
    }
  };

  const open = (r) => navigation.navigate('RecipeDetail', { id: r.id });
  const isMine = cat === 'My Food';
  const data = isMine ? myRecipes : cat === 'All' ? RECIPES : RECIPES.filter((r) => r.category === cat);

  return (
    <View style={styles.screen}>
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.bar}>
          {BAR.map((c) => (
            <TouchableOpacity key={c} onPress={() => setCat(c)} style={[styles.chip, cat === c && styles.chipOn]}>
              <Text style={[styles.chipText, cat === c && { color: '#fff' }]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={data}
        keyExtractor={(r) => r.id}
        contentContainerStyle={{ padding: 16 }}
        ListHeaderComponent={
          isMine ? (
            <View>
              <TouchableOpacity style={styles.addBtn} onPress={() => navigation.navigate('RecipeForm')}>
                <Ionicons name="add-circle" size={22} color="#fff" />
                <Text style={styles.addText}>Add New Recipe</Text>
              </TouchableOpacity>
              <Text style={styles.section}>My Recipes</Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          <Text style={styles.empty}>
            {isMine ? 'No recipes yet. Tap “Add New Recipe” to create your first one.' : 'No recipes in this category yet.'}
          </Text>
        }
        renderItem={({ item }) => (
          <RecipeCard recipe={item} onPress={() => open(item)}>
            {isMine && (
              <View style={styles.actions}>
                <TouchableOpacity style={styles.edit} onPress={() => navigation.navigate('RecipeForm', { id: item.id })}>
                  <Ionicons name="create-outline" size={16} color={C.ink} /><Text style={styles.actionText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.del} onPress={() => confirmDelete(item)}>
                  <Ionicons name="trash-outline" size={16} color="#fff" /><Text style={[styles.actionText, { color: '#fff' }]}>Delete</Text>
                </TouchableOpacity>
              </View>
            )}
          </RecipeCard>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg },
  bar: { paddingHorizontal: 12, paddingVertical: 12 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: C.card, borderWidth: 1, borderColor: C.line, marginRight: 8 },
  chipOn: { backgroundColor: C.accent, borderColor: C.accent },
  chipText: { color: C.ink, fontWeight: '600' },
  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: C.accent, padding: 14, borderRadius: 14 },
  addText: { color: '#fff', fontWeight: '700', fontSize: 16, marginLeft: 8 },
  section: { fontSize: 20, fontWeight: '800', color: C.ink, marginTop: 20, marginBottom: 12 },
  empty: { textAlign: 'center', color: C.muted, marginTop: 40, paddingHorizontal: 24 },
  actions: { flexDirection: 'row', marginTop: 12 },
  edit: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, backgroundColor: C.accentSoft, marginRight: 8 },
  del: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, backgroundColor: '#B3261E' },
  actionText: { marginLeft: 6, fontWeight: '700', color: C.ink },
});
