import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionTagComponent } from './gestion-tag.component';

describe('GestionTagComponent', () => {
  let component: GestionTagComponent;
  let fixture: ComponentFixture<GestionTagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GestionTagComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GestionTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
