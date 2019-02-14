import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { AsteroidsDataSource } from './asteroids.datasource';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MatPaginator } from '@angular/material';
import { AsteroidsService } from './asteroids.service';

@Component({
  selector: 'app-asteroids',
  templateUrl: './asteroids.component.html',
  styleUrls: ['./asteroids.component.css']
})
export class AsteroidsComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = ['neo_reference_id', 'name', 'designation', 'nasa_jpl_url', 'absolute_magnitude_h',
    'is_potentially_hazardous_asteroid'];
  dataSource: AsteroidsDataSource;

  pageSubscription: Subscription;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private asteroidsService: AsteroidsService) {
  }

  ngOnInit() {
    this.dataSource = new AsteroidsDataSource(this.asteroidsService);
  }

  ngAfterViewInit() {
    this.pageSubscription = this.paginator.page
      .pipe(
        tap(() => this.loadAsteroidsPage())
      )
      .subscribe();
  }

  ngOnDestroy() {
    if (this.pageSubscription) {
      this.pageSubscription.unsubscribe();
    }
  }
  loadAsteroidsPage() {
    this.dataSource.loadAsteroids(this.paginator.pageIndex, this.paginator.pageSize);
  }
}
