import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { HeaderSecondaryComponent } from '../../layout/headers/header-secondary/header-secondary.component';
import { Router, RouterLink } from '@angular/router';
import { Cuisine } from '../../api/recipe-library.service';

@Component({
  selector: 'app-cookbook',
  standalone: true,
  imports: [HeaderSecondaryComponent, RouterLink],
  templateUrl: './cookbook.component.html',
  styleUrls: ['./cookbook.component.scss'],
})
export class CookbookComponent {
  constructor(
    private readonly location: Location,
    private readonly router: Router,
  ) {}

  goBack(): void {
    this.location.back();
  }

  openCuisine(cuisine: Cuisine): void {
    this.router.navigate(['/recipes'], {
      queryParams: { cuisine },
    });
  }
}
