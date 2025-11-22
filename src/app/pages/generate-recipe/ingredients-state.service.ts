import { Injectable } from '@angular/core';

export interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
}

@Injectable({ providedIn: 'root' })
export class IngredientsStateService {
  ingredients: Ingredient[] = [];

  addIngredient(ingredient: Ingredient): void {
    this.ingredients.push(ingredient);
  }

  removeIngredient(index: number): void {
    this.ingredients.splice(index, 1);
  }
}
