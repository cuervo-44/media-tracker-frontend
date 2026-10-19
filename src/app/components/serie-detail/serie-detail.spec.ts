import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SerieDetail } from './serie-detail';

describe('SerieDetail', () => {
  let component: SerieDetail;
  let fixture: ComponentFixture<SerieDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SerieDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(SerieDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
