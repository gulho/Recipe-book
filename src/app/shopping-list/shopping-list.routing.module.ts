import {RouterModule, Routes} from "@angular/router";
import {ShoppingListComponent} from "./shopping-list.component";
import {NgModule} from "@angular/core";

const shoppingRoutes: Routes = [
  {path: 'shopping-list', component: ShoppingListComponent}
];

@NgModule({
  imports: [RouterModule.forChild(shoppingRoutes)],
  exports: [RouterModule]
})
export class ShoppingListRoutingModule {
}
