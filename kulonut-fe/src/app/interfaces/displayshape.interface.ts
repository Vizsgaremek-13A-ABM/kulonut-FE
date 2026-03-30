import * as geojson from 'geojson';

export default interface DisplayShape{
  leaflet_id: number | null
  shape: geojson.GeoJsonObject
  polygon_id: number
  project_ids: number[]
  polygon_name: string
}
