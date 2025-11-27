// src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
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
export class AppComponent implements OnInit {
  title = 'code-a-cuisine';

  constructor(private readonly recipeSeedService: RecipeSeedService) { }

  // async ngOnInit(): Promise<void> {
  //   try {
  //     await this.recipeSeedService.seedInitialRecipes();
  //     console.log('Seed done');
  //   } catch (err) {
  //     console.error('Seed error', err);
  //   }
  // }
  
}
