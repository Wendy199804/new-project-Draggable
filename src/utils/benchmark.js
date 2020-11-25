const baseBenchmark = [
    { label: '上证50', value: '000016' },
    { label: '深证100', value: '399330' },
    { label: '中证100', value: '000903' },
    { label: '上证180', value: '000010' },
    { label: '沪深300', value: '000300' },
    { label: '中证500', value: '000905' },
    { label: '中证800', value: '000906' },
    {label: '中证1000', value: '000852' },
    { label: '创业板指', value: '399006' },
    { label: '中小板指', value: '399005' }
]
const allBenchmark = [
    {label: '股票类', value: '1', children: [
        {label: '沪深300', value: '000300'},
        {label: '上证50', value: '000016'},
        {label: '中证100', value: '000903'},
        {label: '深证100', value: '399330'},
        {label: '中证500', value: '000905'},
        {label: '中证800', value: '000906'},
        {label: '中证1000', value: '000852'},
        {label: '上证综指', value: '000001'},
        {label: '深证成指', value: '399001'},
        {label: '创业板指', value: '399006'},
        {label: '中小板指', value: '399005'},
        {label: '中证全指', value: '000985'},
        {label: '中证材料', value: '000929'},
        {label: '中证金融', value: '000934'},
        {label: '中证电信', value: '000936'},
        {label: '中证工业', value: '000930'},
        {label: '中证公用', value: '000937'},
        {label: '中证可选', value: '000931'},
        {label: '中证能源', value: '000928'},
        {label: '中证信息', value: '000935'},
        {label: '中证医药', value: '000933'},
        {label: '中证消费', value: '000932'},
        {label: '大盘成长', value: '399372'},
        {label: '大盘价值', value: '399373'},
        {label: '中盘成长', value: '399374'},
        {label: '中盘价值', value: '399375'},
        {label: '小盘成长', value: '399376'},
        {label: '小盘价值', value: '399377'},
        {label: '恒生指数', value: 'HSI'},
        {label: '标普500', value: '.GSPC'},
        {label: '道琼斯工业平均指数', value: '.DJI'},
        {label: '纳斯达克综合指数', value: '.IXIC'},
        {label: '日经225指数', value: '.N225'},
        {label: '英国富时100指数', value: '.FTSE'}
    ]},
    {label: '债券类', value: '2', children: [
        {label: '中证全债', value: 'H11001'},
        {label: '中证国债', value: 'H11006'},
        {label: '中证金融债', value: 'H11007'},
        {label: '中证企业债', value: 'H11008'},
        {label: '中证公司债', value: '000923'},
        {label: '中证信用债', value: 'H11073'},
        {label: '中证综合债', value: 'H11009'},
        {label: '中证1债', value: 'H11010'},
        {label: '中证3债', value: 'H11002'},
        {label: '中证7债', value: 'H11003'},
        {label: '中证10债', value: 'H11004'},
        {label: '中证10+债', value: 'H11005'}
    ]},
    {label: '现金类', value: '4', children: [
        {label: '中证货币基金指数', value: 'H11025'},
    ]}
]

const industryOptions = [
    {label: '申万一级行业', value: 'sw'},
    {label: '中证一级行业', value: 'zz'},
    {label: '证监会行业分类', value: 'zjh'}
]
const distributionOptions = [
    {label: '行业分布 - 申万行业分类', value: 'sw'},
    {label: '行业分布 - 中证行业分类', value: 'zz'},
    {label: '行业分布 - 证监会行业分类', value: 'zjh'},
    {label: '板块分布', value: 'sector'}
]

const assetTypeDistributionLegend = [
    '股票', '固定收益', '基金', '金融衍生品',
    '买入返售金融资产', '银行存款', '贵金属', '其他资产'
]
const assetTypeDistributionLegend_QDII = [
    '股票及存托凭证', '固定收益', '基金', '金融衍生品',
    '买入返售金融资产', '银行存款', '货币市场工具', '其他资产'
]
const stockDistributionLegend = {
    'sw': [
        '食品饮料', '家用电器', '商业贸易', '房地产', '轻工制造', '传媒', '汽车',
        '化工', '农林牧渔', '纺织服装', '医药生物', '通信', '休闲服务', '机械设备',
        '建筑装饰', '电气设备', '计算机', '电子', '非银金融', '钢铁', '采掘',
        '公用事业', '交通运输', '银行', '国防军工', '建筑材料', '有色金属', '综合'
    ],
    'zz': [
        '主要消费', '可选消费', '公用事业', '原材料', '工业',
        '医药卫生', '能源', '信息技术', '电信业务', '金融地产',
        '其他-港股', '其他-科创板', '其他'
    ],
    'zjh': [
        '制造业', '电力、热力、燃气及水生产和供应业', '金融业', '房地产业',
        '科学研究和技术服务业', '信息传输、软件和信息技术服务业', '采矿业',
        '租赁和商务服务业', '农、林、牧、渔业', '建筑业', '卫生和社会工作',
        '住宿和餐饮业', '批发和零售业', '水利、环境和公共设施管理业', '教育',
        '文化、体育和娱乐业', '居民服务、修理和其他服务业', '综合'
    ],
    'sector': [
        '主板', '中小企业板', '创业板', '科创板', '港股', '三板', '其他'  
    ],
    'QDII': [
        '信息技术', '公用事业', '医疗保健', '原材料', '工业', '房地产',
        '日常生活消费品', '电信业务', '能源', '金融', '非日常生活消费品','其他'
    ]
}
const bondDistributionLegend = {
    'kind': ['国债', '中期票据', '同业存单', '可转换债券', '地方政府债券', '金融债券', '企业债券', '短期融资券', '其他债券'],
    'rating_1': ['AAA', 'AAA以下', '未评级'], // 长期信用评级
    'rating_2': ['A-1', 'A-1以下', '未评级'] // 短期信用评级
}

const statusOptions = [
    {label: '运行中', value: '1'},
    {label: '已清盘', value: '2'},
    {label: '清算中', value: '3'}
]
const methodOptions = [
    {label: '股票策略', value: '100', children: [
        {label: '股票多头', value: '101'},
        {label: '股票多空', value: '102'},
        {label: '股票市场中性', value: '501'},
        {label: '股票量化', value: '103'},
        {label: '多策略', value: '105'}
    ]},
    {label: '固定收益', value: '600', children: [
        {label: '其他策略', value: '99'}
    ]},
    {label: '管理期货', value: '300', children: [
        {label: '管理期货-多策略', value: '305'},
        {label: '管理期货', value: '300'},
        {label: '趋势交易', value: '301'},
        {label: '其他策略', value: '99'},
        {label: '股票策略-多策略', value: '105'},
        {label: '股票多头', value: '101'}
    ]},
    {label: '相对价值', value: '500', children: [
        {label: '股票市场中性', value: '501'},
        {label: '相对价值-多策略', value: '506'},
        {label: '其他策略', value: '99'}
    ]},
    {label: '事件驱动', value: '400', children: [
        {label: '并购重组', value: '401'},
        {label: '定向增发', value: '402'},
        {label: '大宗交易', value: '403'},
        {label: '事件驱动-多策略', value: '404'}
    ]},
    {label: '复合策略', value: '800', children: [
        {label: '其他策略', value: '99'}
    ]},
    {label: '其他策略', value: '99', children: [
        {label: '其他策略', value: '99'},
        {label: '股票多头', value: '101'},
        {label: '股票市场中性', value: '501'}
    ]},
    {label: '组合基金', value: '700', children: [
        {label: '其他策略', value: '99'}
    ]},
    {label: '宏观策略', value: '200', children: [
        {label: '其他策略', value: '99'}
    ]},
    {label: '新三板', value: '900', children: [
        {label: '其他策略', value: '99'}
    ]},
]
const assetClassOptions = [
    {label: 'A股', value: '0', children: [
        {label: '全A股', value: '00'},
        {label: '大盘', value: '01'},
        {label: '大盘-成长', value: '02'},
        {label: '大盘-价值', value: '03'},
        {label: '中盘', value: '04'},
        {label: '中盘-成长', value: '05'},
        {label: '中盘-价值', value: '06'},
        {label: '小盘', value: '07'},
        {label: '小盘-成长', value: '08'},
        {label: '小盘-价值', value: '09'}
    ]},
    {label: '固定收益', value: '1', children: [
        {label: '现金', value: '10'},
        {label: '全债', value: '11'},
        {label: '国债', value: '12'},
        {label: '短期国债', value: '13'},
        {label: '长期国债', value: '14'},
        {label: '企业债', value: '15'},
        {label: '信用债', value: '16'}
    ]},
    {label: '另类投资', value: '2', children: [
        {label: '黄金', value: '20'},
        {label: '商品', value: '21'},
        {label: '贵金属', value: '22'}
    ]}
]
const rotarionMarket = [
    {label:'中证债券型基金指数',value:'H11023'},
    {label:'中证股票型基金指数',value:'H11021'},
    {label:'中证混合型基金指数',value:'H11022'},
    {label:'沪深300',value:'000300'},
    {label:'中证500',value:'000905'},
    {label:'创业板指',value:'399006'},
    {label:'中证全债',value:'H11001'},
    {label:'中证可转债',value:'000832'},
    {label:'中证信息',value:'000935'},
    {label:'中证消费',value:'000932'},
    {label:'中证医药',value:'000933'},
]

export {
    baseBenchmark,
    allBenchmark,
    industryOptions,
    distributionOptions,
    assetTypeDistributionLegend,
    assetTypeDistributionLegend_QDII,
    stockDistributionLegend,
    bondDistributionLegend,
    statusOptions,
    methodOptions,
    assetClassOptions
}

export function getIndexName(code) {
    if (!code) return ''
    let arr = allBenchmark.reduce((total, item) => {
        return total.concat(item.children)
    }, [])
    let match = arr.find(item => item.value == code)
    return match.label
}
export function getFundStatus(status) {
    if (!status && status !== 0) return ''
    let match = statusOptions.find(item => item.value == status)
    return match.label
}
export function getMethod(code) {
    if (!code && code !== 0) return ''
    let match = methodOptions.find(item => item.value == code)
    return match.label
}
export function getRotarionMarket(status) {
    if (!status && status !== 0) return ''
    let match = rotarionMarket.find(item => item.value == status)
    return match.label
}