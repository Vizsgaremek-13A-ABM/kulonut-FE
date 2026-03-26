import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Observable, map } from 'rxjs';
import Project from '../interfaces/project.interface';
import { environment } from '../../environments/enviromnent';
import Polygon from '../interfaces/polygon.interface';

@Injectable({ providedIn: 'root' })
export class ProjectsService {
  private readonly http = inject(HttpClient);
  private API_URL = environment.apiUrl

  GetProjects(): Observable<Array<Project>> {
    return this.http.get<{data: Project[];}>(`${this.API_URL}/projects`)
      .pipe(map((x) => x.data || []));
  }
  GetPolygons(): Observable<Array<Polygon>> {
    return this.http.get<{data: Polygon[];}>(`${this.API_URL}/polygons`)
      .pipe(map((x) => x.data || []));
  }
}