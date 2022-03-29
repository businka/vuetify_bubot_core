<script>
export default {
    name: "TestForm",
    props: {
        number: {
            type: Number,
            default: 1
        }
    },
    data: () => ({
        thisNumber: 0,
        visibleChild: false
    }),
    beforeMount() {
        this.thisNumber = this.number + 1
    }
}
</script>

<style scoped>

</style>

<template>
    <div>
        <v-btn
            @click="visibleChild=true"
        >
            Show {{this.thisNumber + 1}}
        </v-btn>
        <v-btn
            @click="$emit('action', {name: 'CloseForm', data: ''})"
        >
            Close
        </v-btn>
        <component
            :is="'RightDrawerFormViewer2'"
            v-if="visibleChild"
            formUid="Client/TestForm"
            :formData="{number:thisNumber}"
            @action="visibleChild=false"
        />
    </div>
</template>
