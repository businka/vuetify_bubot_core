<script>
import RowCellMixin from './RowCell.mixin'
import calcProgress from './ColorProgress'

export default {
    name: 'CellColorProgress',
    mixins: [RowCellMixin],
    props: {
        detail: {
            type: Array,
            default: () => []
        },
    },
    data: function () {
        return {
            total: 0,
            cells: []

        }
    },
    watch: {
        _value: async function (value0) {
            if (value0)
                this.cells = calcProgress(value0, this.detail)
        },
    },
    beforeMount() {
        this.cells = calcProgress(this._value, this.detail)
    }
}
</script>

<template>
    <table class="table-progress">
        <tr>
            <td
                v-for="(elem, index) in cells"
                :key="index"
                :class="elem.class"
            ></td>
        </tr>
    </table>
</template>

<style lang="scss" scoped>
    .table-progress {
        height: 60%;
        width: 100%
    }

    .cell-progress {
        padding: 1px;
        width: 10%;

    }

    .cell-color0 {
        background: green;
    }

    .cell-color1 {
        background: red;
    }

    .cell-color2 {
        background: gray;
    }

    .cell-color3 {
        background: blueviolet;
    }

    .cell-color4 {
        background: yellow;
    }

</style>