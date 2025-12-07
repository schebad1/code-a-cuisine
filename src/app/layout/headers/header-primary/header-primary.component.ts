import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header-primary',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header-primary.component.html',
  styleUrls: ['./header-primary.component.scss'],
})
export class HeaderPrimaryComponent {
  /**
   * Primary header component displayed at the top of main application pages.
   * Typically contains branding, navigation, or entry-point actions.
   *
   * This component is layout-only and does not implement any logic.
   */
  constructor() {}
}
