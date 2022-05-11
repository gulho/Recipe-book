import {NgModule} from "@angular/core";
import {DropdownDirective} from "./dropdowsn.derective";
import {AlertComponent} from "./alert/alert.component";
import {PlaceholderDirective} from "./placeholder/placeholder.directive";
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    DropdownDirective,
    AlertComponent,
    PlaceholderDirective
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    DropdownDirective,
    AlertComponent,
    PlaceholderDirective,
    CommonModule,
    ReactiveFormsModule
  ]
})
export class SharedModule {}
