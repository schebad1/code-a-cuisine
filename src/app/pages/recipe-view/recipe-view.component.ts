import { Component } from '@angular/core';
import { HeaderSecondaryComponent } from '../../layout/headers/header-secondary/header-secondary.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-recipe-view',
  standalone: true,
  imports: [HeaderSecondaryComponent, RouterLink],
  templateUrl: './recipe-view.component.html',
  styleUrls: ['./recipe-view.component.scss']
})
export class RecipeViewComponent {}
