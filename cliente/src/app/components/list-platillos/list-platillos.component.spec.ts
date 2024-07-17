import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPlatillosComponent } from './list-platillos.component';

describe('ListPlatillosComponent', () => {
  let component: ListPlatillosComponent;
  let fixture: ComponentFixture<ListPlatillosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListPlatillosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListPlatillosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
