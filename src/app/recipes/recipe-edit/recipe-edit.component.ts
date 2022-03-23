import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {RecipeService} from "../recipe.service";

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  id: number;
  editMode = false;
  recipeForm: FormGroup;

  constructor(private route: ActivatedRoute, private router: Router, private service: RecipeService) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
        this.editMode = params['id'] != null;
        this.initForm();
      }
    );
  }

  private initForm() {
    let recipeName = '';
    let recipeImageUrl = '';
    let recipeDescription = '';
    let recipeIngredients = new FormArray([]);

    if (this.editMode) {
       const recipe = this.service.getRecipeById(this.id);
       recipeName = recipe.name;
       recipeImageUrl = recipe.imagePath;
       recipeDescription = recipe.description;
       if (recipe['ingredients']) {
         recipe.ingredients.forEach(ingredient => recipeIngredients.push(
           new FormGroup({
             'name': new FormControl(ingredient.name, Validators.required),
             'amount': new FormControl(ingredient.amount, [Validators.required, Validators.pattern('^[1-9]+[0-9]*$')])
           })
         ));
       }
    }
    this.recipeForm = new FormGroup({
      'name': new FormControl(recipeName, Validators.required),
      'imagePath': new FormControl(recipeImageUrl, Validators.required),
      'description': new FormControl(recipeDescription),
      'ingredients': recipeIngredients
    });
  }

  public onSubmit(): void {
    if (this.editMode) {
      this.service.updateRecipe(this.id, this.recipeForm.value);
    } else {
      this.service.addRecipe(this.recipeForm.value);
    }
    this.navigateBack();
  }

  public navigateBack() {
    this.router.navigate(['/recipes/']);
  }

  public get ingredients(): FormControl[] {
    return (<FormArray> this.recipeForm.get('ingredients')).controls as FormControl[];
  }

  public addIngredient(): void {
    (<FormArray> this.recipeForm.get('ingredients')).push(new FormGroup({
      'name': new FormControl(null, Validators.required),
      'amount': new FormControl(null, [Validators.required, Validators.pattern('^[1-9]+[0-9]*$')])
    }));
  }

  public onDeleteIngredient(index: number): void {
    this.ingredients.splice(index, 1);
  }
}
