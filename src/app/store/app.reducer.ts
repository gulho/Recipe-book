import * as fromShippingList from '../shopping-list/store/shopping-list.reducer';
import * as fromAuth from '../auth/store/auth.reducer';
import * as fromRecipe from '../recipes/store/recipe.reducer';
import {ActionReducerMap} from "@ngrx/store";

export interface AppState {
  shoppingList: fromShippingList.State;
  auth: fromAuth.State;
  recipes: fromRecipe.State
}

export const appReducer: ActionReducerMap<AppState> = {
  shoppingList: fromShippingList.shoppingListReducer,
  auth: fromAuth.authReducer,
  recipes: fromRecipe.recipeReducer
}
