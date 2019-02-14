import { TestBed, inject } from '@angular/core/testing';

import { AsteroidsService } from './asteroids.service';

import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { AsteroidsPage } from './model/asteroid-page.model';
import { environment } from 'src/environments/environment.prod';

const data = `{
  "links" : {
    "next" : "https://api.nasa.gov/neo/rest/v1/neo/browse?page=1&size=1&api_key=YHCjQHZ8t9obYFlFgkYMkq2JXdBX110AP09Kxf2H",
    "self" : "https://api.nasa.gov/neo/rest/v1/neo/browse?page=0&size=1&api_key=YHCjQHZ8t9obYFlFgkYMkq2JXdBX110AP09Kxf2H"
  },
  "page" : {
    "size" : 1,
    "total_elements" : 20404,
    "total_pages" : 20404,
    "number" : 0
  },
  "near_earth_objects" : [ {
    "links" : {
      "self" : "https://api.nasa.gov/neo/rest/v1/neo/2021277?api_key=YHCjQHZ8t9obYFlFgkYMkq2JXdBX110AP09Kxf2H"
    },
    "neo_reference_id" : "2021277",
    "name" : "21277 (1996 TO5)",
    "designation" : "21277",
    "nasa_jpl_url" : "http://ssd.jpl.nasa.gov/sbdb.cgi?sstr=2021277",
    "absolute_magnitude_h" : 16.1,
    "estimated_diameter" : {
      "kilometers" : {
        "estimated_diameter_min" : 1.6016033798,
        "estimated_diameter_max" : 3.5812940302
      },
      "meters" : {
        "estimated_diameter_min" : 1601.6033797856,
        "estimated_diameter_max" : 3581.2940301941
      },
      "miles" : {
        "estimated_diameter_min" : 0.9951898937,
        "estimated_diameter_max" : 2.2253122528
      },
      "feet" : {
        "estimated_diameter_min" : 5254.6044325359,
        "estimated_diameter_max" : 11749.652706022
      }
    },
    "is_potentially_hazardous_asteroid" : false,
    "close_approach_data" : [ {
      "close_approach_date" : "1945-06-07",
      "epoch_date_close_approach" : -775328400000,
      "relative_velocity" : {
        "kilometers_per_second" : "15.5094795876",
        "kilometers_per_hour" : "55834.1265155393",
        "miles_per_hour" : "34693.1548896138"
      },
      "miss_distance" : {
        "astronomical" : "0.0334237854",
        "lunar" : "13.0018520355",
        "kilometers" : "5000127",
        "miles" : "3106935"
      },
      "orbiting_body" : "Mars"
    } ],
    "orbital_data" : {
      "orbit_id" : "158",
      "orbit_determination_date" : "2019-02-05 08:20:48",
      "first_observation_date" : "1990-02-04",
      "last_observation_date" : "2019-02-04",
      "data_arc_in_days" : 10592,
      "observations_used" : 637,
      "orbit_uncertainty" : "0",
      "minimum_orbit_intersection" : ".312604",
      "jupiter_tisserand_invariant" : "3.267",
      "epoch_osculation" : "2458600.5",
      "eccentricity" : ".5206797080525609",
      "semi_major_axis" : "2.377072798046194",
      "inclination" : "20.95132914400998",
      "ascending_node_longitude" : "167.3838993898051",
      "orbital_period" : "1338.634920869237",
      "perihelion_distance" : "1.139379227539818",
      "perihelion_argument" : "250.1936721253258",
      "aphelion_distance" : "3.614766368552571",
      "perihelion_time" : "2458492.623761111173",
      "mean_anomaly" : "29.01123031719514",
      "mean_motion" : ".2689306803428044",
      "equinox" : "J2000",
      "orbit_class" : {
        "orbit_class_type" : "AMO",
        "orbit_class_range" : "1.017 AU < q (perihelion) < 1.3 AU",
        "orbit_class_description" : "Near-Earth asteroid orbits similar to that of 1221 Amor"
      }
    },
    "is_sentry_object" : false
  } ]
}`;

describe('AsteroidsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [AsteroidsService]
  }));

  it('should get all near earth objects', () => {
    inject(
      [HttpTestingController, AsteroidsService],
      (
        httpMock: HttpTestingController,
        dataService: AsteroidsService
      ) => {
        const mockData = JSON.parse(data) as AsteroidsPage;

        dataService.getAll(0, 1).subscribe(a => {
          expect(a).toEqual(mockData);
        });
        const mockReq = httpMock.expectOne(`${environment.baseUrl}/browse?api_key='DEMO_KEY'&size=1&page=0`);

        expect(mockReq.cancelled).toBeFalsy();
        expect(mockReq.request.responseType).toEqual('json');
        mockReq.flush(mockData);
        httpMock.verify();
      }
    );
  });
});
