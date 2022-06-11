import {Component, OnDestroy, OnInit} from '@angular/core';
import {Recipe} from '../recipe.model';
import {map, Subscription} from "rxjs";
import {Store} from "@ngrx/store";

import * as fromApp from "../../store/app.reducer";

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit, OnDestroy {

  recipes: Recipe[];
  subscription: Subscription;

  constructor(private store: Store<fromApp.AppState>) {
  }

  ngOnInit() {
    this.subscription = this.store.select("recipes")
    .pipe(map(recipeState => recipeState.recipes))
    .subscribe(
      recipes => this.recipes = recipes
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
