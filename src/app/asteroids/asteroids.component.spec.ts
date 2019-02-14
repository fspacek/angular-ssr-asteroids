import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsteroidsComponent } from './asteroids.component';
import { MaterialModule } from '../material.module';
import { Observable, of } from 'rxjs';
import { AsteroidsPage } from './model/asteroid-page.model';
import { AsteroidsService } from './asteroids.service';
import { DatePipe, DecimalPipe } from '@angular/common';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('AsteroidsComponent', () => {
  let component: AsteroidsComponent;
  let fixture: ComponentFixture<AsteroidsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AsteroidsComponent],
      imports: [MaterialModule],
      providers: [{ provide: AsteroidsService, useClass: MockAsteroidsService }, DatePipe, DecimalPipe]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsteroidsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create table with header', () => {
    const compiled: DebugElement = fixture.debugElement;

    const headers = [];
    compiled.nativeElement.querySelectorAll('th').forEach(element => headers.push(element.textContent));
    expect(headers).toEqual(['Name', 'Close Approach Date', 'Miss Distance', 'Potentially Hazardous', '']);
  });
});

class MockAsteroidsService {

  dataStorage: AsteroidsPage[];

  getAll(page: number, size: number): Observable<AsteroidsPage[]> {
    return of(this.dataStorage);
  }
}
