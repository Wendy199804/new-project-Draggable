function getInterval(data) {
    let _max = data.reduce((x,y) => x > y ? x : y)
    let _min = data.reduce((x,y) => x > y ? y : x)
    let val = _min < 0 ? (_max - _min) / 4 : _max / 4
    // echart 内部计算 interval 的方法
    // https://github.com/apache/incubator-echarts/blob/fd064123626c97b36cbd6da1b5fc73385c280abd/src/util/number.js
    const exponent = Math.floor(Math.log(val) / Math.LN10)
    const exp10 = Math.pow(10, exponent)
    const f = val / exp10; // 1 <= f < 10
    let nf
    if (f < 1.5) { nf = 1 }
    else if (f < 2.5) { nf = 2 }
    else if (f < 4) { nf = 3 }
    else if (f < 7) { nf = 5 }
    else { nf = 10 }
    val = nf * exp10
    // Fix 3 * 0.1 === 0.30000000000000004 issue (see IEEE 754).
    // 20 is the uppper bound of toFixed.
    let interval = exponent >= -20 ? +val.toFixed(exponent < 0 ? -exponent : 0) : val,
        min = _min >= 0 ? 0 : Math.floor(_min/interval) * interval,
        max = Math.ceil(_max/interval) * interval
    return {
        interval, max, min,
        splitNumber: Math.round((max - min) / interval)
    }
}
export default getInterval