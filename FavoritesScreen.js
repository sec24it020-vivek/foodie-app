import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { C } from './theme';
import { RECIPES } from './recipes';
import { useApp } from './AppContext';
import RecipeCard from './RecipeCard';

export default function FavoritesScreen({ navigation }) {
  const { favorites, myRecipes } = useApp();
  const data = [...RECIPES, ...myRecipes].filter((r) => favorites.includes(r.id));
  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <FlatList
        data={data}
        keyExtractor={(r) => r.id}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={<Text style={styles.empty}>No favorites yet. Tap the heart on any recipe to save it here.</Text>}
        renderItem={({ item }) => (
          <RecipeCard recipe={item} onPress={() => navigation.navigate('RecipeDetail', { id: item.id })} />
        )}
      />
    </View>
  );
}
const styles = StyleSheet.create({ empty: { textAlign: 'center', color: C.muted, marginTop: 40, paddingHorizontal: 24 } });
