export default function (data, fields) {
    let total = 0

    fields.forEach(function (item) {
        total += data[item] || 0
    });

    if (!total)
        return

    let minPercent = 0
    let maxValue = 0
    let indexMaxValue = 0
    let indexMaxCell = 0

    fields.forEach(function (item, i) {
        let value = data[item] || 0
        let percent = value * 100 / total
        if (value > maxValue) {
            maxValue = value
            indexMaxValue = i
        }
        if (0 < percent && percent < 10) {
            minPercent += 10
        }
    });

    let totalMin = total * (100 + minPercent) / 100
    let j = 0
    let cells = []
    cells.length = 10

    fields.forEach(function (item, i) {
        let value = data[item] || 0
        let percent = value * 100 / totalMin
        let roundPercent = 0 < percent && percent < 10 ? 10 : percent
        if (indexMaxValue === i) {
            indexMaxCell = j
        }
        for (let k = 0; k < roundPercent; k += 10) {
            cells[j] = {
                class: `cell-progress cell-color${i}`,
                item,
                percent,
                value
            }
            j += 1
        }
    });
    if (j !== 10) {
        switch (j) {
            case 11:
                cells.splice(indexMaxCell, 1)
                break
            case 9:
                cells.splice(indexMaxCell, 0, cells[j])
                break
            default:
                throw new Error(`Ошибка в расчете проценов j=${j}`)
        }
    }
    return cells

}