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
          recipe?: GeneratedRecipe;
        }
      | undefined;
    const stateFromHistory = history.state as { recipe?: GeneratedRecipe } | undefined;

    const recipe = stateFromNav?.recipe ?? stateFromHistory?.recipe;

    if (!recipe) {
      console.warn('Kein Rezept im Router-State – zurück zu /results');
      this.router.navigate(['/results']);
      return;
    }

    this.recipe = recipe;
    this.dietLabel = this.getDietLabel(recipe.diet);
    this.timeCategoryLabel = this.getTimeCategoryLabel(recipe.totalMinutes);
    this.randomLikes = Math.floor(Math.random() * 52) + 48;

    this.userIngredients = recipe.ingredients.filter((ing) => ing.isFromUser);
    this.extraIngredients = recipe.ingredients.filter((ing) => !ing.isFromUser);

    if (recipe.steps && recipe.steps.length > 0) {
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

}
