import { createActionGroup, emptyProps, props } from '@ngrx/store';
import Project from '../../interfaces/project.interface';

export const ProjectActions = createActionGroup({
  source: "Projects",
  events: {
    "Add project": props<{project: Project}>(),
    "Remove project": props<{projectId: number}>(),
    "Update project": props<{projectId: number, project: Project}>(),
    "Get projects": props<{projects:Project[] | null}>(),
  }
});
