export default function(timestamp, withHour) {
    if (!timestamp) return ''
    const date = new Date(timestamp)
    const Y = date.getFullYear() + '-'
    const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
    const D = change(date.getDate()) + ' '
    const h = change(date.getHours()) + ':'
    const m = change(date.getMinutes()) + ':'
    const s = change(date.getSeconds())
    if (withHour) {
        return Y + M + D + h + m + s
    } else {
        return Y + M + D
    }
}

function change(t) {
    if (t < 10) {
        return '0' + t
    } else {
        return t
    }
}
