import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCarritosComponent } from './list-carritos.component';

describe('ListCarritosComponent', () => {
  let component: ListCarritosComponent;
  let fixture: ComponentFixture<ListCarritosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListCarritosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListCarritosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
