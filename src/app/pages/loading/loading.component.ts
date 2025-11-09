import { Component } from '@angular/core';
import { HeaderPrimaryComponent } from '../../layout/headers/header-primary/header-primary.component';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [HeaderPrimaryComponent],
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent {}
