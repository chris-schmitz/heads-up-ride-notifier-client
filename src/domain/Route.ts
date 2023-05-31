import type {RideWithGpsTrackPoints} from "@/domain/RideWithGpsTrackPoint"
import {LatLng} from "leaflet";

export class Route {
    private _name: string
    private _boundingBox: Array<GeographicCoordinates>
    private _coursePoints: Array<RideWithGpsCoursePoint>
    private _trackPoints: Array<RideWithGpsTrackPoints>;

    constructor(
        name: string,
        boundingBox: Array<GeographicCoordinates>,
        coursePoints: Array<RideWithGpsCoursePoint>,
        trackPoints: Array<RideWithGpsTrackPoints>) {
        this._name = name;
        this._boundingBox = boundingBox;
        this._coursePoints = coursePoints;
        this._trackPoints = trackPoints;
    }

    get name(): string {
        return this._name;
    }

    get boundingBox(): Array<GeographicCoordinates> {
        return this._boundingBox;
    }

    get coursePoints(): Array<RideWithGpsCoursePoint> {
        return this._coursePoints;
    }

    get trackPoints(): Array<RideWithGpsTrackPoints> {
        return this._trackPoints;
    }

    get southWestBound(): LatLng {
        // TODO: consider exceptions
        // ? what happens if we don't have this index??
        return new LatLng(this.boundingBox[0].x, this.boundingBox[0].y)
    }

    get northEastBound(): LatLng {
        // TODO: consider exceptions
        // ? what happens if we don't have this index??
        return new LatLng(this.boundingBox[1].x, this.boundingBox[1].y)
    }
}

export class GeographicCoordinates {
    private _x: number
    private _y: number

    constructor(x: number, y: number) {
        this._x = x;
        this._y = y;
    }

    get x(): number {
        return this._x;
    }

    get y(): number {
        return this._y;
    }
}

export class RideWithGpsCoursePoint {
    private _distance: number
    private _i: number
    private _turnInstructions: string
    private _turnDirection: string
    private _x: number
    private _y: number

    constructor(distance: number, i: number, turnInstructions: string, turnDirection: string, x: number, y: number) {
        this._distance = distance;
        this._i = i;
        this._turnInstructions = turnInstructions;
        this._turnDirection = turnDirection;
        this._x = x;
        this._y = y;
    }

    get distance(): number {
        return this._distance;
    }

    get i(): number {
        return this._i;
    }

    get turnInstructions(): string {
        return this._turnInstructions;
    }

    get turnDirection(): string {
        return this._turnDirection;
    }

    get x(): number {
        return this._x;
    }

    get y(): number {
        return this._y;
    }

}

