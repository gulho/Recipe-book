import {Component, OnDestroy, OnInit} from '@angular/core';
import {Ingredient} from '../../shared/ingridients.model';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {Store} from "@ngrx/store";

import * as ShoppingListActions from "../store/shopping-list.actions";
import * as fromShoppingList from "../store/shopping-list.reducer";


@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html'
})
export class ShoppingEditComponent implements OnInit, OnDestroy {

  shoppingForm: FormGroup;
  subscription: Subscription;
  editMode = false;
  editIngredientItem: Ingredient;

  constructor(private store: Store<fromShoppingList.AppState>) { }

  ngOnInit() {
    this.shoppingForm = new FormGroup({
      'name': new FormControl(null, Validators.required),
      'amount': new FormControl(null, [Validators.required, Validators.pattern('^[1-9]+[0-9]*$')])
    });

    this.subscription = this.store.select('shoppingList').subscribe(stateData => {
      if (stateData.editedIngredientIndex <= -1) {
        this.editMode = false;
        return;
      }
      this.editMode = true;
      this.editIngredientItem = stateData.editedIngredient;
      this.shoppingForm.setValue({
        'name': this.editIngredientItem.name,
        'amount': this.editIngredientItem.amount
      })
    });

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  saveIngredients() {
    const ingredient = new Ingredient(this.shoppingForm.get('name').value, this.shoppingForm.get('amount').value);
    if (this.editMode) {
      this.store.dispatch(new ShoppingListActions.UpdateIngredient(ingredient));
    } else {
      this.store.dispatch(new ShoppingListActions.AddIngredient(ingredient));
    }
    this.onClear();
  }

  onClear() {
    this.editMode = false;
    this.shoppingForm.reset();
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }

  onDelete() {
    this.store.dispatch(new ShoppingListActions.DeleteIngredient());
    this.onClear();
  }
}
