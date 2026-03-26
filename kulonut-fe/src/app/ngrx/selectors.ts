import { createFeatureSelector } from "@ngrx/store";
import {Project} from '../interfaces/project.interface';
import Polygon from "../interfaces/polygon.interface";

export const selectProjects = createFeatureSelector<Project[] | null>('projects');
export const selectPolygons = createFeatureSelector<Polygon[] | null>('polygons');

