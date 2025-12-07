import { Component } from '@angular/core';

@Component({
  selector: 'app-footer-secondary',
  standalone: true,
  imports: [],
  templateUrl: './footer-secondary.component.html',
  styleUrls: ['./footer-secondary.component.scss'] 
})
export class FooterSecondaryComponent {
  /**
   * Secondary footer component used on pages that require a reduced
   * or more subtle footer layout compared to the primary footer.
   *
   * This component contains no logic and serves a purely presentational role.
   */
  constructor() {}
}
