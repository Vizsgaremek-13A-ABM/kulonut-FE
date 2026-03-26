import { createReducer, on } from '@ngrx/store';
import Project from '../interfaces/project.interface';
import { PolygonActions, ProjectActions } from './actions';
import Polygon from '../interfaces/polygon.interface';

export const projectsInitialState:Project[] | null = null;
export const polygonsInitialState:Polygon[] | null = null;

export const projectsReducer = createReducer<Project[] | null>(
  projectsInitialState,
  on(ProjectActions.addProject, (_state, { project }) => {
    if(_state?.indexOf(project)! > -1) return _state
    return [..._state!, project]
  }),
  on(ProjectActions.removeProject, (_state, { projectId }) => _state?.filter(x => x.id != projectId) ?? null),
  on(ProjectActions.updateProject, (_state, { projectId, project }) => {
    return _state?.map(p =>
        p.id === projectId ? project : p
    ) ?? null;
  }),
  on(ProjectActions.getProjects, (_state, { projects }) => projects)
);

export const polygonsReducer = createReducer<Polygon[] | null>(
  polygonsInitialState,
  on(PolygonActions.addPolygon, (_state, { polygon }) => {
    if(_state?.indexOf(polygon)! > -1) return _state
    return [..._state!, polygon]
  }),
  on(PolygonActions.removePolygon, (_state, { polygonId }) => _state?.filter(x => x.polygon_id != polygonId) ?? null),
  on(PolygonActions.updatePolygon, (_state, { polygonId, polygon }) => {
    return _state?.map(p =>
        p.polygon_id === polygonId ? polygon : p
    ) ?? null;
  }),
  on(PolygonActions.getPolygons, (_state, { polygons }) => polygons)
);