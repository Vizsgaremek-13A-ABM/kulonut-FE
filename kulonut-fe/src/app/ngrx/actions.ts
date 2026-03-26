import { createActionGroup, emptyProps, props } from '@ngrx/store';
import Project from '../interfaces/project.interface';
import Polygon from '../interfaces/polygon.interface';

export const ProjectActions = createActionGroup({
  source: "Projects",
  events: {
    "Add project": props<{project: Project}>(),
    "Remove project": props<{projectId: number}>(),
    "Update project": props<{projectId: number, project: Project}>(),
    "Get projects": props<{projects:Project[] | null}>(),
  }
});

export const PolygonActions = createActionGroup({
  source: "Polygons",
  events: {
    "Add polygon": props<{polygon: Polygon}>(),
    "Remove polygon": props<{polygonId: number}>(),
    "Update polygon": props<{polygonId: number, polygon: Polygon}>(),
    "Get polygons": props<{polygons:Polygon[] | null}>(),
  }
});
