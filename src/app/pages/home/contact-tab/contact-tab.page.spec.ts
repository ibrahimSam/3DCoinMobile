import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactTabPage } from './contact-tab.page';

describe('ContactTabPage', () => {
  let component: ContactTabPage;
  let fixture: ComponentFixture<ContactTabPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactTabPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactTabPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
