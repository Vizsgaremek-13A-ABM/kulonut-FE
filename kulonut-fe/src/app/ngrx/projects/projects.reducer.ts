import { createReducer, on } from '@ngrx/store';
import Project from '../../interfaces/project.interface';
import { ProjectActions } from './projects.actions';

export const initialState:Project[] | null = null;

export const projectsReducer = createReducer<Project[] | null>(
  initialState,
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