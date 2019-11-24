import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhaseZeroSettingComponent } from './phase-zero-setting.component';

describe('PhaseZeroSettingComponent', () => {
  let component: PhaseZeroSettingComponent;
  let fixture: ComponentFixture<PhaseZeroSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhaseZeroSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhaseZeroSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
