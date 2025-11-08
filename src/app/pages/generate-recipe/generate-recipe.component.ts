import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeaderSecondaryComponent } from '../../layout/headers/header-secondary/header-secondary.component';

@Component({
  selector: 'app-generate-recipe',
  standalone: true,
  imports: [RouterLink, HeaderSecondaryComponent],
  templateUrl: './generate-recipe.component.html',
  styleUrls: ['./generate-recipe.component.scss'],
})
export class GenerateRecipeComponent {}
