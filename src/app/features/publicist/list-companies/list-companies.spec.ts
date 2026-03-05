import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { ListCompanies } from './list-companies';

describe('ListCompanies', () => {
  let component: ListCompanies;
  let fixture: ComponentFixture<ListCompanies>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListCompanies],
      providers: [
        provideHttpClient()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListCompanies);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
