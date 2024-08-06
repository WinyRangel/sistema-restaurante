import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditPlatillosComponent } from './add-edit-platillos.component';

describe('AddEditPlatillosComponent', () => {
  let component: AddEditPlatillosComponent;
  let fixture: ComponentFixture<AddEditPlatillosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddEditPlatillosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditPlatillosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
