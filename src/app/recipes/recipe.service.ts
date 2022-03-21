import {Recipe} from "./recipe.model";
import {Injectable} from "@angular/core";
import {Ingredient} from "../shared/ingridients.model";
import {ShoppingListService} from "../shopping-list/shoping-list.service";

@Injectable()
export class RecipeService {

  constructor(private shoppingListService: ShoppingListService) {
  }

  private recipes: Recipe[] = [
    new Recipe(
      'A test Recipe',
      'Recipe descrition',
      'https://www.simplyrecipes.com/thmb/RheeF949ewwGy7pxQQNt5v63Oi0=/720x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/Simply-Recipes-Homemade-Pizza-Dough-Lead-Shot-1c-c2b1885d27d4481c9cfe6f6286a64342.jpg',
      [
        new Ingredient("French Fries", 2),
        new Ingredient("Meat", 1)
      ]), new Recipe(
      'A test Recipe2',
      'Recipe descrition2',
      'https://www.simplyrecipes.com/thmb/RheeF949ewwGy7pxQQNt5v63Oi0=/720x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/Simply-Recipes-Homemade-Pizza-Dough-Lead-Shot-1c-c2b1885d27d4481c9cfe6f6286a64342.jpg',
      [
        new Ingredient("French Fries", 1),
        new Ingredient("Meat", 3)
      ])
  ];

  getRecipes(): Recipe[] {
    return this.recipes.slice();
  }

  getRecipeById(id: number) {
    return this.recipes[id];
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.shoppingListService.addIngredients(ingredients);
  }
}
