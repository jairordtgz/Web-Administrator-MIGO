import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { CreateCampania } from './create-campania';

describe('CreateCampania', () => {
  let component: CreateCampania;
  let fixture: ComponentFixture<CreateCampania>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateCampania],
      providers: [
        provideHttpClient()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateCampania);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
