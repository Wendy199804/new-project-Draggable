const resultFundMsgL = [
    {
        label: '成立日期',
        key: 'startDate'
    },
    {
        label: '基金公司',
        key: 'company'
    },
    {
        label: '最新规模',
        key: 'size'
    },
    {
        label: '基金经理',
        key: 'mfFundmanagernewVos'
    },
    {
        label: '运作方式',
        key: 'chiOperateType'
    },
    {
        label: '申购/赎回',
        key: 'applyingType',
        key2: 'redeemType'
    },
    {
        label: '基金类型',
        key: 'firstClassType'
    },
    {
        label: '二级分类',
        key: 'secondClassType'
    }
    // {
    //     label: '最新单位净值',
    //     key: 'unitnv'
    // },

    // {
    //     label: '复权单位净值',
    //     key: 'complexnv'
    // },

    // {
    //     label: '最新净值日期',
    //     key: 'endDate'
    // },
]
const resultFundMsgR= [
    {
        label: '累计收益',
        key: 'intervalReturn',
        value: 'mfIntervalReturn'
    },
    {
        label: '年化绝对收益',
        key: 'annualReturn',
        value: 'mfAnnualReturn'
    },
    {
        label: '年化超额收益',
        key: 'exAnnualReturn',
        value: 'mfExAnnualReturn'
    },
    {
        label: '年化波动率',
        key: 'volatility',
        value: 'mfVolatility'
    },
    {
        label: '最大回撤',
        key: 'maximumDrawdown',
        value: 'mfMaximumDrawdown'
    },
    {
        label: '夏普率',
        key: 'sharpe',
        value: 'mfSharpe'
    }
]
const noresultFundMsgL= [
    {
        label: '每万份收益',
        key: 'dailyProfit'
    },
    {
        label: '基金公司',
        key: 'company'
    },
    {
        label: '七日年化',
        key: 'latestWeeklyYield'
    },
    {
        label: '基金经理',
        key: 'managers'
    },
    {
        label: '最新净值日期',
        key: 'endDate'
    },
    {
        label: '最新规模',
        key: 'size'
    },
    {
        label: '成立日期',
        key: 'startDate'
    },
    {
        label: '申购/赎回',
        key: 'applyingType',
        key2: 'redeemType'
    },
    {
        label: '基金类型',
        key: 'firstClassType'
    }
]
const noresultFundMsgR= [
    {
        label: '近1月',
        key: 'weeklyyieldavg1',
        rank: 'rank1',
        rankall: 'rankAllNum1'
    },
    {
        label: '近1年',
        key: 'weeklyyieldavg12',
        rank: 'rank12',
        rankall: 'rankAllNum12'
    },
    {
        label: '近3月',
        key: 'weeklyyieldavg3',
        rank: 'rank3',
        rankall: 'rankAllNum3'
    },
    {
        label: '近2年',
        key: 'weeklyyieldavg24',
        rank: 'rank24',
        rankall: 'rankAllNum24'
    },
    {
        label: '近6月',
        key: 'weeklyyieldavg6',
        rank: 'rank6',
        rankall: 'rankAllNum6'
    },
    {
        label: '近3年',
        key: 'weeklyyieldavg36',
        rank: 'rank36',
        rankall: 'rankAllNum36'
    }
]
const collect_period_r = [
    {
        label: '基金经理',
        key: 'managers'
    },
    {
        label: '基金公司',
        key: 'company'
    },
    { label: '运作方式', key: 'chiOperateType' },
    {
        label: '基金类型',
        key: 'firstClassType'
    }
]

export {resultFundMsgL,resultFundMsgR,noresultFundMsgL,noresultFundMsgR}