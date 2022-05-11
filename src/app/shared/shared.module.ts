import {NgModule} from "@angular/core";
import {DropdownDirective} from "./dropdowsn.derective";
import {AlertComponent} from "./alert/alert.component";
import {PlaceholderDirective} from "./placeholder/placeholder.directive";
import {CommonModule} from "@angular/common";

@NgModule({
  declarations: [
    DropdownDirective,
    AlertComponent,
    PlaceholderDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    DropdownDirective,
    AlertComponent,
    PlaceholderDirective,
    CommonModule
  ]
})
export class SharedModule {}
