import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderPrimaryComponent } from './layout/headers/header-primary/header-primary.component';
import { RecipeSeedService } from './api/recipe-seed.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderPrimaryComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'code-a-cuisine';

  // constructor(private readonly recipeSeedService: RecipeSeedService) {
  //   // ⚠️ Nur temporär aktiv lassen, um die Seeds einmal zu schreiben!
  //   this.recipeSeedService.seedInitialRecipes();
  // }
}
