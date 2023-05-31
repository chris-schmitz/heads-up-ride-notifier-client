import type {LatLng} from "leaflet";

export interface SaveRouteFeaturePayload {
    description: string,
    image: string,
    point: LatLng
}
