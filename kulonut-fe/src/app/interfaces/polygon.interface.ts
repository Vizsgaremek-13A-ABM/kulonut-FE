import Coordinate from "./coord.interface"
import {SimplifiedProject} from "./project.interface"

export default interface Polygon{
    name: string
    polygon_id: number
    projects: SimplifiedProject[]
    coordinates: Coordinate[]
}