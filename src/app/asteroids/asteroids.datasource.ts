import { Asteroid } from './model/asteroid.model';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { DataSource } from '@angular/cdk/table';
import { AsteroidsService } from './asteroids.service';
import { CollectionViewer } from '@angular/cdk/collections';
import { AsteroidsPage } from './model/asteroid-page.model';
import { catchError, finalize, map } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

export class AsteroidsDataSource implements DataSource<Asteroid> {

    private asteroidsSubject = new BehaviorSubject<Asteroid[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private loadingErrorSubject = new BehaviorSubject<HttpErrorResponse>(null);

    public loading$ = this.loadingSubject.asObservable();
    public loadingError$ = this.loadingErrorSubject.asObservable();

    private _totalElements = 0;

    constructor(private asteroidsService: AsteroidsService) { }

    connect(collectionViewer: CollectionViewer): Observable<Asteroid[]> {
        return this.asteroidsSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.asteroidsSubject.complete();
        this.loadingSubject.complete();
    }

    loadAsteroids(pageIndex: number, pageSize: number) {
        this.loadingSubject.next(true);

        this.asteroidsService.getAll(pageIndex, pageSize)
            .pipe(
                catchError((err) => this.handleError(err)),
                finalize(() => this.loadingSubject.next(false)))
            .pipe(map((res: AsteroidsPage) => {
                if (res.near_earth_objects) {
                    this._totalElements = res.page.total_elements;
                    return res.near_earth_objects;
                }
            }
            ))
            .subscribe(asteroids => this.asteroidsSubject.next(asteroids));
    }

    get totalElements() {
        return this._totalElements;
    }

    private handleError(err) {
        console.log(err);
        this.loadingErrorSubject.next(err);
        return of([]);
    }
}
