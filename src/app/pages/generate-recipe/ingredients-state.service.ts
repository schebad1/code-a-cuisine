import { Injectable } from '@angular/core';

/**
 * Represents a single ingredient entry.
 */
export interface Ingredient {
  /** Name of the ingredient (capitalized). */
  name: string;

  /** Quantity of the ingredient. */
  quantity: number;

  /** Unit of measurement (e.g., "gram", "ml", "piece"). */
  unit: string;
}

@Injectable({ providedIn: 'root' })
export class IngredientsStateService {
  /**
   * Holds the current list of ingredients used for recipe generation.
   */
  ingredients: Ingredient[] = [];

  /**
   * Adds a new ingredient to the state.
   *
   * @param ingredient - The ingredient object to add
   */
  addIngredient(ingredient: Ingredient): void {
    this.ingredients.push(ingredient);
  }

  /**
   * Removes an ingredient from the state by index.
   *
   * @param index - Position of the ingredient to remove
   */
  removeIngredient(index: number): void {
    this.ingredients.splice(index, 1);
  }
}
