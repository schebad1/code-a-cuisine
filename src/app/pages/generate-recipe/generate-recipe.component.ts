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

  // LINKS (Formular)
  isUnitDropdownOpen = false;
  selectedUnit = 'gram';

  // Eingabe
  ingredientName = '';
  ingredientQuantity: number | null = null;

  // RECHTS (Liste / Edit-Modus)
  editingIndex: number | null = null;
  editingQuantity: number | null = null;
  editingUnit: string = 'gram';
  editingName = '';
  editingUnitDropdownOpen = false;

  // Flag: ist gerade irgendeine Zutat im Edit-Modus?
  get isEditing(): boolean {
    return this.editingIndex !== null;
  }

  // Hilfsfunktion: ersten Buchstaben groß schreiben
  private capitalizeFirst(value: string): string {
    if (!value) return value;
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  // ---- LINKS: Unit-Dropdown im Formular ----
  toggleUnitDropdown(): void {
    // Wenn gerade editiert wird, kein Unit-Dropdown links
    if (this.isEditing) {
      return;
    }
    this.isUnitDropdownOpen = !this.isUnitDropdownOpen;
  }

  selectUnit(unit: string): void {
    this.selectedUnit = unit;
    this.isUnitDropdownOpen = false;
  }

  // ---- RECHTS: Zutatenliste / State ----
  get ingredients(): Ingredient[] {
    return this.ingredientsState.ingredients;
  }

  get canGoNext(): boolean {
    return this.ingredients.length > 0;
  }

  addIngredient(): void {
    // während Edit nicht erlauben
    if (this.isEditing) {
      return;
    }

    const rawName = this.ingredientName.trim();

    if (!rawName) {
      return;
    }
    if (this.ingredientQuantity === null || this.ingredientQuantity <= 0) {
      return;
    }

    const name = this.capitalizeFirst(rawName);

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
    // während irgendein Edit läuft: nichts löschen
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

  startEdit(index: number): void {
    // wenn schon editiert wird und es ist eine andere Zeile: blockieren
    if (this.isEditing && this.editingIndex !== index) {
      return;
    }

    const ing = this.ingredients[index];
    if (!ing) {
      return;
    }

    this.editingIndex = index;
    this.editingQuantity = ing.quantity;
    this.editingUnit = ing.unit;
    this.editingName = ing.name;
    this.editingUnitDropdownOpen = false;
    this.isUnitDropdownOpen = false; // linkes Dropdown sicherheitshalber zu
  }

  confirmEdit(): void {
    if (this.editingIndex === null) {
      return;
    }
    if (this.editingQuantity === null || this.editingQuantity <= 0) {
      return;
    }
    const rawName = this.editingName.trim();
    if (!rawName) {
      return;
    }

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

  // ---- RECHTS: Unit-Dropdown im Edit-Modus ----
  toggleEditingUnitDropdown(): void {
    this.editingUnitDropdownOpen = !this.editingUnitDropdownOpen;
  }

  selectEditingUnit(unit: string): void {
    this.editingUnit = unit;
    this.editingUnitDropdownOpen = false;
  }

  // ---- Autocomplete für Ingredient-Namen ----
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

  formatIngredientAmount(ingredient: Ingredient): string {
    const qty = ingredient.quantity;
    const unit = ingredient.unit;

    if (unit === 'gram') {
      // 100g
      return `${qty}g`;
    }

    if (unit === 'piece') {
      // nur Zahl
      return `${qty}`;
    }

    if (unit === 'ml') {
      // 100 ml
      return `${qty} ml`;
    }

    // Fallback, falls irgendwann neue Units dazukommen
    return `${qty} ${unit}`;
  }

}
