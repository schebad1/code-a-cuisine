import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HeaderSecondaryComponent } from '../../layout/headers/header-secondary/header-secondary.component';
import { NgIf, NgForOf, NgClass } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RecipeLibraryService } from '../../api/recipe-library.service';
import { FirestoreRecipe } from '../../api/recipe-seed.data';
import { GeneratedStep } from '../../api/recipe-api.contracts';
import { PreferencesStateService } from '../preferences/preferences-state.service';

@Component({
  selector: 'app-recipe-view',
  standalone: true,
  imports: [HeaderSecondaryComponent, RouterLink, NgIf, NgForOf, NgClass],
  templateUrl: './recipe-view.component.html',
  styleUrls: ['./recipe-view.component.scss'],
})
export class RecipeViewComponent implements OnInit {
  /** Currently loaded recipe or `null` if not found. */
  recipe: FirestoreRecipe | null = null;

  /** Indicates whether the recipe is currently being loaded. */
  isLoading = true;

  /** Indicates that no recipe was found for the given ID. */
  notFound = false;

  /** Human-readable label for the diet of the recipe. */
  dietLabel = '';
  /** Human-readable label for the time category derived from total minutes. */
  timeCategoryLabel = '';
  /** Pseudo-like count for display. Uses saved likes or 0 as fallback. */
  randomLikes = 0;
  /** Number of helpers used in this recipe (1–4). */
  helperCount = 1;

  /** Ingredients originally coming from the user input. */
  userIngredients: any[] = [];
  /** Ingredients added by the system / extras beyond user input. */
  extraIngredients: any[] = [];
  /** Ordered list of generated cooking steps. */
  steps: GeneratedStep[] = [];

  /** Whether the user has "liked" the recipe in the current session. */
  hasLiked = false;

  /** Configuration for helper icons and layout. */
  helperConfigs = [
    {
      index: 1,
      label: 'Chef 1',
      className: 'recipe-view__chef-first',
      icon: 'assets/recipe-view/toque.svg',
    },
    {
      index: 2,
      label: 'Chef 2',
      className: 'recipe-view__chef-second',
      icon: 'assets/recipe-view/cooking-tools.svg',
    },
    {
      index: 3,
      label: 'Chef 3',
      className: 'recipe-view__chef-third',
      icon: 'assets/recipe-view/apron.svg',
    },
    {
      index: 4,
      label: 'Chef 4',
      className: 'recipe-view__chef-fourth',
      icon: 'assets/recipe-view/toque-second.svg',
    },
  ];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly recipeLibrary: RecipeLibraryService,
    private readonly router: Router,
    private readonly preferencesState: PreferencesStateService
  ) {}

  /**
   * Lifecycle hook: loads the recipe for the ID in the current route.
   * Handles not-found cases, derives display labels, splits ingredients
   * into user vs. extra, and sorts steps.
   */
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.isLoading = false;
      this.notFound = true;
      return;
    }

    this.recipeLibrary.getRecipeById(id).subscribe((r) => {
      this.isLoading = false;

      if (!r) {
        this.notFound = true;
        return;
      }

      this.recipe = r;

      this.dietLabel = this.getDietLabel(r.diet);
      this.timeCategoryLabel = this.getTimeCategoryLabel(r.totalMinutes);
      this.randomLikes = r.likes ?? 0;

      if (Array.isArray(r.steps) && r.steps.length > 0) {
        const maxHelper = Math.max(
          ...r.steps.map((s) => s.assignedToHelper ?? 1)
        );
        this.helperCount = Math.min(Math.max(maxHelper, 1), 4);
      } else {
        this.helperCount = 1;
      }

      const ingredientsAny = r.ingredients;
      if (Array.isArray(ingredientsAny) && ingredientsAny.length > 0) {
        this.splitIngredients(ingredientsAny);
      } else {
        this.userIngredients = [];
        this.extraIngredients = [];
      }

      if (Array.isArray(r.steps) && r.steps.length > 0) {
        this.steps = [...r.steps].sort((a, b) => a.order - b.order);
      } else {
        this.steps = [];
      }
    });
  }

  /**
   * Toggles the like state for the current recipe.
   * Only affects local UI state, not persisted.
   */
  toggleLike(): void {
    this.hasLiked = !this.hasLiked;
  }

  /**
   * Maps a total preparation time in minutes to a simple time category label.
   *
   * @param totalMinutes - Total time in minutes
   * @returns A label like "Quick", "Medium", or "Complex"
   */
  private getTimeCategoryLabel(totalMinutes: number): string {
    if (totalMinutes <= 20) return 'Quick';
    if (totalMinutes <= 40) return 'Medium';
    return 'Complex';
  }

  /**
   * Maps the stored diet value to a user-facing label.
   *
   * @param diet - Diet identifier (e.g. "vegetarian", "vegan", "keto", "none")
   * @returns A human-readable diet label
   */
  private getDietLabel(diet: string): string {
    switch (diet) {
      case 'vegetarian':
        return 'Vegetarian';
      case 'vegan':
        return 'Vegan';
      case 'keto':
        return 'Keto';
      case 'none':
      default:
        return 'No preferences';
    }
  }

  /**
   * Returns a concise title for a step, derived from the first sentence
   * or truncated text if needed.
   *
   * @param step - The step for which to build the title
   * @returns A short, capitalized title string
   */
  getStepTitle(step: GeneratedStep): string {
    if (!step?.text) return `Step ${step.order}`;
    const text = step.text.trim();
    const end = text.search(/[.!?]/);
    let cut: string;

    if (end > 0 && end <= 80) {
      cut = text.slice(0, end);
    } else {
      cut = text.length > 80 ? text.slice(0, 77) + '…' : text;
    }

    return cut.charAt(0).toUpperCase() + cut.slice(1);
  }

  /**
   * Returns the descriptive body of a step (everything after the first sentence).
   * If there is no second sentence, an empty string is returned.
   *
   * @param step - The step whose body should be extracted
   * @returns The remaining text after the first sentence or an empty string
   */
  getStepBody(step: GeneratedStep): string {
    if (!step?.text) return '';

    const text = step.text.trim();
    const end = text.search(/[.!?]/);

    if (end === -1) {
      return '';
    }

    const rest = text.slice(end + 1).trim();
    return rest;
  }

  /**
   * Checks if a step should be assigned to a given helper index.
   * Steps without an explicit helper are assigned to helper 1.
   *
   * @param step - Step to inspect
   * @param helperIndex - Helper index (1–4)
   * @returns True if the step is assigned to that helper
   */
  isStepForHelper(step: GeneratedStep, helperIndex: number): boolean {
    if (!step.assignedToHelper) return helperIndex === 1;
    return step.assignedToHelper === helperIndex;
  }

  /**
   * Starts the flow for creating a new recipe:
   * - resets user preferences
   * - navigates back to the ingredient selection screen
   */
  startNewRecipe(): void {
    this.preferencesState.reset();
    this.router.navigate(['/generate-recipe']);
  }

  /**
   * Normalizes a value that indicates whether an ingredient came from the user.
   * Accepts booleans, "true"/"false" strings, and 1/0 numbers.
   *
   * @param raw - Raw flag value from the recipe data
   * @returns True/false when recognized, otherwise `null`
   */
  private normalizeIsFromUser(raw: any): boolean | null {
    if (raw === true) return true;
    if (raw === false) return false;

    if (typeof raw === 'string') {
      const value = raw.toLowerCase().trim();
      if (value === 'true') return true;
      if (value === 'false') return false;
    }

    if (raw === 1) return true;
    if (raw === 0) return false;

    return null;
  }

  /**
   * Splits the given list of ingredients into two groups:
   * - userIngredients: ingredients originating from user input
   * - extraIngredients: additional ingredients suggested by the system
   *
   * If no explicit "isFromUser" information exists, all ingredients
   * are treated as user ingredients.
   *
   * @param ingredientsAny - Raw ingredient array from the recipe
   */
  private splitIngredients(ingredientsAny: any[]): void {
    const fromUser: any[] = [];
    const extras: any[] = [];

    for (const ing of ingredientsAny) {
      if (!ing) continue;

      const flag = this.normalizeIsFromUser((ing as any).isFromUser);

      if (flag === false) {
        extras.push(ing);
      } else {
        fromUser.push(ing);
      }
    }

    if (fromUser.length === 0 && ingredientsAny.length > 0) {
      this.userIngredients = ingredientsAny.filter(Boolean);
      this.extraIngredients = [];
    } else {
      this.userIngredients = fromUser;
      this.extraIngredients = extras;
    }
  }
}
