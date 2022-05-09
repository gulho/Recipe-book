import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { RecipesComponent } from './recipes/recipes.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { ShoppingEditComponent } from './shopping-list/shopping-edit/shopping-edit.component';
import { RecipeListComponent } from './recipes/recipe-list/recipe-list.component';
import { RecipeDetailComponent } from './recipes/recipe-detail/recipe-detail.component';
import { RecipeItemComponent } from './recipes/recipe-list/recipe-item/recipe-item.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {DropdownDirective} from "./shared/dropdowsn.derective";
import {ShoppingListService} from "./shopping-list/shoping-list.service";
import {AppRoutingModule} from "./app-routing.module";
import { RecipesStartComponent } from './recipes/recipes-start/recipes-start.component';
import { RecipeEditComponent } from './recipes/recipe-edit/recipe-edit.component';
import {RecipeService} from "./recipes/recipe.service";
import {ReactiveFormsModule} from "@angular/forms";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AuthComponent} from "./auth/auth.component";
import {AuthInterceptorService} from "./auth/auth-interceptor.service";
import {AlertComponent} from "./shared/alert/alert.component";
import {PlaceholderDirective} from "./shared/placeholder/placeholder.directive";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    RecipesComponent,
    ShoppingListComponent,
    ShoppingEditComponent,
    RecipeListComponent,
    RecipeDetailComponent,
    RecipeItemComponent,
    DropdownDirective,
    RecipesStartComponent,
    RecipeEditComponent,
    AuthComponent,
    AlertComponent,
    PlaceholderDirective
  ],
  imports: [
    BrowserModule,
    NgbModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [ShoppingListService, RecipeService, {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
