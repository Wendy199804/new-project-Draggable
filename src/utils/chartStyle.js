// const baseGrid = {
//     top: 10,
//     bottom: 30,
//     left: 60,
//     right: 35
// }
const commonStyle = {
    grid_a: {
        top: 10,
        bottom: 31,
        left: 60,
        right: 35
    },
    grid_f: {
        top: 10,
        bottom: 30,
        left: 60,
        right: 35,
    },
    grid_f_2: {
        top: 10,
        bottom: 30,
        left: 60,
        right: 60
    },
    grid_l: {
        top: 10,
        bottom: 30,
        left: 60,
        right: 35
    },
    grid_r: {
        top: 10,
        bottom: 30,
        left: 60,
        right: 35
    },
    grid_change_manager: {
        top: 13,
        bottom: 30,
        left: 60,
        right: 35
    },
    grid_l_zoom: {
        top: 10,
        bottom: 52,
        left: 60,
        right: 35
    },
    //收益概率
    returns_the_probability:{
        top: 10,
        bottom: 40,
        left: 60,
        right: 5
    },
    grid_half: {
        top: 10,
        bottom: 30,
        left: 60,
        right: 5
    },
    grid_half_tb: [{
        height: 274,
        top: 10,
        left: 60,
        right: 35
    }, {
        top: 360,
        height: 75,
        left: 60,
        right: 35
    }],

    toolbox: {
        show: true,
        feature: {
            saveAsImage: { show: true }
        }
    },

    legend: {
        orient: 'horizontal',
        top: 8,
        right: 10
    },

    tooltip: {
        trigger: 'axis',
        axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        }
    },

    loadingStyle: {
        text: '暂无数据',
        color: '#ffffff',
        textColor: '#8a8e91',
        maskColor: 'rgba(255, 255, 255, 0.8)',
    },
    emptyStyle: 'color: #8a8e91; text-align: center; font-size: 12px; position: absolute; width: 100%; top: 40%;',

    topHoldingsAxisLabel: {
        interval: 0,
        margin: 5,
        formatter: (value, index) => {
            if (value.indexOf('-')) {
                let arr = value.split('-')
                value = arr[0] + (arr.length > 1 ? '...' : '')
            }
            if (value.length > 50) {
                value = value.substr(0, 30) + '...'
            }
            if (index % 2 == 0) {
                return '\n' + value
            }
            return value
        }
    },
 
    colors: [
        '#FF9595', '#FFB4B4', '#F57B7B',
        '#FCDDAE', '#FFB57D', '#FFC19D',
        '#FFE277', '#FFEFAA', '#D5CB9F',
        '#E2F7A2', '#D2DB63', '#F2FA89',
        '#87E491', '#ADFBB4', '#72C27A',
        '#A4E8CD', '#54D8C1', '#8CF7CD',
        '#7FD8DC', '#91F0F5', '#68BEC2',
        '#AFD5EE', '#62BBF5', '#8CD3FF',
        '#8FAEFE', '#B5B7FF', '#8D9BE5',
        '#D7B3F4', '#BD8BE6', '#EDD7FF',
        '#F694E1', '#FFBCF9', '#D876C5',
        '#F8ACCC', '#EA74A8', '#FFCCE1',
        '#FFCB9D', // 指数、基准
    ],
    lineColors: [
        '#6F8EE6', '#B983F2', '#5CDBD3', '#5ABEFF', '#52DE60',
        '#D8E44C', '#DABE46', '#FF9167', '#FF6363', '#ED5A9B',
        '#FFC266', // 指数、基准
    ],
    // lineColors: [
    //     'red', 'blue', 'yellow', 'green', 'pink',
    //     'purple', 'gray', '#FF9167', '#FF6363', '#ED5A9B',
    // ],
    blockColors: [25, 28, 19, 23, 14, 10, 8, 4, 2, 34],

    assetsType: {
        '股票': 25,
        '股票及存托凭证': 25,
        '固定收益': 26,
        '买入返售金融资产': 23,
        '银行存款': 1,
        '基金': 28,
        'QDII': 14,
        '金融衍生品': 11,
        '贵金属': 7,
        '货币市场工具': 7,
        '其他资产': 5
    },
    swIndustry: {
        '机械设备': 25,
        '建筑装饰': 26,
        '交通运输': 27,
        '国防军工': 24,
        '轻工制造': 21,
        '计算机': 22,
        '电子': 23,
        '建筑材料': 28,
        '化工': 29,
        '有色金属': 32,
        '钢铁': 33,
        '非银金融': 2,
        '房地产': 1,
        '银行': 3,
        '医药生物': 19,
        '商业贸易': 4,
        '传媒': 5,
        '休闲服务': 6,
        '汽车': 8,
        '家用电器': 7,
        '纺织服装': 12,
        '食品饮料': 10,
        '农林牧渔': 11,
        '采掘': 13,
        '通信': 17,
        '电气设备': 34,
        '公用事业': 36,
        '综合': 24
    },
    zzIndustry: {
        '工业': 25,
        '信息技术': 22,
        '原材料': 28,
        '金融地产': 2,
        '医药卫生': 19,
        '可选消费': 4,
        '主要消费': 10,
        '能源': 13,
        '电信业务': 17,
        '公用事业': 34,
        '其他-港股': 30,
        '其他-科创板': 18,
        '其他': 24
    },
    zjhIndustry: {
        '制造业': 25,
        '建筑业': 28,
        '交通运输、仓储和邮政业': 27,
        '科学研究和技术服务业': 24,
        '信息传输、软件和信息技术服务业': 22,
        '金融业': 2,
        '房地产业': 1,
        '租赁和商务服务业': 3,
        '卫生和社会工作': 19,
        '批发和零售业': 4,
        '文化、体育和娱乐业': 5,
        '住宿和餐饮业': 6,
        '教育': 9,
        '居民服务、修理和其他服务业': 10,
        '农、林、牧、渔业': 11,
        '采矿业': 13,
        '电力、热力、燃气及水生产和供应业': 34,
        '水利、环境和公共设施管理业': 36,
        '综合': 24
    },
    QDIIIndustry: {
        '日常消费品': 10,
        '非日常生活消费品': 4,
        '公用事业': 34,
        '原材料': 28,
        '工业': 25,
        '医疗保健': 19,
        '能源': 13,
        '信息技术': 22,
        '电信业务': 17,
        '金融': 2,
        '房地产': 1,
        '其他': 24
    },
    sectorIndustry: {
        '主板': 25,
        '中小企业板': 26,
        '创业板': 23,
        '科创板': 13,
        '港股': 17,
        '三板': 11,
        '其他': 7
    },
    ratingOfBond: {
        'A-1': 28,
        'A-1以下': 25,
        'A-1 以下': 25,
        '未评级': 23,

        'AAA及以上': 19,
        'AAA': 17,
        'AAA以下': 13,
        'AAA 以下': 13
    },
    kindOfBond: {
        '国债': 28,
        '地方政府债券': 26,
        '同业存单': 24,
        '金融债券': 23,
        '短期融资券': 22,
        '中期票据': 19,
        '企业债券': 17,
        '其他债券': 13,
        '可转换债券': 11
    },
    returnAttribution: {
        '总收益': '#6F8EE6',
        '主动性收益': 25,
        '基准收益': 6,
        '风格因子': 2,
        '行业因子': 19,
        '全A因子': 6,
        '个股选择': 25
    },
    activeReturnAttribution: {
        '主动性收益': '#6F8EE6',
        '风格因子': 2,
        '行业因子': 19,
        '全A因子': 6,
        '个股选择': 25
    },
    styleFactors: {
        '贝塔': 27,
        '动量': 6,
        '规模': 1,
        '盈利': 17,
        '波动': 28,
        '成长': 24,
        '价值': 11,
        '杠杆': 34,
        '流动性': 16,
        '中盘': 9
    },
    average:{
        '同类平均(股票型)':'#5ABEFF',
        '同类平均(混合型)':'#5ABEFF',
        '同类平均(债券型)':'#5ABEFF',
        '同类平均(QDII)':'#5ABEFF',
        '同类平均(指数型)':'#5ABEFF',
        '同类平均(货币型)':'#5ABEFF',
        '同类平均(理财型)':'#5ABEFF',
        '同类平均(ETF联接)':'#5ABEFF',
        '同类平均(FOF)':'#5ABEFF',
        '同类平均(分级基金)':'#5ABEFF',

        '中证混合型基金指数':'#5ABEFF',
        '中证股票型基金指数':'#5ABEFF',
        '中证债券型基金指数':'#5ABEFF'
    }
}

export default commonStyle
