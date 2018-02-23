import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HappysadComponent } from './happysad.component';

describe('HappysadComponent', () => {
  let component: HappysadComponent;
  let fixture: ComponentFixture<HappysadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HappysadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HappysadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
