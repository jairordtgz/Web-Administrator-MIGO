import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrarConduc } from './administrar-conduc';

describe('AdministrarConduc', () => {
  let component: AdministrarConduc;
  let fixture: ComponentFixture<AdministrarConduc>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdministrarConduc]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdministrarConduc);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
