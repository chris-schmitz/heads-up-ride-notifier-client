import {it, describe, expect, test, vi} from "vitest";
import {LatLng} from "leaflet";
import {mount} from "@vue/test-utils";
import RouteFeature from "../RouteFeature.vue";
import type {SaveRouteFeaturePayload} from "../../domain/SaveRouteFeaturePayload";
import type {DeleteRouteFeaturePayload} from "../../domain/DeleteRouteFeaturePayload";
import type {RouteFeatureProps} from "../../domain/RouteFeatureProps";
import type {UpdateRouteFeaturePayload} from "../../domain/UpdateRouteFeaturePayload";


describe("Route Feature", () => {
    it("can load with a specific latitude and longitude", () => {
        const expected = new LatLng(30.0, 90.0)
        const props = buildProps({point: expected})

        const componentWrapper = mount(RouteFeature, {props})

        const elementWrapper = componentWrapper.find({ref: 'point-display-element'})
        expect(elementWrapper.element.textContent).toBe(expected.toString())
    })

    it("can load with a route feature image", () => {
        const expected = "http://placekitten.com/50/50"
        const props = buildProps({image: expected})

        const componentWrapper = mount(RouteFeature, {props})

        const elementWrapper = componentWrapper.find({ref: 'feature-image-element'})
        expect((elementWrapper.element as HTMLImageElement).src).toBe(expected)
    })

    it("can load with a description", () => {
        const expected = "Meet here for lunch. There's a bike rack around back."
        const props
            = buildProps({description: expected})

        const componentWrapper = mount(RouteFeature, {props})

        const elementWrapper = componentWrapper.find({ref: 'feature-description-element'})
        expect((elementWrapper.element as HTMLTextAreaElement).value).toBe(expected)
    })

    it("can receive one description and emit a different on save", async () => {
        const props
            = buildProps({description: "passed down from parent", point: new LatLng(1, 2)})
        const expected: SaveRouteFeaturePayload = {
            description: "updated in child",
            image: "",
            point: new LatLng(1, 2)
        }

        const componentWrapper = mount(RouteFeature, {props})
        const elementWrapper = componentWrapper.find({ref: 'feature-description-element'})
        elementWrapper.setValue("updated in child")
        componentWrapper.find({ref: 'submit-button-element'}).trigger('click')
        await componentWrapper.vm.$nextTick()

        expect(componentWrapper.emitted()['save-route-feature'][0]).toEqual([expected])
    })

    it("can delete a route feature", async () => {
        const props = buildProps({featureId: 1})
        const expected: DeleteRouteFeaturePayload = {
            featureId: 1
        }

        const componentWrapper = mount(RouteFeature, {props})
        componentWrapper.find({ref: 'delete-button-element'}).trigger('click')
        await componentWrapper.vm.$nextTick()

        expect(componentWrapper.emitted()['delete-route-feature'][0]).toEqual([expected])
    })

    it("does not have a delete button for new features", () => {
        const props = buildProps()
        // ! note we're not passing in a feature ID. I don't want to make
        // ! featureId nullable just to explicitly show that we're intentionally
        // ! leaving it out, but I want to note it here since that is the way
        // ! we're determining if a feature is a "new" feature.

        const componentWrapper = mount(RouteFeature, {props})

        expect(componentWrapper.find({ref: 'delete-button-element'}).exists()).toBe(false)
    })

    it("can update an existing route feature", async () => {
        const props = buildProps({
            featureId: 123,
            description: "original description",
            image: "",
            point: new LatLng(4, 2)
        })
        const expected: UpdateRouteFeaturePayload = {
            featureId: 123,
            point: new LatLng(4, 2),
            description: "updated in child",
            image: ""
        }

        const componentWrapper = mount(RouteFeature, {props})
        const descriptionWrapper = componentWrapper.find({ref: 'feature-description-element'})
        descriptionWrapper.setValue("updated in child")
        // const imageWrapper = componentWrapper.find({ref: 'feature-image-element'})
        // imageWrapper.setValue("lol.png")
        componentWrapper.find({ref: 'submit-button-element'}).trigger('click')
        await componentWrapper.vm.$nextTick()

        expect(componentWrapper.emitted()['update-route-feature'][0]).toEqual([expected])
    })

    // * The way stack overflow does it is by:
    // - user clicks browse button -> selects file -> image preview on page
    // ? image preview before upload: https://stackoverflow.com/a/4459419/1934903
    // - user uploads -> post to api -> hosted image link returned
    // - image link used for render on actual post
    // ! Note !
    // * I can't figure out how to test a file input type :/
    // * I found this article that may be helpful, but TBH it's not what I feel like
    // * diving into at the moment. Worth reviewing later if this becomes a real thing
    // ? https://www.magjoyner.com/posts/2018-08-01-testing-file-inputs-in-vue-components/
    test.skip("can allow user to select a file for upload and render a preview before upload", async () => {
        const props = buildProps()
        const dataTransfer = new ClipboardEvent('').clipboardData!
        dataTransfer.items.add(new File(['image'], '500kitten.jpeg'))

        const componentWrapper = mount(RouteFeature, {props})
        const fileInput = componentWrapper.find({ref: 'feature-image-input'})
        ;(fileInput.element as HTMLInputElement).files = dataTransfer.files
        await fileInput.trigger('change')
        const preview = componentWrapper.find({ref: 'image-preview'})

        expect((preview.element as HTMLImageElement).src).toEqual('500kitten.jpeg')
    })

    it("can delete an image if the route feature is unsaved and closed", () => {
    })
    it("can delete an image if the route feature is deleted", () => {
    })

    global.fetch = vi.fn()

    // todo: consider moving out to it's own utility
    it("can send the route feature data to the server", async () => {
        const props = buildProps({
            description: "construction here, take path around",
            point: new LatLng(10, 10),
        })
        const imageFile = new File(["somebits"], "500kitten.jpeg")
        const form = new FormData()
        form.append("description", "construction here, take path around")
        form.append("point", JSON.stringify({latitude: 10, longitude: 10}))
        form.append("image", imageFile)

        const componentWrapper = mount(RouteFeature, {props})
        componentWrapper.find({ref: 'featureImageInput'}).setValue(imageFile)
        await componentWrapper.find({ref: 'submit-button-element'}).trigger('click')

        expect(fetch).toHaveBeenCalledWith(form)
    })
})

const propDetaults = {
    point: new LatLng(0, 0),
    image: "",
    description: "",
}

function buildProps(overrides?: {
    description?: string,
    point?: LatLng,
    image?: string,
    featureId?: number
}): RouteFeatureProps {
    return {
        ...propDetaults,
        ...overrides,
    }
}