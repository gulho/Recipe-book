import { Component, OnInit } from '@angular/core';
import {Ingridient} from '../recipes/shared/ingridients.model';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {

  ingridients: Ingridient[] = [
    new Ingridient('apple', 5),
    new Ingridient('Banan', 10)
  ];

  constructor() { }

  ngOnInit() {
  }

}
