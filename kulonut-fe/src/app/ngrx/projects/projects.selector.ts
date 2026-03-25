import { createFeatureSelector } from "@ngrx/store";
import Project from '../../interfaces/project.interface';

export const selectProjects = createFeatureSelector<Project[] | null>('projects');

