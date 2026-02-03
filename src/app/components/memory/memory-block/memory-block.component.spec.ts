import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemoryBlockComponent } from './memory-block.component';

describe('MemoryBlockComponent', () => {
  let component: MemoryBlockComponent;
  let fixture: ComponentFixture<MemoryBlockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemoryBlockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemoryBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
