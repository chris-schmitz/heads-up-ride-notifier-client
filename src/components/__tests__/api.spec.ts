import {it, describe, vi, type Mock, expect} from "vitest";
import {RouteIdentifier} from "../../domain/RouteIdentifier";
import {getRouteDetails, getRouteList} from "../../api";
import {RouteDetails} from "../../domain/RouteDetails";
import {GeographicCoordinates, RideWithGpsCoursePoint, Route} from "../../domain/Route";

global.fetch = vi.fn()

function createFetchResponse(data: any) {
    return {json: () => new Promise((resolve) => resolve(data))}
}

// TODO: add in sad paths??

describe("api", () => {
    it("can get a list of routes", async () => {
        const routeList = [{id: 123, name: "my route"}]
        const expected = [new RouteIdentifier(123, "my route")]
        ;(fetch as Mock).mockResolvedValue(createFetchResponse(routeList))

        const actual = getRouteList()

        expect(await actual).toEqual(expected)
    })
    it("can get a details for a specific route", async () => {
        const routeDetails = {
            "type": "route",
            "route": {
                "name": "Grants trail 4 mile shaded",
                "bounding_box": [{"lat": 38.52072, "lng": -90.31865}, {"lat": 38.54253, "lng": -90.29736}],
                "course_points": [{
                    "d": 111.837,
                    "i": 4,
                    "n": "Turn left",
                    "t": "Left",
                    "x": -90.29838,
                    "y": 38.54202
                }]
            }
        }
        const expected =
            new RouteDetails(
                "route",
                new Route(
                    "Grants trail 4 mile shaded",
                    [
                        new GeographicCoordinates(38.52072, -90.31865),
                        new GeographicCoordinates(38.54253, -90.29736)
                    ],
                    [
                        new RideWithGpsCoursePoint(
                            111.837,
                            4,
                            "Turn left",
                            "Left",
                            -90.29838,
                            38.54202
                        )
                    ]
                )
            )

        ;(fetch as Mock).mockResolvedValue(createFetchResponse(routeDetails))

        const actual = getRouteDetails(123)

        expect(await actual).toEqual(expected)
    })
})
