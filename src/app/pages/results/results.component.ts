import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeaderPrimaryComponent } from '../../layout/headers/header-primary/header-primary.component';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [HeaderPrimaryComponent, RouterLink],
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent {}
