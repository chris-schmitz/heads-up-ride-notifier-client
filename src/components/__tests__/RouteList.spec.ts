import {beforeEach, describe, expect, it, type Mock, vi} from "vitest";
import {flushPromises, mount} from "@vue/test-utils";
import RouteList from "../RouteList.vue";
import {RouteIdentifier} from "../../domain/RouteIdentifier";
import {GeographicCoordinates, RideWithGpsCoursePoint} from "../../domain/Route";

global.fetch = vi.fn()

function createFetchResponse(data: any) {
    return {json: () => new Promise((resolve) => resolve(data))}
}

describe("RouteList", () => {
    beforeEach(() => {
        vi.mock("leaflet", async () => {
            return {
                default: {
                    map: () => ({setView: vi.fn()}),
                    tileLayer: () => ({addTo: vi.fn()}),
                    marker: () => ({addTo: vi.fn()})
                }
            }
        })
    })

    it("renders properly", () => {
        const list = [
            new RouteIdentifier(1, "To the park and back")
        ]

        const wrapper = mount(RouteList,
            {props: {routeIdentifiers: list}}
        )

        expect(wrapper.text()).toContain("Planned Routes")
    })

    it("has selectable list of route identifiers on load", () => {
        const list = [
            new RouteIdentifier(1, "To the park and back")
        ]
        const wrapper = mount(RouteList, {props: {routeIdentifiers: list}})

        const option = wrapper.find('select').find('option')
        expect(option.element.value).toBe(list[0].id.toString())
        expect(option.element.text).toBe(list[0].routeName)
    })

    it("can select a route and make a call to get that route's details", async () => {
        const list = [
            new RouteIdentifier(1, "Grants trail 4 mile shaded")
        ]
        const details = '{"type":"route","route":{"name":"Grants trail 4 mile shaded","bounding_box":[{"lat":38.52072,"lng":-90.31865},{"lat":38.54253,"lng":-90.29736}],"course_points":[{"d":111.837,"i":4,"n":"Turn left","t":"Left","x":-90.29838,"y":38.54202}]}}';
        (fetch as Mock).mockResolvedValue(createFetchResponse(JSON.parse(details)))

        const wrapper = mount(RouteList, {props: {routeIdentifiers: list}})
        wrapper.find('select').setValue(1)
        await wrapper.find('button').trigger('click')

        await flushPromises()
        expect(wrapper.find('div').element.textContent).toBe('Grants trail 4 mile shaded')
        expect(wrapper.vm.boundingBox).toEqual({
            topLeft: new GeographicCoordinates(38.52072, -90.31865),
            bottomRight: new GeographicCoordinates(38.54253, -90.29736)
        })
        expect(wrapper.vm.coursePoints).toEqual([new RideWithGpsCoursePoint(111.837, 4, "Turn left", "Left", -90.29838, 38.54202)])
    })

    it("can populate the map with course points", () => {
    })
    it("can set the correct bounding box for the map", () => {
    })
})