import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterSecondaryComponent } from './footer-secondary.component';

describe('FooterSecondaryComponent', () => {
  let component: FooterSecondaryComponent;
  let fixture: ComponentFixture<FooterSecondaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterSecondaryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FooterSecondaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
