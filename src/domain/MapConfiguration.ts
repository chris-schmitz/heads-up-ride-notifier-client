import type {GeographicCoordinates} from "@/domain/Route";
import type {LatLng} from "leaflet";

export class MapConfiguration {
    constructor(domElementId: string, center: LatLng, defaultZoom: number, maxZoom: number) {
        this._domElementId = domElementId;
        this._center = center;
        this._defaultZoom = defaultZoom;
        this._maxZoom = maxZoom;
    }

    get domElementId(): string {
        return this._domElementId;
    }

    get center(): LatLng {
        return this._center;
    }

    get defaultZoom(): number {
        return this._defaultZoom;
    }

    get maxZoom(): number {
        return this._maxZoom;
    }

    private _domElementId: string;
    private _center: LatLng;
    private _defaultZoom: number;
    private _maxZoom: number;

}
