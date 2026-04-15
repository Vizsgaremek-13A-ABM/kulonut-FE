import * as geojson from 'geojson';

export default interface DisplayShape{
  leaflet_id: number | null
  shape: geojson.GeoJsonObject
  polygon_id: number | null
  project_ids: number[]
  polygon_name: string
  isNew: boolean
  isModified: boolean
  isDeleted: boolean
  partOfCurrentProject: boolean
  partOfCurrentProjectDefault: boolean
}
