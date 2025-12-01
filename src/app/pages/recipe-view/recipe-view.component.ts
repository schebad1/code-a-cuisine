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
  recipe: FirestoreRecipe | null = null;

  isLoading = true;
  notFound = false;

  dietLabel = '';
  timeCategoryLabel = '';
  randomLikes = 0;
  helperCount = 1;

  userIngredients: any[] = [];
  extraIngredients: any[] = [];
  steps: GeneratedStep[] = [];

  hasLiked = false;

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

  toggleLike(): void {
    this.hasLiked = !this.hasLiked;
  }

  private getTimeCategoryLabel(totalMinutes: number): string {
    if (totalMinutes <= 20) return 'Quick';
    if (totalMinutes <= 40) return 'Medium';
    return 'Complex';
  }

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
   * Gibt den Beschreibungs-Teil eines Steps zurück (alles nach dem ersten Satz).
   * Wenn es keinen zweiten Satz gibt, wird ein leerer String zurückgegeben.
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

  isStepForHelper(step: GeneratedStep, helperIndex: number): boolean {
    if (!step.assignedToHelper) return helperIndex === 1;
    return step.assignedToHelper === helperIndex;
  }

  startNewRecipe(): void {
    this.preferencesState.reset();
    this.router.navigate(['/generate-recipe']);
  }

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
