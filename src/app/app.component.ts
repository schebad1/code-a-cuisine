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
  /** Application title displayed in the root template. */
  title = 'code-a-cuisine';

  /**
   * Root component of the application.  
   * The constructor previously allowed seeding initial recipes into Firestore.
   * This is intentionally commented out because seeding should only happen manually.
   */
  // constructor(private readonly recipeSeedService: RecipeSeedService) {
  //   // ⚠️ Only enable temporarily when the database should be seeded once.
  //   this.recipeSeedService.seedInitialRecipes();
  // }
}
