import React, { createContext, useContext, useState } from 'react';

const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

export function AppProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [myRecipes, setMyRecipes] = useState([]);

  const toggleFavorite = (id) =>
    setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));

  const saveRecipe = (recipe) =>
    setMyRecipes((list) =>
      list.some((x) => x.id === recipe.id)
        ? list.map((x) => (x.id === recipe.id ? recipe : x))
        : [recipe, ...list]
    );

  const deleteRecipe = (id) => {
    setMyRecipes((list) => list.filter((x) => x.id !== id));
    setFavorites((f) => f.filter((x) => x !== id));
  };

  return (
    <Ctx.Provider value={{ favorites, toggleFavorite, myRecipes, saveRecipe, deleteRecipe }}>
      {children}
    </Ctx.Provider>
  );
}
