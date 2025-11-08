import { Component } from '@angular/core';
import { RouterLink } from '@angular/router'; 
import { HeaderPrimaryComponent } from '../../layout/headers/header-primary/header-primary.component';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [HeaderPrimaryComponent, RouterLink], 
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss'],
})
export class HeroComponent {}
