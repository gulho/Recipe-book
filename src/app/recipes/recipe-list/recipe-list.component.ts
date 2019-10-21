import { Component, OnInit } from '@angular/core';
import {Recipe} from '../recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {
  recepies: Recipe[] = [
    new Recipe('A test Recipe', 'Recipe descrition', 'http://www.fnstatic.co.uk/images/content/recipe/korean-bbq-chicken.jpeg')
  ];
  constructor() { }

  ngOnInit() {
  }

}
