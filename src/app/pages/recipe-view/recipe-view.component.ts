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
    if (!id) return;

    this.recipeLibrary.getRecipeById(id).subscribe((r) => {
      if (!r) return;
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
        this.userIngredients = ingredientsAny.filter((ing: any) => ing && ing.isFromUser);
        this.extraIngredients = ingredientsAny.filter((ing: any) => ing && !ing.isFromUser);
      } else {
        this.userIngredients = [];
        this.extraIngredients = [];
      }

      if (Array.isArray(r.steps) && r.steps.length > 0) {
        const sortedSteps = [...r.steps].sort((a, b) => a.order - b.order);
        const middleIndex = Math.ceil(sortedSteps.length / 2);
        this.stepsRow1 = sortedSteps.slice(0, middleIndex);
        this.stepsRow2 = sortedSteps.slice(middleIndex);
      } else {
        this.stepsRow1 = [];
        this.stepsRow2 = [];
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
    const sentenceEnd = text.search(/[.!?]/);
    let candidate: string;
    if (sentenceEnd > 0 && sentenceEnd <= 80) {
      candidate = text.slice(0, sentenceEnd);
    } else {
      candidate = text.length > 80 ? text.slice(0, 77) + '…' : text;
    }
    return candidate.charAt(0).toUpperCase() + candidate.slice(1);
  }

  isStepForHelper(step: GeneratedStep, helperIndex: number): boolean {
    if (!step.assignedToHelper) return helperIndex === 1;
    return step.assignedToHelper === helperIndex;
  }
}
