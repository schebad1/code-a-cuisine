import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderPrimaryComponent } from './header-primary.component';

describe('HeaderPrimaryComponent', () => {
  let component: HeaderPrimaryComponent;
  let fixture: ComponentFixture<HeaderPrimaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderPrimaryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HeaderPrimaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
