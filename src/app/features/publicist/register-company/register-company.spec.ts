import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterCompanyPublicist } from './register-company';

describe('RegisterCompanyPublicist', () => {
  let component: RegisterCompanyPublicist;
  let fixture: ComponentFixture<RegisterCompanyPublicist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterCompanyPublicist]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterCompanyPublicist);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
