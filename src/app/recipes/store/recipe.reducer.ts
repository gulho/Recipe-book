import {Recipe} from "../recipe.model";
import * as RecipeActions from "./recipe.action";

export interface State {
  recipes: Recipe[]
}

const initialState: State = {
  recipes: []
}

export function recipeReducer(state: State = initialState, action: RecipeActions.RecipeType) {
  switch (action.type) {
    case RecipeActions.SET_RECIPES:
      return {
        ...state,
        recipes: [...action.payload]
      }
    case RecipeActions.ADD_RECIPE:
      return {
        ...state,
        recipes: [...this.state.recipes, action.payload]
      };
    case RecipeActions.UPDATE_RECIPE:
      const updatedRecipe = {
        ...state.recipes[action.payload.index],
        ...action.payload.recipe
      };
      const updaterRecipes = [...state.recipes];
      updaterRecipes[action.payload.index] = updatedRecipe;
      return {
        ...state,
        recipes: updaterRecipes
      };
    case RecipeActions.DELETE_RECIPE:
      return {
        ...state,
        recipes: state.recipes.filter((_recipe, index) => index !== action.payload)
      };
    default:
      return state;
  }
}
