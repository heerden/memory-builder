import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemoryGridComponent } from './memory-grid.component';

describe('MemoryGridComponent', () => {
  let component: MemoryGridComponent;
  let fixture: ComponentFixture<MemoryGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemoryGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemoryGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
