import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { C } from './theme';
import { useApp } from './AppContext';

export function Thumb({ recipe, size = 64, radius = 12 }) {
  const s = { width: size, height: size, borderRadius: radius };
  return recipe.image ? (
    <Image source={{ uri: recipe.image }} style={s} />
  ) : (
    <View style={[s, styles.emojiBox]}><Text style={{ fontSize: size * 0.5 }}>{recipe.emoji || '🍽️'}</Text></View>
  );
}

export default function RecipeCard({ recipe, onPress, children }) {
  const { favorites, toggleFavorite } = useApp();
  const fav = favorites.includes(recipe.id);
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.row}>
        <Thumb recipe={recipe} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.title}>{recipe.name}</Text>
          <Text style={styles.meta}>{recipe.time} · {recipe.difficulty}</Text>
        </View>
        <TouchableOpacity onPress={() => toggleFavorite(recipe.id)} hitSlop={10} accessibilityLabel="Toggle favorite">
          <Ionicons name={fav ? 'heart' : 'heart-outline'} size={26} color={C.accent} />
        </TouchableOpacity>
      </View>
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: C.card, borderRadius: 16, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: C.line },
  row: { flexDirection: 'row', alignItems: 'center' },
  title: { fontSize: 17, fontWeight: '700', color: C.ink },
  meta: { fontSize: 13, color: C.muted, marginTop: 2 },
  emojiBox: { backgroundColor: C.accentSoft, alignItems: 'center', justifyContent: 'center' },
});
