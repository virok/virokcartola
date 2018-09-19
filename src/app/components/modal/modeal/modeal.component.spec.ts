import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModealComponent } from './modeal.component';

describe('ModealComponent', () => {
  let component: ModealComponent;
  let fixture: ComponentFixture<ModealComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModealComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModealComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
