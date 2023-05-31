import type {Route} from "@/domain/Route";
import type {LatLng} from "leaflet";
import leaflet from "leaflet";

export class RouteDetails {
    private _type: string
    private _route: Route

    constructor(type: string, route: Route) {
        this._type = type;
        this._route = route;
    }

    get type(): string {
        return this._type;
    }

    get route(): Route {
        return this._route;
    }

}
