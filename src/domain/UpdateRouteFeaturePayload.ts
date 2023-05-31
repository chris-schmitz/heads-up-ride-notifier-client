import type {LatLng} from "leaflet";

export interface UpdateRouteFeaturePayload {
    featureId: number,
    description: string,
    image: string,
    point: LatLng
}
