import {Component, OnInit} from '@angular/core';
import {Recipe} from '../recipe.model';
import {RecipeService} from "../recipe.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {map, switchMap} from "rxjs";

import * as fromApp from "../../store/app.reducer";
import * as RecipeActions from "../store/recipe.action";

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {

  recipe: Recipe;
  id: number

  constructor(private recipeService: RecipeService, private route: ActivatedRoute, private router: Router, private store: Store<fromApp.AppState>) {
  }

  ngOnInit() {
    this.route.params
    .pipe(
      map(params => +params['id']),
      switchMap(id => {
        this.id = id;
        return this.store.select('recipes');
      }),
      map(recipesState => recipesState.recipes.find((_recipe, index) => index === this.id))
    ).subscribe(recipe => this.recipe = recipe);
  }

  onAddShoppingList() {
    // this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients);
  }

  onEditRecipe() {
    this.router.navigate(['edit'], {relativeTo: this.route})
  }

  onDelete() {
    // this.recipeService.removeRecipe(this.id);
    this.store.dispatch(new RecipeActions.DeleteRecipe(this.id));
    this.router.navigate(['../']);
  }
}
