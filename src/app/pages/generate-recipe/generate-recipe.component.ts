import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { INGREDIENT_NAMES } from './ingredient-data';
import { IngredientsStateService, Ingredient } from './ingredients-state.service';
import { HeaderSecondaryComponent } from '../../layout/headers/header-secondary/header-secondary.component';

@Component({
  selector: 'app-generate-recipe',
  standalone: true,
  imports: [RouterLink, HeaderSecondaryComponent, CommonModule, FormsModule],
  templateUrl: './generate-recipe.component.html',
  styleUrls: ['./generate-recipe.component.scss'],
})
export class GenerateRecipeComponent {
  constructor(
    private readonly ingredientsState: IngredientsStateService
  ) {}

  allIngredientNames: string[] = INGREDIENT_NAMES;

  filteredIngredientNames: string[] = [];

  isUnitDropdownOpen = false;

  toggleUnitDropdown(): void {
    this.isUnitDropdownOpen = !this.isUnitDropdownOpen;
  }

  selectedUnit = 'gram';

  selectUnit(unit: string): void {
    this.selectedUnit = unit;
    this.isUnitDropdownOpen = false;
  }

  ingredientName = '';
  ingredientQuantity: number | null = null;

  get ingredients(): Ingredient[] {
    return this.ingredientsState.ingredients;
  }

  get canGoNext(): boolean {
    return this.ingredients.length > 0;
  }  

  addIngredient(): void {
    const name = this.ingredientName.trim();

    if (!name) {
      return;
    }
    if (this.ingredientQuantity === null || this.ingredientQuantity <= 0) {
      return;
    }

    this.ingredientsState.addIngredient({
      name,
      quantity: this.ingredientQuantity,
      unit: this.selectedUnit,
    });

    this.ingredientName = '';
    this.ingredientQuantity = null;
    this.filteredIngredientNames = [];
  }

  removeIngredient(index: number): void {
    this.ingredientsState.removeIngredient(index);
  }

  onIngredientNameChange(value: string): void {
    this.ingredientName = value;

    const query = value.trim().toLowerCase();
    if (!query) {
      this.filteredIngredientNames = [];
      return;
    }

    this.filteredIngredientNames = this.allIngredientNames
      .filter((name) => name.toLowerCase().startsWith(query))
      .slice(0, 3);
  }

  selectIngredientSuggestion(name: string): void {
    this.ingredientName = name;
    this.filteredIngredientNames = [];
  }
}
