import Coordinate from "./coord.interface"
import Project from "./project.interface"

export default interface Polygon{
    name: string
    polygon_id: number
    projects: Project[] //simplified
    coordinates: Coordinate[]
}