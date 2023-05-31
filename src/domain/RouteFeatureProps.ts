import type {LatLng} from "leaflet";

export interface RouteFeatureProps {
    point: LatLng,
    image: string,
    description: string,
    featureId?: number
}
