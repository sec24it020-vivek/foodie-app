import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { C } from './theme';
import { RECIPES } from './recipes';
import { useApp } from './AppContext';
import { Thumb } from './RecipeCard';

const Stat = ({ icon, label, value }) => (
  <View style={styles.stat}>
    <Ionicons name={icon} size={20} color={C.accent} />
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

export default function RecipeDetailScreen({ route }) {
  const { favorites, toggleFavorite, myRecipes } = useApp();
  const recipe = [...RECIPES, ...myRecipes].find((r) => r.id === route.params.id);
  if (!recipe) return <Text style={{ padding: 24 }}>This recipe no longer exists.</Text>;
  const fav = favorites.includes(recipe.id);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ padding: 16 }}>
      <View style={{ alignItems: 'center' }}><Thumb recipe={recipe} size={220} radius={20} /></View>
      <View style={styles.titleRow}>
        <Text style={styles.title}>{recipe.name}</Text>
        <TouchableOpacity onPress={() => toggleFavorite(recipe.id)} hitSlop={10}>
          <Ionicons name={fav ? 'heart' : 'heart-outline'} size={30} color={C.accent} />
        </TouchableOpacity>
      </View>

      <View style={styles.stats}>
        <Stat icon="time-outline" label="Prep time" value={recipe.time} />
        <Stat icon="people-outline" label="Servings" value={recipe.servings} />
        <Stat icon="flame-outline" label="Calories" value={`${recipe.calories} kcal`} />
        <Stat icon="speedometer-outline" label="Difficulty" value={recipe.difficulty} />
      </View>

      <Text style={styles.h2}>Ingredients</Text>
      {recipe.ingredients.map((i, n) => <Text key={n} style={styles.line}>•  {i}</Text>)}

      <Text style={styles.h2}>Instructions</Text>
      {recipe.instructions.map((s, n) => (
        <View key={n} style={{ flexDirection: 'row', marginBottom: 10 }}>
          <Text style={styles.stepNo}>{n + 1}</Text>
          <Text style={[styles.line, { flex: 1, marginBottom: 0 }]}>{s}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 16 },
  title: { fontSize: 26, fontWeight: '800', color: C.ink, flex: 1, paddingRight: 8 },
  stats: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 16, backgroundColor: C.card, borderRadius: 16, borderWidth: 1, borderColor: C.line, paddingVertical: 8 },
  stat: { width: '50%', alignItems: 'center', paddingVertical: 10 },
  statValue: { fontWeight: '700', color: C.ink, marginTop: 4 },
  statLabel: { color: C.muted, fontSize: 12 },
  h2: { fontSize: 20, fontWeight: '800', color: C.ink, marginTop: 24, marginBottom: 10 },
  line: { fontSize: 16, color: C.ink, lineHeight: 23, marginBottom: 6 },
  stepNo: { width: 26, height: 26, borderRadius: 13, backgroundColor: C.gold, textAlign: 'center', lineHeight: 26, fontWeight: '800', color: C.ink, marginRight: 10, overflow: 'hidden' },
});
