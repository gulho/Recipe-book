import {Recipe} from "./recipe.model";
import {Injectable} from "@angular/core";
import {Ingredient} from "../shared/ingridients.model";
import {Subject} from "rxjs";
import {Store} from "@ngrx/store";

import * as ShoppingListActions from "../shopping-list/store/shopping-list.actions";
import * as fromShoppingList from "../shopping-list/store/shopping-list.reducer";

@Injectable()
export class RecipeService {
  public recipeChanged = new Subject<Recipe[]>();

  constructor(private store: Store<fromShoppingList.AppState>) {
  }

  private recipes: Recipe[] = [];

  public getRecipes(): Recipe[] {
    return this.recipes.slice();
  }

  public getRecipeById(id: number): Recipe {
    return this.recipes[id];
  }

  public setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.updateRecipes();
  }

  public addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.store.dispatch(new ShoppingListActions.AddIngredients(ingredients));
  }

  public addRecipe(recipe: Recipe): void {
    this.recipes.push(recipe);
    this.updateRecipes();
  }

  public updateRecipe(index: number, recipe: Recipe): void {
    this.recipes[index] = recipe;
    this.updateRecipes();
  }

  public removeRecipe(index: number): void {
    this.recipes.splice(index, 1);
    this.updateRecipes();
  }

  public updateRecipes(): void {
    this.recipeChanged.next(this.recipes.slice());
  }
}
