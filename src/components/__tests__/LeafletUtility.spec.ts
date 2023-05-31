import {it, describe, beforeEach, vi, expect, Mock} from "vitest";
import {GeographicCoordinates} from "../../domain/Route";
import {MapConfiguration} from "../../domain/MapConfiguration";
import {attachMap} from "../../utilities/LeafletUtility";
import leaflet, {Map} from "leaflet"

describe("Leaflet Utility", () => {
    beforeEach(() => {
        vi.mock("leaflet", async () => {
            return {
                default: {
                    map: vi.fn()
                        .mockReturnValue({setView: vi.fn()})
                }
            }
        })
    })


    it("can attach a map to the dom", () => {
        const config = new MapConfiguration(
            "map",
            new GeographicCoordinates(38.0, -90.0),
            15,
            19
        )

        attachMap(config)

        expect(leaflet.map).toHaveBeenCalled()
        expect(mapResult).toHaveBeenCalled()
    })
    it("can add markers to a map", () => {
    })
    it("can update the map's bounding box", () => {
    })

})