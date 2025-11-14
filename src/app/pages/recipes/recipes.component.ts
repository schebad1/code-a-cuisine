import { Component } from '@angular/core';
import { HeaderSecondaryComponent } from '../../layout/headers/header-secondary/header-secondary.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-recipes',
  standalone: true,
  imports: [
    HeaderSecondaryComponent,
    RouterModule
  ],
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss']
})
export class RecipesComponent {}
