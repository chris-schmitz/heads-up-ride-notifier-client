<script setup lang="ts">
import {RouteIdentifier} from "@/domain/RouteIdentifier";
import {onMounted, reactive, ref} from "vue";
import Vue from "vue"
import {getRouteDetails} from "@/api";
import leaflet, {LatLng, Layer, LeafletMouseEvent, Marker} from "leaflet"
import {GeographicCoordinates, RideWithGpsCoursePoint} from "@/domain/Route";
import type {RideWithGpsTrackPoints} from "@/domain/RideWithGpsTrackPoint";
import {addMarkerWithPopup, attachMap} from "@/utilities/LeafletUtility";
import {MapConfiguration} from "@/domain/MapConfiguration";
import RouteFeature from "@/components/RouteFeature.vue";
import type {SaveRouteFeaturePayload} from "@/domain/SaveRouteFeaturePayload";
import type {UpdateRouteFeaturePayload} from "@/domain/UpdateRouteFeaturePayload";
import type {DeleteRouteFeaturePayload} from "@/domain/DeleteRouteFeaturePayload";

const FRANCIS_PARK_LATLNG = new LatLng(38.58277871554494, -90.30296119193265)


defineProps<{ routeIdentifiers: Array<RouteIdentifier> }>()

// TODO: maybe group all of the "selected" stuff together?
const selectedRoute = ref()
const selectedPoint = ref()
const selectedFeatureId = ref()
let showSidePanel = ref()
showSidePanel.value = false

let markerLayer: leaflet.Layer
let pathLayer: leaflet.Layer

// TODO move out to utilities and clean all this hacky shit up
async function loadRoute(event: Event) {
    const details = await getRouteDetails((event.target as HTMLSelectElement).value)

    removePathsAndMarkers()
    // markerLayer = createMarkers(details.route.trackPoints)
    // map.addLayer(markerLayer)
    pathLayer = drawPolyline(details.route.trackPoints.map(p => new LatLng(p.latitude, p.longitude)))
    map.addLayer(pathLayer)

    map.fitBounds(leaflet.latLngBounds(details.route.southWestBound, details.route.northEastBound))
}

function removePathsAndMarkers() {
    if (markerLayer && map.hasLayer(markerLayer)) {
        map.removeLayer(markerLayer)
    }
    if (pathLayer && map.hasLayer(pathLayer)) {
        map.removeLayer(pathLayer)
    }
}

function drawPolyline(points: Array<LatLng>) {
    return leaflet.polyline(points, {color: 'blue', weight: 5})
}


// ! leaving this in b/c I'm very likely to want markers
function createMarkers(pointData: Array<RideWithGpsTrackPoints>) {
    return leaflet
        .layerGroup(pointData
            .map(point => leaflet.marker([point.latitude, point.longitude]))
        )
}

function saveRouteData(payload: SaveRouteFeaturePayload) {
    console.log("saving route data:")
    console.log(payload)
}

function updateRouteData(payload: UpdateRouteFeaturePayload) {
    console.log("updating route data:")
    console.log(payload)
}

function deleteRouteData(payload: DeleteRouteFeaturePayload) {
    console.log("deleting route data:")
    console.log(payload)
}


let map: leaflet.Map
onMounted(() => {
    map = attachMap(new MapConfiguration('map', FRANCIS_PARK_LATLNG, 16, 30))
    addMarkerWithPopup(
        'click',
        map,
        "<div class='ride-feature-popup'>Route Feature</div>",
        (e: LeafletMouseEvent) => {
            selectedPoint.value = e.latlng
            showSidePanel.value = true
        },
        () => showSidePanel.value = false
    )
})


</script>

<template>
    <div class="wrapper">
        <h1>Planned Routes</h1>

        <div class="route-picker">
            <select v-model="selectedRoute" @change="loadRoute($event)">
                <option
                        v-for="identifiers in routeIdentifiers"
                        v-text="identifiers.routeName"
                        :key="identifiers.id"
                        :value="identifiers.id"
                >
                </option>
            </select>
        </div>
        <div id="map"></div>
        <div class="side-panel" v-if="showSidePanel">
            <!--figure out how to add in routeId when we're updating or deleting-->
            <route-feature
                    :feature-id="selectedFeatureId"
                    description="inserted from parent"
                    image=""
                    :point="selectedPoint"
                    @save-route-feature="saveRouteData"
                    @update-route-feature="updateRouteData"
                    @delete-route-feature="deleteRouteData"
            ></route-feature>
        </div>
    </div>

</template>

<style>
.ride-feature-popup {
    font-size: 25px;
}
</style>

<style scoped>
#map {
    width: 100%;
    height: 800px;
    background: lightblue;
}

.wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 0 40px;
    /* <rubs face> mmmmm good style skills */
    height: 100vh;
}

.route-picker {
    display: flex;
    margin: 10px 0;
}

.route-picker select {
    margin-right: 10px;
}

.side-panel {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    width: 500px;
    background: white;
    border-left: 1px solid black;
    box-shadow: -1px 0 7px dimgray;
    padding: 10px;
    /* pro css-ing :chef-kiss: */
    z-index: 999;
}

</style>