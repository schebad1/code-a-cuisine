import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HeaderSecondaryComponent } from '../../layout/headers/header-secondary/header-secondary.component';
import { NgIf, NgForOf } from '@angular/common';
import { GeneratedRecipe, GeneratedStep } from '../../api/recipe-api.contracts';

@Component({
  selector: 'app-recipe-view',
  standalone: true,
  imports: [HeaderSecondaryComponent, RouterLink, NgIf, NgForOf],
  templateUrl: './recipe-view.component.html',
  styleUrls: ['./recipe-view.component.scss'],
})
export class RecipeViewComponent implements OnInit {
  recipe: GeneratedRecipe | null = null;
  dietLabel = '';
  timeCategoryLabel = '';
  randomLikes = 0;
  helperCount = 1;

  userIngredients: GeneratedRecipe['ingredients'] = [];
  extraIngredients: GeneratedRecipe['ingredients'] = [];

  stepsRow1: GeneratedStep[] = [];
  stepsRow2: GeneratedStep[] = [];

  constructor(private readonly router: Router) {}

  ngOnInit(): void {
    console.log('RecipeView init');
    console.log(
      'router.getCurrentNavigation():',
      this.router.getCurrentNavigation(),
    );
    console.log('history.state:', history.state);

    const nav = this.router.getCurrentNavigation();
    const stateFromNav = nav?.extras.state as
      | {
          recipe?: unknown;
        }
      | undefined;
    const stateFromHistory = history.state as { recipe?: unknown } | undefined;

    const recipeFromState = stateFromNav?.recipe ?? stateFromHistory?.recipe;

    if (!recipeFromState) {
      console.warn('Kein Rezept im Router-State – zurück zu /results');
      this.router.navigate(['/results']);
      return;
    }

    // Wir gehen davon aus, dass das Objekt das GeneratedRecipe-Schema hat
    // oder zumindest kompatible Felder (title, totalMinutes, diet, steps).
    const recipe = recipeFromState as GeneratedRecipe;
    this.recipe = recipe;

    this.dietLabel = this.getDietLabel(recipe.diet);
    this.timeCategoryLabel = this.getTimeCategoryLabel(recipe.totalMinutes);
    this.randomLikes = Math.floor(Math.random() * 52) + 48;

    // Helfer-Anzahl aus den Steps ableiten (max assignedToHelper, mind. 1, max. 3)
    if (Array.isArray(recipe.steps) && recipe.steps.length > 0) {
      const maxHelper = Math.max(
        ...recipe.steps.map((s) => (s.assignedToHelper ?? 1)),
      );
      this.helperCount = Math.min(Math.max(maxHelper, 1), 3);
    } else {
      this.helperCount = 1;
    }

    // Ingredients robust behandeln – können bei Library-Rezepten fehlen
    const ingredientsAny = (recipe as any).ingredients;
    if (Array.isArray(ingredientsAny)) {
      this.userIngredients = ingredientsAny.filter(
        (ing: any) => ing && ing.isFromUser,
      );
      this.extraIngredients = ingredientsAny.filter(
        (ing: any) => ing && !ing.isFromUser,
      );
    } else {
      this.userIngredients = [];
      this.extraIngredients = [];
    }

    // Steps sortieren und in zwei Spalten splitten – nur wenn vorhanden
    if (Array.isArray(recipe.steps) && recipe.steps.length > 0) {
      const sortedSteps = [...recipe.steps].sort((a, b) => a.order - b.order);
      const middleIndex = Math.ceil(sortedSteps.length / 2);

      this.stepsRow1 = sortedSteps.slice(0, middleIndex);
      this.stepsRow2 = sortedSteps.slice(middleIndex);
    } else {
      this.stepsRow1 = [];
      this.stepsRow2 = [];
    }

    console.log('Aktives Rezept in RecipeView:', this.recipe);
  }

  private getTimeCategoryLabel(totalMinutes: number): string {
    if (totalMinutes <= 20) {
      return 'Quick';
    }
    if (totalMinutes <= 40) {
      return 'Medium';
    }
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
    if (!step?.text) {
      return `Step ${step.order}`;
    }

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
    if (!step.assignedToHelper) {
      // Fallback: wenn nichts gesetzt, landet es bei Chef 1
      return helperIndex === 1;
    }
    return step.assignedToHelper === helperIndex;
  }
}
