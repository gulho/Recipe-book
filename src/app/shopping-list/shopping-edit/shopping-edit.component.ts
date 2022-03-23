import {Component, OnDestroy, OnInit} from '@angular/core';
import {Ingredient} from '../../shared/ingridients.model';
import {ShoppingListService} from "../shoping-list.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {

  shoppingForm: FormGroup;
  subscription: Subscription;
  editMode = false;
  editIngredientIndex: number;
  editIngredientItem: Ingredient;

  constructor(private shoppingListService: ShoppingListService) { }

  ngOnInit() {
    this.shoppingForm = new FormGroup({
      'name': new FormControl(null, Validators.required),
      'amount': new FormControl(null, [Validators.required, Validators.pattern('^[1-9]+[0-9]*$')])
    });
    this.subscription = this.shoppingListService.startedEditing.subscribe(
      (index: number) => {
              this.editIngredientIndex = index;
              this.editMode = true;
              this.editIngredientItem = this.shoppingListService.getIngredient(index);
              this.shoppingForm.setValue({
                'name': this.editIngredientItem.name,
                'amount': this.editIngredientItem.amount
              })
            }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  saveIngredients() {
    const ingredient = new Ingredient(this.shoppingForm.get('name').value, this.shoppingForm.get('amount').value);
    if (this.editMode) {
      this.shoppingListService.updateIngredient(this.editIngredientIndex, ingredient);
    } else {
      this.shoppingListService.addIngredient(ingredient);
    }
    this.onClear();
  }

  onClear() {
    this.editMode = false;
    this.shoppingForm.reset();
  }

  onDelete() {
    this.shoppingListService.deleteIngredient(this.editIngredientIndex);
    this.onClear();
  }
}
