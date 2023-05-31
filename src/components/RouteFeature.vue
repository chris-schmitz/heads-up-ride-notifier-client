<script setup lang="ts">
import {onBeforeMount, ref} from "vue";
import type {LatLng} from "leaflet";
import type {SaveRouteFeaturePayload} from "@/domain/SaveRouteFeaturePayload";
import type {DeleteRouteFeaturePayload} from "@/domain/DeleteRouteFeaturePayload";
import type {UpdateRouteFeaturePayload} from "@/domain/UpdateRouteFeaturePayload";

// import {RouteFeatureProps} from "@/domain/RouteFeatureProps";
// ?! for some reason if we move this interface out to it's own file we get a compiler error
export interface RouteFeatureProps {
    point: LatLng,
    image: string,
    description: string,
    featureId?: number
}

const props = defineProps<RouteFeatureProps>()
const featureImage = ref("")
const featureDescription = ref("")
const featureImageInput = ref()

const emit = defineEmits<{
    (e: 'save-route-feature', payload: SaveRouteFeaturePayload): void,
    (e: 'update-route-feature', payload: UpdateRouteFeaturePayload): void,
    (e: 'delete-route-feature', payload: DeleteRouteFeaturePayload): void,
}>()

onBeforeMount(() => {
    featureDescription.value = props.description
    // featureImage.value = props.image
})

// TODO: consider refactor
// ? consider if it makes sense to parameterize the functions and move them out to a TS file


function storeRouteFeature() {
    const form = new FormData()
    if (featureImageInput.value.files.length > 0) {
        form.append('image', featureImageInput.value.files[0], featureImageInput.value.files[0].name)
    }
    form.append('description', featureDescription.value)
    form.append('point', JSON.stringify(props.point))
    const updatedRouteFeature = {
        description: featureDescription.value,
        image: featureImage.value,
        point: props.point
    }


    if (props.featureId) {
        _updateRouteFeature({
            featureId: props.featureId,
            ...updatedRouteFeature,
        })
    } else {
        _saveRouteFeature(form)
    }
}

function _saveRouteFeature(form: FormData) {
    fetch("http://localhost:8080/route/1/feature", {
        method: 'post',
        body: form
    })
        .then(response => {
            console.log(response)
        })
    // emit('save-route-feature', form)

}


function _updateRouteFeature(payload: UpdateRouteFeaturePayload) {
    emit('update-route-feature', payload)
}

function deleteRouteFeature() {
    if (props.featureId) {
        emit('delete-route-feature', {featureId: props.featureId})
    }
}

function updateImagePreview(event: Event) {
    const file = (event.target as HTMLInputElement).files
    if (file) {
        featureImage.value = URL.createObjectURL(file[0])
    }
}

</script>

<template>
    <div class="content-wrapper">
        <h1>Route Feature</h1>
        <img ref="featureImageElement" :src="featureImage">
        <label for="feature-image-input">Upload Image</label>
        <input id="feature-image-input" ref="featureImageInput" type="file" @change="updateImagePreview"/>
        <label>Description</label>
        <textarea v-model="featureDescription" ref="feature-description-element"></textarea>
        <p ref="point-display-element" v-text="props.point"></p>
        <div class="hacky-spacer"></div>
        <div class="sticky-bottom">
            <button
                    class="save-button"
                    ref="submit-button-element"
                    @click="storeRouteFeature"
            >Save
            </button>
            <button
                    class="delete-button"
                    ref="delete-button-element"
                    @click="deleteRouteFeature"
                    v-if="props.featureId"
            >Delete
            </button>
        </div>
    </div>
</template>


<style scoped>
.content-wrapper {
    height: 100%;
    display: flex;
    flex-direction: column;
}

.hacky-spacer {
    flex-grow: 3;
}

textarea {
    height: 100px;
    min-width: 100%;
}

img {
    width: 100%;
    max-height: 500px;
}

.sticky-bottom {
    padding: 10px;
    display: flex;
    justify-content: space-between;
}

.sticky-bottom button {
    font-size: 30px;
    flex-grow: 1;
    margin: 0 5px
}

.save-button {
    background: palegreen;
}

.delete-button {
    background: orangered;
}

</style>