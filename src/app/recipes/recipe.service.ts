import {Recipe} from "./recipe.model";
import {Injectable} from "@angular/core";
import {Ingredient} from "../shared/ingridients.model";
import {ShoppingListService} from "../shopping-list/shoping-list.service";
import {Subject} from "rxjs";

@Injectable()
export class RecipeService {
  public recipeChanged = new Subject<Recipe[]>();

  constructor(private shoppingListService: ShoppingListService) {
  }

  // private recipes: Recipe[] = [
  //   new Recipe(
  //     'A test Recipe',
  //     'Recipe descrition',
  //     'https://www.simplyrecipes.com/thmb/RheeF949ewwGy7pxQQNt5v63Oi0=/720x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/Simply-Recipes-Homemade-Pizza-Dough-Lead-Shot-1c-c2b1885d27d4481c9cfe6f6286a64342.jpg',
  //     [
  //       new Ingredient("French Fries", 2),
  //       new Ingredient("Meat", 1)
  //     ]), new Recipe(
  //     'A test Recipe2',
  //     'Recipe descrition2',
  //     'https://www.simplyrecipes.com/thmb/RheeF949ewwGy7pxQQNt5v63Oi0=/720x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/Simply-Recipes-Homemade-Pizza-Dough-Lead-Shot-1c-c2b1885d27d4481c9cfe6f6286a64342.jpg',
  //     [
  //       new Ingredient("French Fries", 1),
  //       new Ingredient("Meat", 3)
  //     ])
  // ];

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
    this.shoppingListService.addIngredients(ingredients);
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
