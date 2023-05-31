export class RideWithGpsTrackPoints {
    private _e: number;
    private _R: number;
    private _S: number;
    private _d: number;
    private _longitude: number;
    private _latitude: number;

    constructor(R: number, S: number, d: number, e: number, x: number, y: number) {
        this._R = R;
        this._S = S;
        this._d = d;
        this._e = e;
        this._longitude = x;
        this._latitude = y
    }

    get e(): number {
        return this._e;
    }

    get R(): number {
        return this._R;
    }

    get S(): number {
        return this._S;
    }

    get d(): number {
        return this._d;
    }

    get longitude(): number {
        return this._longitude;
    }

    get latitude(): number {
        return this._latitude;
    }
}
