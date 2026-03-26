import Coordinate from "./coord.interface"

export default interface Polygon{
    name: string
    polygon_id: number
    coordinates: Coordinate[]
}