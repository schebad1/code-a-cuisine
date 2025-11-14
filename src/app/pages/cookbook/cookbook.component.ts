import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { HeaderSecondaryComponent } from '../../layout/headers/header-secondary/header-secondary.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cookbook',
  standalone: true,
  imports: [HeaderSecondaryComponent, RouterLink],
  templateUrl: './cookbook.component.html',
  styleUrls: ['./cookbook.component.scss'],
})
export class CookbookComponent {
  constructor(private location: Location) { }

  goBack(): void {
    this.location.back();
  }
}
