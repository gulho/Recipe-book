import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {Injectable} from "@angular/core";
import {Recipe} from "./recipe.model";
import {Observable} from "rxjs";
import {Store} from "@ngrx/store";
import {Actions} from "@ngrx/effects";

import * as fromApp from "../store/app.reducer";
import * as RecipeActions from "../recipes/store/recipe.action";

@Injectable({providedIn: 'root'})
export class RecipeResolverService implements Resolve<Recipe[]> {
  constructor(private store: Store<fromApp.AppState>, private actions$: Actions) {
  }

  resolve(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<Recipe[]> | Promise<Recipe[]> | Recipe[] {
    let recipes: Recipe[];
    this.store.dispatch(new RecipeActions.FetchRecipes());
    this.store.select('recipes').subscribe(recipesState => {
      recipes = recipesState.recipes;
    })
    return recipes;
  }
}
