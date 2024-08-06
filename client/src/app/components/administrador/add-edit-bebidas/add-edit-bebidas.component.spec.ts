import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditBebidasComponent } from './add-edit-bebidas.component';

describe('AddEditBebidasComponent', () => {
  let component: AddEditBebidasComponent;
  let fixture: ComponentFixture<AddEditBebidasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddEditBebidasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditBebidasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
