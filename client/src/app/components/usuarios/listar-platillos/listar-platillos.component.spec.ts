import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarPlatillosComponent } from './listar-platillos.component';

describe('ListarPlatillosComponent', () => {
  let component: ListarPlatillosComponent;
  let fixture: ComponentFixture<ListarPlatillosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListarPlatillosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarPlatillosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
