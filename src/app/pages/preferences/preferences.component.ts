import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeaderSecondaryComponent } from '../../layout/headers/header-secondary/header-secondary.component';

@Component({
  selector: 'app-preferences',
  standalone: true,
  imports: [RouterLink, HeaderSecondaryComponent],
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss'], 
})
export class PreferencesComponent {}
