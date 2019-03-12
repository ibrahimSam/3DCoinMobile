import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { T3dcoinComponent } from './t3dcoin.component';

describe('T3dcoinComponent', () => {
  let component: T3dcoinComponent;
  let fixture: ComponentFixture<T3dcoinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ T3dcoinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(T3dcoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
