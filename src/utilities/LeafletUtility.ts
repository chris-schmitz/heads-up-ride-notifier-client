import type {MapConfiguration} from "@/domain/MapConfiguration";
import leaflet from "leaflet";

export function attachMap(config: MapConfiguration) {
    const map = leaflet
        .map(config.domElementId)
        .setView(config.center, config.defaultZoom);

    leaflet.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: config.maxZoom,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    return map
}

export function addMarkerWithPopup(type: string, map: leaflet.Map, content: string, onOpen: CallableFunction, onClose?: CallableFunction) {
    map.on('click', event => {
        const marker = leaflet.marker(event.latlng)
            .addTo(map)
            .bindPopup(content)
            .openPopup()
        onOpen(event)
        if (onClose) {
            marker.on('popupclose', onClose)
        }
    })

}