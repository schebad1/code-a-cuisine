import { Component } from '@angular/core';

@Component({
  selector: 'app-footer-primary',
  standalone: true,
  imports: [],
  templateUrl: './footer-primary.component.html',
  styleUrls: ['./footer-primary.component.scss'] 
})
export class FooterPrimaryComponent {
  /**
   * Primary footer component displayed at the bottom of the application.
   * Contains static layout and optional navigation or branding elements.
   *
   * This component has no logic and serves purely as a layout element.
   */
  constructor() {}
}
