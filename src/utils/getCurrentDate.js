function getToday() {
    const date = new Date()
    const Y = date.getFullYear()
    const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)
    const D = change(date.getDate())
    // const h = change(date.getHours())
    // const m = change(date.getMinutes())
    // const s = change(date.getSeconds())
    return `${Y}-${M}-${D}`
    // return Y + M + D + h + m + s
}

function change(t) {
    if (t < 10) {
        return '0' + t
    } else {
        return t
    }
}

export default getToday()
