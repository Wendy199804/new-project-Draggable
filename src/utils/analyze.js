
/**最新规模 加单位 */
export function unitConverter(num) {
    if (isNaN(num) || num == null) {
        return '- -'
    } else {
        if (Math.abs(Number(num)) > 100000000) {
            return (Number(num) / 100000000).toFixed(2) + '亿'
        } else if (Math.abs(Number(num)) > 10000) {
            return (Number(num) / 10000).toFixed(2) + '万'
        } else {
            return Number(num).toFixed(2)
        }
    }
}

/**转换为百分数 */
export function toPercent(num, fixednum = 2) {
    if (!isNaN(num) && num !== null) {
        const formated = Number(num * 100).toFixed(fixednum)
        return `${formated}%`
    } else {
        return '- -'
    }
}

/**转换为百分数(无百分号) */
export function topercentNum(num) {
    if (!isNaN(num) && num !== null) {
        const formated = Number(num * 100).toFixed(2)
        return `${formated}`
    } else {
        return '- -'
    }
}

/**判断是否为
 * 债券型-纯债，债券型-进取债，指数型-债券型
 * (非货基)
 */
export function benchmarkValue(val) {
    if (val && val.type === 1) {
        if (val.firsttypeChi === '债券型') {
            let ifchange = val.secondtypeChi.some(item => {
                return item === '纯债型' || item === '进取债型'
            })
            return ifchange ? ['2', 'H11001'] : ['1', '000300']
        } else if (val.firsttypeChi === '指数型') {
            let ifchange = val.secondtypeChi.some(item => {
                return item === '债券型'
            })
            return ifchange ? ['2', 'H11001'] : ['1', '000300']
        } else {
            return ['1', '000300']
        }
    } else {
        return ['1', '000300']
    }
}

/**
 * 比较基金innercode去重去空
 */
export function innercodeList(arr) {
    let anarr = [...arr].filter(item => item.innercode)
    return anarr.map(item => item.innercode)
}

/**
 * 比较基金name去重去空
 */
export function nameList(arr) {
    let anarr = [...arr].filter(item => item.innercode)
    return anarr.map(item => item.name)
}

/**
 * 比较基金type去重去空
 */
export function typeList(arr) {
    let anarr = [...arr].filter(item => item.type)
    return anarr.map(item => item.type)
}

/**获得本地存储的基金比较数组 */

export function getlocalComparelist() {
    return JSON.parse(localStorage.getItem('selectFundsToCompare')) || []
}
/**获得本地存储的基金比较datelist */

export function getlocalComparedatelist() {
    return JSON.parse(localStorage.getItem('compareFundsDateList')) || []
}
/**获得本地存储的基金比较daterange */

export function getlocalComparedaterangelist() {
    return JSON.parse(localStorage.getItem('compareFundsDateRange')) || {}
}

/**格式化为每三个数字加逗号
 * @{str : 转化为字符串的数字}
 */
export function format_number(str) {
    str = Number(str) === 0 ? '0' : str
    let newStr = ''
    let count = 0
    // 当数字是整数
    if (str.indexOf('.') == -1) {
        for (let i = str.length - 1; i >= 0; i--) {
            if (count % 3 == 0 && count != 0) {
                newStr = str.charAt(i) + ',' + newStr
            } else {
                newStr = str.charAt(i) + newStr
            }
            count++
        }
        str = newStr + '.00' //自动补小数点后两位
        return str
    }
    // 当数字带有小数
    else {
        let nstr = Number(str) > 0 ? str : str.substr(1)
        for (let i = nstr.indexOf('.') - 1; i >= 0; i--) {
            if (count % 3 == 0 && count != 0) {
                newStr = nstr.charAt(i) + ',' + newStr
            } else {
                newStr = nstr.charAt(i) + newStr //逐个字符相接起来
            }
            count++
        }
        nstr = newStr + (nstr + '00').substr((nstr + '00').indexOf('.'), 3)
        return Number(str) >= 0 ? nstr : `-${nstr}`
    }
}

/**四分位排名 */
export function getRank(value) {
    let label = ''
    if (value == 1) {
        label = '低'
    }
    if (value == 2) {
        label = '较低'
    }
    if (value == 3) {
        label = '较高'
    }
    if (value == 4) {
        label = '高'
    }
    if (value == 0) {
        label = '- -'
    }
    return label
}

/**
 * 返回list中x的索引，若无x，返回最近一天的索引
 */
const getDateCount = (date1, date2) => {
    let n1 = date1.split('-').join(''),
        n2 = date2.split('-').join('')
    return +n2 - +n1
}
export function getClosestX(list, x) {
    return list.findIndex((item, index) => {
        if (item == x) return true
        let boo1 = index == 0 ? true : getDateCount(list[index - 1], x) > 0
        let boo2 = index == list.length - 1 ? true : getDateCount(x, list[index + 1]) > 0
        return boo1 && boo2
    })
}

/**
 * 返回基金经理类型
 */
export function getManagerTypeChi(type) {
    if (type === 1) {
        return '权益类'
    } else if (type === 2) {
        return '债券类'
    } else if (type === 3) {
        return '指数类'
    } else {
        return '无类型'
    }
}

/**获得经理类型 */
export function gettheManagerType(result) {
        if (result.listedState !== 0) {
            let arr = Object.entries(result.firstClassTypeMap)
            arr.sort((a, b) => {
                return -a[1] + b[1]
            })
            let options = arr.map(item => {
                let value = 0
                if (item[0] == '权益类') {
                    value = 1
                } else if (item[0] == '债券类') {
                    value = 2
                } else if (item[0] == '指数类') {
                    value = 3
                }
                return { label: item[0], value }
            })
            return options[0]
        } else {
            return { label: '无类型', value: 0 }
        }
}
