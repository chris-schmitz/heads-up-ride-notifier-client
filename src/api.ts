import {RouteIdentifier} from "@/domain/RouteIdentifier";
import axios from "axios";
import {RouteDetails} from "@/domain/RouteDetails";
import {GeographicCoordinates, RideWithGpsCoursePoint, Route} from "@/domain/Route";
import {RideWithGpsTrackPoints} from "@/domain/RideWithGpsTrackPoint";

// Todo: pull unit tests out
// right now we're mocking API calls for our routelist component, but really
// we should have some tests for the API tools specifically, even if we're still
// mocking out axios. We should be testing out the happy and sad paths for each
// of the API calls
interface RouteDetailsResponse {
    type: string,
    route: {
        name: string,
        bounding_box: [{ lat: number, lng: number }],
        course_points: [{ d: number, i: number, n: string, t: string, x: number, y: number }],
        track_points: [{ R: number, S: number, d: number, e: number, x: number, y: number }],
    }
}

export async function getRouteList(): Promise<Array<RouteIdentifier>> {
    // TODO: add in exception handling
    const response = await fetch("http://localhost:8080/recon/routes")
    const data: Array<{ id: number, name: string }> = await response.json()
    return data.map(item => new RouteIdentifier(item.id, item.name))
}

export async function getRouteDetails(routeId: string): Promise<RouteDetails> {
    const response = await fetch(`http://localhost:8080/recon/route/${routeId}`)
    const data: RouteDetailsResponse = await response.json()
    return buildRouteDetails(data)
}


function buildRouteDetails(data: RouteDetailsResponse) {
    const boundingBox =
        data.route.bounding_box
            .map(box => new GeographicCoordinates(box.lat, box.lng))
    const coursePoints =
        data.route.course_points.map(p => new RideWithGpsCoursePoint(p.d, p.i, p.n, p.t, p.x, p.y))
    const trackPoints =
        // TODO: figure out why the lat and lng are coming down as x and y
        data.route.track_points.map(p => new RideWithGpsTrackPoints(p.R, p.S, p.d, p.e, p.x, p.y))
    return new RouteDetails(
        data.type,
        new Route(
            data.route.name,
            boundingBox,
            coursePoints,
            trackPoints
        )
    )
}