import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisgerComponent } from './regisger.component';

describe('RegisgerComponent', () => {
  let component: RegisgerComponent;
  let fixture: ComponentFixture<RegisgerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisgerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
