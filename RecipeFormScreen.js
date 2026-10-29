import React, { useState } from 'react';
import { View, Text, TextInput, Image, ScrollView, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { C } from './theme';
import { useApp } from './AppContext';

const LEVELS = ['Easy', 'Medium', 'Hard'];
const lines = (t) => t.split('\n').map((s) => s.trim()).filter(Boolean);
const warn = (msg) => (Platform.OS === 'web' ? window.alert(msg) : Alert.alert('Missing details', msg));

export default function RecipeFormScreen({ navigation, route }) {
  const { myRecipes, saveRecipe } = useApp();
  const existing = myRecipes.find((r) => r.id === route.params?.id);

  const [name, setName] = useState(existing?.name || '');
  const [image, setImage] = useState(existing?.image || null);
  const [ingredients, setIngredients] = useState(existing?.ingredients.join('\n') || '');
  const [steps, setSteps] = useState(existing?.instructions.join('\n') || '');
  const [time, setTime] = useState(existing?.time || '');
  const [servings, setServings] = useState(existing ? String(existing.servings) : '');
  const [calories, setCalories] = useState(existing ? String(existing.calories) : '');
  const [difficulty, setDifficulty] = useState(existing?.difficulty || 'Easy');

  const pick = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [1, 1], quality: 0.6 });
    if (!res.canceled) setImage(res.assets[0].uri);
  };

  const save = () => {
    if (!name.trim() || !lines(ingredients).length || !lines(steps).length)
      return warn('Add a recipe name, at least one ingredient and at least one step.');
    saveRecipe({
      id: existing?.id || `my-${Date.now()}`,
      name: name.trim(), image, emoji: '🍽️', category: 'My Food',
      ingredients: lines(ingredients), instructions: lines(steps),
      time: time.trim() || '—', servings: Number(servings) || 1,
      calories: Number(calories) || 0, difficulty,
    });
    navigation.goBack();
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ padding: 16 }} keyboardShouldPersistTaps="handled">
      <Text style={styles.label}>Recipe name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="e.g. Grandma's lemon rice" />

      <Text style={styles.label}>Photo</Text>
      <TouchableOpacity style={styles.imgBox} onPress={pick}>
        {image ? <Image source={{ uri: image }} style={styles.img} /> : <Text style={{ color: C.muted }}>Tap to upload an image</Text>}
      </TouchableOpacity>

      <Text style={styles.label}>Ingredients (one per line)</Text>
      <TextInput style={[styles.input, styles.multi]} multiline value={ingredients} onChangeText={setIngredients} placeholder={'2 cups rice\n1 lemon'} />

      <Text style={styles.label}>Step-by-step instructions (one step per line)</Text>
      <TextInput style={[styles.input, styles.multi]} multiline value={steps} onChangeText={setSteps} placeholder={'Cook the rice.\nAdd lemon juice.'} />

      <Text style={styles.label}>Prep time</Text>
      <TextInput style={styles.input} value={time} onChangeText={setTime} placeholder="e.g. 20 min" />
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Text style={styles.label}>Servings</Text>
          <TextInput style={styles.input} value={servings} onChangeText={setServings} keyboardType="numeric" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Calories</Text>
          <TextInput style={styles.input} value={calories} onChangeText={setCalories} keyboardType="numeric" />
        </View>
      </View>

      <Text style={styles.label}>Difficulty</Text>
      <View style={{ flexDirection: 'row' }}>
        {LEVELS.map((l) => (
          <TouchableOpacity key={l} onPress={() => setDifficulty(l)} style={[styles.pill, difficulty === l && styles.pillOn]}>
            <Text style={{ color: difficulty === l ? '#fff' : C.ink, fontWeight: '600' }}>{l}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.save} onPress={save}>
        <Text style={styles.saveText}>Save Recipe</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  label: { fontWeight: '700', color: C.ink, marginTop: 16, marginBottom: 6 },
  input: { backgroundColor: C.card, borderWidth: 1, borderColor: C.line, borderRadius: 12, padding: 12, fontSize: 16, color: C.ink },
  multi: { minHeight: 110, textAlignVertical: 'top' },
  imgBox: { height: 160, borderRadius: 14, borderWidth: 1, borderStyle: 'dashed', borderColor: C.muted, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', backgroundColor: C.card },
  img: { width: '100%', height: '100%' },
  pill: { paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: C.line, backgroundColor: C.card, marginRight: 8 },
  pillOn: { backgroundColor: C.accent, borderColor: C.accent },
  save: { backgroundColor: C.accent, padding: 16, borderRadius: 14, alignItems: 'center', marginTop: 28, marginBottom: 40 },
  saveText: { color: '#fff', fontWeight: '800', fontSize: 17 },
});
