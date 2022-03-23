import {Ingredient} from "../shared/ingridients.model";
import {Subject} from "rxjs";

export class ShoppingListService {
  ingredientChanged = new Subject<Ingredient[]>();
  startedEditing = new Subject<number>();
  private ingredients: Ingredient[] = [
    new Ingredient('apple', 5),
    new Ingredient('Banan', 10)
  ];

  public getIngredients(): Ingredient[] {
    return this.ingredients.slice();
  }

  public addIngredient(ingredient: Ingredient): void {
    this.ingredients.push(ingredient);
    this.changedIngredients();
  }

  public addIngredients(ingredients: Ingredient[]): void {
    this.ingredients.push(...ingredients);
    this.changedIngredients();
  }

  public getIngredient(index: number): Ingredient {
    return this.ingredients[index];
  }

  public updateIngredient(index: number, newIngredient: Ingredient): void {
    this.ingredients[index] = newIngredient;
    this.changedIngredients();
  }

  public deleteIngredient(index: number): void {
    this.ingredients.splice(index, 1);
    this.changedIngredients();
  }

  private changedIngredients(): void {
    this.ingredientChanged.next(this.ingredients.slice());
  }
}
