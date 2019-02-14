import { Asteroid } from './model/asteroid.model';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { DataSource } from '@angular/cdk/table';
import { AsteroidsService } from './asteroids.service';
import { CollectionViewer } from '@angular/cdk/collections';
import { AsteroidsPage } from './model/asteroid-page.model';
import { catchError, finalize, map } from 'rxjs/operators';

export class AsteroidsDataSource implements DataSource<Asteroid> {

    private asteroidsSubject = new BehaviorSubject<Asteroid[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();

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
                catchError((err) => { console.log(err); return of([]); }),
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
}
