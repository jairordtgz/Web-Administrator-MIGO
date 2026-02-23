import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Brandeo } from './brandeo';

describe('Brandeo', () => {
  let component: Brandeo;
  let fixture: ComponentFixture<Brandeo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Brandeo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Brandeo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
