import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {RecipeService} from "../recipes/recipe.service";
import {environment} from "../../environments/environment";
import {Recipe} from "../recipes/recipe.model";
import {map, Observable, tap} from "rxjs";
import {Store} from "@ngrx/store";

import * as fromApp from "../store/app.reducer";
import * as RecipeActions from "../recipes/store/recipe.action";

@Injectable({providedIn: 'root'})
export class DataStorageService {
  constructor(private http: HttpClient, private recipeService: RecipeService, private store: Store<fromApp.AppState>) {
  }

  private recipesPath = 'recipies.json';

  public storeRecipes(): void {
    const recipes = this.recipeService.getRecipes();
    this.http.put(environment.firebase + this.recipesPath, recipes).subscribe(response => {
      console.log(response);
    });
  }

  public fetchData(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(environment.firebase + this.recipesPath)
    .pipe(
      map(recipes => {
        return recipes.map(recipe => {
          return {...recipe, ingredients: recipe.ingredients ?? []}
        });
      }),
      tap(response => {
        this.store.dispatch(new RecipeActions.SetRecipes(response));
      })
    );
  }
}
