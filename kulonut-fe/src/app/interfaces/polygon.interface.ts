import Coordinate from "./coord.interface"
import {SimplifiedProject} from "./project.interface"

export default interface Polygon{
    polygon_name: string
    polygon_id: number
    projects: SimplifiedProject[]
    coordinates: Coordinate[]
}