import {Component, OnInit} from '@angular/core';
import {Ingredient} from '../shared/ingridients.model';
import {Observable/*, Subscription*/} from "rxjs";
import {Store} from "@ngrx/store";
import * as fromShoppingList from "./store/shopping-list.reducer";
import * as ShoppingListActions from "../shopping-list/store/shopping-list.actions";

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html'
})
export class ShoppingListComponent implements OnInit {

  ingredients: Observable<{ingredients: Ingredient[]}>;

  constructor(private store: Store<fromShoppingList.AppState>) {}

  ngOnInit() {
    this.ingredients = this.store.select('shoppingList');
  }

  onEditIngredient(index: number) {
    this.store.dispatch(new ShoppingListActions.StartEdit(index));
  }
}
