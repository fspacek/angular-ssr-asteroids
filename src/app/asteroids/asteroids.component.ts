import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { AsteroidsDataSource } from './asteroids.datasource';
import { Subscription } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { MatPaginator } from '@angular/material';
import { AsteroidsService } from './asteroids.service';
import { Asteroid } from './model/asteroid.model';
import { DatePipe, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-asteroids',
  templateUrl: './asteroids.component.html',
  styleUrls: ['./asteroids.component.css']
})
export class AsteroidsComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = ['name', 'closeApproachDate', 'missDistance', 'hazardous', 'detailsLink'];
  dataSource: AsteroidsDataSource;

  pageSubscription: Subscription;
  loadingErrorMessage: string;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(private asteroidsService: AsteroidsService, private datePipe: DatePipe, private decimalPipe: DecimalPipe) {
  }

  ngOnInit() {
    this.dataSource = new AsteroidsDataSource(this.asteroidsService);
    this.dataSource.loadAsteroids(0, 10);

    this.dataSource.loadingError$
      .pipe(map(e => this.loadingErrorMessage = e != null ? e.error.error.message : null))
      .subscribe();
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

  closeApproachDate(row: Asteroid): string {
    return this.hasCloseApproachData(row) ? this.datePipe.transform(row.close_approach_data[0].close_approach_date) : 'N/A';
  }

  missDistance(row: Asteroid): string {
    return this.hasCloseApproachData(row)
      ? `${this.decimalPipe.transform(row.close_approach_data[0].miss_distance.kilometers)} Km`
      : 'N/A';
  }

  private hasCloseApproachData(row: Asteroid) {
    return row.close_approach_data && row.close_approach_data.length > 0;
  }
}
