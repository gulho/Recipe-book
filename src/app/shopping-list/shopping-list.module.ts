import {NgModule} from "@angular/core";
import {ShoppingListComponent} from "./shopping-list.component";
import {ShoppingEditComponent} from "./shopping-edit/shopping-edit.component";
import {RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";
import {ShoppingListRoutingModule} from "./shopping-list.routing.module";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    ShoppingListComponent,
    ShoppingEditComponent,
  ],
  imports: [RouterModule, ShoppingListRoutingModule, CommonModule, ReactiveFormsModule]
})
export class ShoppingListModule {

}
