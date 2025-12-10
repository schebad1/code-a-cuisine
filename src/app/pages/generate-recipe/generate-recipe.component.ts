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

  /** All available ingredient names used for autocomplete. */
  allIngredientNames: string[] = INGREDIENT_NAMES;

  /** Filtered list of ingredient suggestions based on user input. */
  filteredIngredientNames: string[] = [];

  // LEFT SIDE (Form)

  /** Whether the unit dropdown on the form is currently open. */
  isUnitDropdownOpen = false;

  /** The currently selected unit when adding a new ingredient. */
  selectedUnit = 'gram';

  /** Name of the ingredient currently being typed in the form. */
  ingredientName = '';

  /** Quantity of the ingredient currently being typed in the form. */
  ingredientQuantity: number | null = null;

  // RIGHT SIDE (List / Edit Mode)

  /** Index of the ingredient currently being edited. Null means no edit in progress. */
  editingIndex: number | null = null;

  /** Temporary quantity while editing an ingredient. */
  editingQuantity: number | null = null;

  /** Temporary unit while editing an ingredient. */
  editingUnit: string = 'gram';

  /** Temporary ingredient name while editing an ingredient. */
  editingName = '';

  /** Whether the unit dropdown in edit mode is open. */
  editingUnitDropdownOpen = false;

  /**
   * Indicates whether any ingredient is currently in edit mode.
   */
  get isEditing(): boolean {
    return this.editingIndex !== null;
  }

  /**
   * Capitalizes the first letter of a string.
   *
   * @param value - Input string
   * @returns The string with the first letter capitalized
   */
  private capitalizeFirst(value: string): string {
    if (!value) return value;
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  // ---- LEFT SIDE: Unit Dropdown in Form ----

  /**
   * Toggles the unit dropdown on the form.
   * Disabled if an ingredient is currently being edited.
   */
  toggleUnitDropdown(): void {
    if (this.isEditing) {
      return;
    }
    this.isUnitDropdownOpen = !this.isUnitDropdownOpen;
  }

  /**
   * Selects a unit for the ingredient being added.
   *
   * @param unit - The chosen unit
   */
  selectUnit(unit: string): void {
    this.selectedUnit = unit;
    this.isUnitDropdownOpen = false;
  }

  // ---- RIGHT SIDE: Ingredient List / State ----

  /**
   * Returns the current list of ingredients from the state service.
   */
  get ingredients(): Ingredient[] {
    return this.ingredientsState.ingredients;
  }

  /**
   * Whether the user can navigate to the next step.
   * Requires at least one ingredient.
   */
  get canGoNext(): boolean {
    return this.ingredients.length > 0;
  }

  /**
   * Adds an ingredient to the list if form inputs are valid.
   * Disabled while an edit operation is in progress.
   */
  addIngredient(): void {
    if (this.isEditing) {
      return;
    }
  
    const rawName = this.ingredientName.trim();
    if (!rawName) return;
  
    const quantity = this.ingredientQuantity ?? 100;
    if (quantity <= 0) {
      return;
    }
  
    const name = this.capitalizeFirst(rawName);
  
    this.ingredientsState.addIngredient({
      name,
      quantity,
      unit: this.selectedUnit,
    });
  
    this.ingredientName = '';
    this.ingredientQuantity = null;
    this.filteredIngredientNames = [];
  
    this.selectedUnit = 'gram';
    this.isUnitDropdownOpen = false;
  }  

  /**
   * Removes an ingredient by index.
   * Disabled while an ingredient is being edited.
   *
   * @param index - Position of the ingredient to remove
   */
  removeIngredient(index: number): void {
    if (this.isEditing) {
      return;
    }

    this.ingredientsState.removeIngredient(index);

    if (this.editingIndex === index) {
      this.editingIndex = null;
      this.editingQuantity = null;
      this.editingName = '';
      this.editingUnitDropdownOpen = false;
    } else if (this.editingIndex !== null && index < this.editingIndex) {
      this.editingIndex = this.editingIndex - 1;
    }
  }

  /**
   * Activates edit mode for the ingredient at the given index.
   * Editing is not allowed if another ingredient is already being edited.
   *
   * @param index - Index of the ingredient to edit
   */
  startEdit(index: number): void {
    if (this.isEditing && this.editingIndex !== index) {
      return;
    }

    const ing = this.ingredients[index];
    if (!ing) return;

    this.editingIndex = index;
    this.editingQuantity = ing.quantity;
    this.editingUnit = ing.unit;
    this.editingName = ing.name;
    this.editingUnitDropdownOpen = false;
    this.isUnitDropdownOpen = false;
  }

  /**
   * Confirms the edit operation and updates the ingredient.
   * Validation ensures name and quantity are valid.
   */
  confirmEdit(): void {
    if (this.editingIndex === null) return;
    if (this.editingQuantity === null || this.editingQuantity <= 0) return;

    const rawName = this.editingName.trim();
    if (!rawName) return;

    const newName = this.capitalizeFirst(rawName);
    const index = this.editingIndex;

    const current = this.ingredients[index];
    if (!current) {
      this.editingIndex = null;
      this.editingQuantity = null;
      this.editingName = '';
      this.editingUnitDropdownOpen = false;
      return;
    }

    this.ingredients[index] = {
      ...current,
      quantity: this.editingQuantity,
      unit: this.editingUnit,
      name: newName,
    };

    this.editingIndex = null;
    this.editingQuantity = null;
    this.editingName = '';
    this.editingUnitDropdownOpen = false;
  }

  // ---- RIGHT SIDE: Unit Dropdown in Edit Mode ----

  /**
   * Toggles the unit dropdown while editing an ingredient.
   */
  toggleEditingUnitDropdown(): void {
    this.editingUnitDropdownOpen = !this.editingUnitDropdownOpen;
  }

  /**
   * Selects a unit while editing an ingredient.
   *
   * @param unit - The chosen unit
   */
  selectEditingUnit(unit: string): void {
    this.editingUnit = unit;
    this.editingUnitDropdownOpen = false;
  }

  // ---- Autocomplete for Ingredient Names ----

  /**
   * Generates autocomplete suggestions based on the current input.
   *
   * @param value - The user's input string
   */
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

  /**
   * Selects an autocomplete suggestion and fills it into the input.
   *
   * @param name - Suggested ingredient name
   */
  selectIngredientSuggestion(name: string): void {
    this.ingredientName = name;
    this.filteredIngredientNames = [];
  }

  /**
   * Formats a displayed ingredient amount depending on its unit.
   *
   * @param ingredient - The ingredient to format
   * @returns A human-readable string like "100g" or "2 ml"
   */
  formatIngredientAmount(ingredient: Ingredient): string {
    const qty = ingredient.quantity;
    const unit = ingredient.unit;

    if (unit === 'gram') {
      return `${qty}g`;
    }

    if (unit === 'piece') {
      return `${qty}`;
    }

    if (unit === 'ml') {
      return `${qty} ml`;
    }

    return `${qty} ${unit}`;
  }
}
