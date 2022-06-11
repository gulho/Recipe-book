import {Actions, createEffect, ofType} from "@ngrx/effects";
import {map, switchMap} from "rxjs";

import * as RecipeActions from "../store/recipe.action";
import {Recipe} from "../recipe.model";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";

@Injectable()
export class RecipeEffects {

  private recipesPath = 'recipies.json';

  retchRecipes = createEffect(() => {
    return this.actions$.pipe(
      ofType(RecipeActions.FETCH_RECIPES),
      switchMap(() => {
        return this.http.get<Recipe[]>(environment.firebase + this.recipesPath);
      }),
      map(recipes => {
        return recipes.map(recipe => {
          return {...recipe, ingredients: recipe.ingredients ?? []}
        });
      }),
      map(recipes => new RecipeActions.SetRecipes(recipes))
    );
  });

  constructor(private actions$: Actions, private http: HttpClient) {
  }
}
