import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppProvider } from './AppContext';
import { C } from './theme';
import HomeScreen from './screens/HomeScreen';
import RecipeDetailScreen from './screens/RecipeDetailScreen';
import FavoritesScreen from './screens/FavoritesScreen';
import RecipeFormScreen from './screens/RecipeFormScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: C.bg },
            headerTintColor: C.ink,
            headerTitleStyle: { fontWeight: '800' },
            headerBackTitleVisible: false,
          }}>
          <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Foodie' }} />
          <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} options={{ title: 'Recipe' }} />
          <Stack.Screen name="Favorites" component={FavoritesScreen} options={{ title: 'Favorites' }} />
          <Stack.Screen name="RecipeForm" component={RecipeFormScreen}
            options={({ route }) => ({ title: route.params?.id ? 'Edit Recipe' : 'Add New Recipe' })} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}
