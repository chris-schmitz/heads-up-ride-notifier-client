export class RouteIdentifier {
    private _id: number;
    private _routeName: string;

    constructor(id: number, routeName: string) {
        this._id = id
        this._routeName = routeName
    }

    get id(): number {
        return this._id;
    }

    get routeName(): string {
        return this._routeName;
    }
}
