//非货币型基金
const oldFunds = [
    {
        name: '产品概览',
        list: [
            {
                id: 1,
                name: '产品总结',
                parent: '产品概览',
                delete: false,
                articleNum: 0,
                articlelist: [],
                choosed: false,
                component: 'Analysis/productOverview/summary'
            },
            {
                id: 2,
                name: '盘中实况',
                parent: '产品概览',
                delete: false,
                articleNum: 0,
                articlelist: [],
                choosed: false,
                component: 'Analysis/productOverview/intradayLive'
            },
            {
                id: 3,
                name: '业绩走势',
                parent: '产品概览',
                delete: false,
                articleNum: 0,
                articlelist: [],
                choosed: false,
                component: 'Analysis/productOverview/trajectory'
            },
            {
                id: 4,
                name: '阶段涨幅',
                parent: '产品概览',
                delete: false,
                articleNum: 0,
                articlelist: [],
                choosed: false,
                istable: true,//可以跨页
                component: 'Analysis/productOverview/phaseIncreases'
            },
            {
                id: 5,
                name: '收益风险指标',
                parent: '产品概览',
                delete: false,
                articleNum: 0,
                articlelist: [],
                choosed: false,
                istable: true,
                component: 'Analysis/productOverview/IndicatorsRiskSimple'
            },
            {
                id: 6,
                name: '基金经理',
                parent: '产品概览',
                delete: false,
                articleNum: 0,
                articlelist: [],
                choosed: false,
                component: 'Analysis/productOverview/manager'
            },
            {
                id: 7,
                name: '大类资产分布',
                parent: '产品概览',
                delete: false,
                articleNum: 0,
                articlelist: [],
                choosed: false,
                component: 'Analysis/productOverview/Distributionofmajorassets'
            },
            {
                id: 8,
                name: '相似基金',
                parent: '产品概览',
                delete: false,
                articleNum: 0,
                articlelist: [],
                choosed: false,
                istable: true,
                component: 'Analysis/productOverview/similarFund'
            },
            {
                id: 9,
                name: '同公司基金',
                parent: '产品概览',
                delete: false,
                articleNum: 0,
                articlelist: [],
                choosed: false,
                istable: true,
                component: 'Analysis/productOverview/sameCompany'
            }
        ]
    },
    {
        name: '收益',
        list: [
            {
                id: 1,
                name: '历史星级',
                parent: '收益',
                delete: false,
                articleNum: 0,
                articlelist: [],
                choosed: false,
                component: 'Analysis/productOverview/historyofStar'
            },
            {
                id: 2,
                name: '收益走势',
                parent: '收益',
                delete: false,
                articleNum: 0,
                articlelist: [],
                choosed: false,
                component: 'Analysis/earningsPerformance/returnChart'
            },
            {
                id: 3,
                name: '收益及分布',
                parent: '收益',
                delete: false,
                articleNum: 0,
                articlelist: [],
                choosed: false,
                component: 'Analysis/returnAndRisk/monthlyReturn'
            },
            {
                id: 4,
                name: '区间收益',
                parent: '收益',
                delete: false,
                articleNum: 0,
                articlelist: [],
                choosed: false,
                istable: true,
                component: 'Analysis/earningsPerformance/rollingYield'
            },
            {
                id: 5,
                name: '收益概率',
                parent: '收益',
                delete: false,
                articleNum: 0,
                articlelist: [],
                choosed: false,
                component: 'Analysis/earningsPerformance/returnsProbability'
            },
            {
                id: 6,
                name: '历史净值',
                parent: '收益',
                delete: false,
                articleNum: 0,
                articlelist: [],
                choosed: false,
                istable: true,
                component: 'Analysis/productOverview/netValueofHistory'
            }
        ]
    },
    {
        name: '风险',
        list: [
            {
                id: 1,
                name: '风险收益',
                parent: '风险',
                delete: false,
                articleNum: 0,
                articlelist: [],
                choosed: false,
                component: 'Analysis/returnAndRisk/RiskAndReturn_1'
            },
            {
                id: 2,
                name: '风险收益分析',
                parent: '风险',
                delete: false,
                articleNum: 0,
                articlelist: [],
                choosed: false,
                component: 'Analysis/returnAndRisk/RiskAndReturn_2'
            },
            {
                id: 3,
                name: '区间最大回撤',
                parent: '风险',
                delete: false,
                articleNum: 0,
                articlelist: [],
                choosed: false,
                component: 'Analysis/returnAndRisk/RiskAndReturn_3'
            },
            {
                id: 4,
                name: '收益波动走势',
                parent: '风险',
                delete: false,
                articleNum: 0,
                articlelist: [],
                choosed: false,
                component: 'Analysis/returnAndRisk/returnTrend'
            },
            {
                id: 5,
                name: '情景分析',
                parent: '风险',
                delete: false,
                articleNum: 0,
                articlelist: [],
                choosed: false,
                component: 'Analysis/returnAndRisk/RiskAndReturn_4'
            },
            {
                id: 6,
                name: '收益风险指标',
                parent: '风险',
                delete: false,
                articleNum: 0,
                articlelist: [],
                choosed: false,
                istable: true,
                component: 'Analysis/returnAndRisk/indicators'
            }
        ]
    },
    {
        name: '持仓分析',
        list: [
            {
                id: 1,
                name: '大类资产分布',
                parent: '持仓分析',
                delete: false,
                articleNum: 0,
                articlelist: [],
                choosed: false,
                component: 'Analysis/holdingAnalyze/assetsTypeDistribution'
            },
            {
                id: 2,
                name: '股票资产分布',
                parent: '持仓分析',
                delete: false,
                articleNum: 0,
                articlelist: [],
                choosed: false,
                component: 'Analysis/holdingAnalyze/stockAssetsDistribution'
            },
            {
                id: 3,
                name: '股票风格',
                parent: '持仓分析',
                delete: false,
                articleNum: 0,
                articlelist: [],
                choosed: false,
                component: 'Analysis/holdingAnalyze/stockStyle'
            },
            {
                id: 4,
                name: '股票持仓详情',
                parent: '持仓分析',
                delete: false,
                articleNum: 0,
                articlelist: [],
                choosed: false,
                istable: true,
                component: 'Analysis/holdingAnalyze/stockHoldings'
            },
            {
                id: 5,
                name: '债券资产分布',
                parent: '持仓分析',
                delete: false,
                articleNum: 0,
                articlelist: [],
                choosed: false,
                component: 'Analysis/holdingAnalyze/bondAssetsDistribution'
            },
            {
                id: 6,
                name: '前五大重仓债券',
                parent: '持仓分析',
                delete: false,
                articleNum: 0,
                articlelist: [],
                choosed: false,
                istable: true,
                component: 'Analysis/holdingAnalyze/topBondHoldings'
            },
            {
                id: 7,
                name: '前十大持仓基金',
                parent: '持仓分析',
                delete: false,
                articleNum: 0,
                articlelist: [],
                choosed: false,
                istable: true,
                component: 'Analysis/holdingAnalyze/topFundHoldings'
            }
        ]
    },
    {
        name: '收益归因',
        list: [
            {
                id: 1,
                name: '调仓时机',
                parent: '收益归因',
                delete: false,
                articleNum: 0,
                articlelist: [],
                choosed: false,
                component: 'Analysis/returnAttribution/stockPickingAndMarketTiming'
            },
            {
                id: 2,
                name: '股票资产收益贡献',
                parent: '收益归因',
                delete: false,
                articleNum: 0,
                articlelist: [],
                choosed: false,
                component: 'Analysis/returnAttribution/stockReturnAttribution'
            },
            {
                id: 3,
                name: 'Brinson归因',
                parent: '收益归因',
                delete: false,
                articleNum: 0,
                articlelist: [],
                choosed: false,
                istable: true,
                component: 'Analysis/returnAttribution/brinson'
            },
            {
                id: 4,
                name: '股票组合的收益因子分解',
                parent: '收益归因',
                delete: false,
                articleNum: 0,
                articlelist: [],
                choosed: false,
                component: 'Analysis/returnAttribution/stockFactorDistribution'
            }
        ]
    },
    {
        name: '基金经理',
        list: [
            {
                id: 1,
                name: '现任基金经理',
                parent: '基金经理',
                delete: false,
                articleNum: 0,
                articlelist: [],
                choosed: false,
                component: 'Analysis/fundManager/currentManager'
            },
            {
                id: 2,
                name: '基金经理变更',
                parent: '基金经理',
                delete: false,
                articleNum: 0,
                articlelist: [],
                choosed: false,
                component: 'Analysis/fundManager/managerChange'
            },
        ]
    },
    {
        name: '基金公司',
        list: [
            {
                id: 1,
                name: '基金公司概览',
                parent: '基金公司',
                delete: false,
                articleNum: 0,
                articlelist: [],
                choosed: false,
                component: 'Analysis/fundCompany/companyOverview'
            },
            {
                id: 2,
                name: '规模变化',
                parent: '基金公司',
                delete: false,
                articleNum: 0,
                articlelist: [],
                choosed: false,
                component: 'Analysis/fundCompany/sizeChange'
            },
            {
                id: 3,
                name: '旗下产品结构',
                parent: '基金公司',
                delete: false,
                articleNum: 0,
                articlelist: [],
                choosed: false,
                component: 'Analysis/fundCompany/productStructure'
            },
            {
                id: 4,
                name: '基金评级分布',
                parent: '基金公司',
                delete: false,
                articleNum: 0,
                articlelist: [],
                choosed: false,
                component: 'Analysis/fundCompany/ratingDistribution'
            },
        ]
    },
    {
        name: '基本信息',
        list: [
            {
                id: 1,
                name: '基本信息',
                parent: '基本信息',
                delete: false,
                articleNum: 0,
                articlelist: [],
                choosed: false,
                component: 'Analysis/basicInformation/basicInformation_1'
            },
            {
                id: 2,
                name: '购买规则',
                parent: '基本信息',
                delete: false,
                articleNum: 0,
                articlelist: [],
                choosed: false,
                component: 'Analysis/basicInformation/basicInformation_2'
            },
            {
                id: 3,
                name: '运营信息',
                parent: '基本信息',
                delete: false,
                articleNum: 0,
                articlelist: [],
                choosed: false,
                component: 'Analysis/basicInformation/operationalInfo'
            },
        ]
    }
]

export default oldFunds