import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeaderSecondaryComponent } from '../../layout/headers/header-secondary/header-secondary.component';
import { NgIf, NgForOf } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RecipeLibraryService } from '../../api/recipe-library.service';
import { FirestoreRecipe } from '../../api/recipe-seed.data';
import { GeneratedStep } from '../../api/recipe-api.contracts';

@Component({
  selector: 'app-recipe-view',
  standalone: true,
  imports: [HeaderSecondaryComponent, RouterLink, NgIf, NgForOf],
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

  stepsRow1: GeneratedStep[] = [];
  stepsRow2: GeneratedStep[] = [];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly recipeLibrary: RecipeLibraryService
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
        const maxHelper = Math.max(...r.steps.map((s) => s.assignedToHelper ?? 1));
        this.helperCount = Math.min(Math.max(maxHelper, 1), 3);
      } else {
        this.helperCount = 1;
      }

      const ingredientsAny = r.ingredients;
      if (Array.isArray(ingredientsAny)) {
        this.userIngredients = ingredientsAny.filter((ing: any) => ing?.isFromUser);
        this.extraIngredients = ingredientsAny.filter((ing: any) => !ing?.isFromUser);
      }

      if (Array.isArray(r.steps) && r.steps.length > 0) {
        const sorted = [...r.steps].sort((a, b) => a.order - b.order);
        const middle = Math.ceil(sorted.length / 2);
        this.stepsRow1 = sorted.slice(0, middle);
        this.stepsRow2 = sorted.slice(middle);
      }
    });
  }

  private getTimeCategoryLabel(totalMinutes: number): string {
    if (totalMinutes <= 20) return 'Quick';
    if (totalMinutes <= 40) return 'Medium';
    return 'Complex';
  }

  private getDietLabel(diet: string): string {
    switch (diet) {
      case 'vegetarian': return 'Vegetarian';
      case 'vegan': return 'Vegan';
      case 'keto': return 'Keto';
      case 'none':
      default: return 'No preferences';
    }
  }

  getStepTitle(step: GeneratedStep): string {
    if (!step?.text) return `Step ${step.order}`;
    const text = step.text.trim();
    const end = text.search(/[.!?]/);
    let cut: string;
    if (end > 0 && end <= 80) cut = text.slice(0, end);
    else cut = text.length > 80 ? text.slice(0, 77) + '…' : text;
    return cut.charAt(0).toUpperCase() + cut.slice(1);
  }

  isStepForHelper(step: GeneratedStep, helperIndex: number): boolean {
    if (!step.assignedToHelper) return helperIndex === 1;
    return step.assignedToHelper === helperIndex;
  }
}
