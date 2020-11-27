const marks = {
    '区间收益': '在所选区间内，采用分红再投资的复权单位净值计算的累计净值增长率。',
    '年化收益': '是把当前区间的收益率换算成年度收益率，是一种理论收益率。',
    '阿尔法': '是基金相对于基准收益和无风险利率获得的超额收益。阿尔法大于0，表示该基金以投资技术获得平均比预期收益大的实际收益，数值越大说明基金的盈利能力越强。',
    '夏普比率': '反映基金承担单位风险所获得的超额收益率。',
    '信息比率': '为年化后的信息比率，从主动管理的角度描述风险调整后收益，反映了每一跟踪误差带来的超额收益。',
    '索提诺比率': '为年化后的索提诺比率，反映基金承担每一单位下行风险所获得的超额收益。下行风险用年化下行标准差衡量。',
    '特雷诺比率': '为年化后的特雷诺比率，反映基金承担单位系统风险（贝塔）所获得的超额收益率。',
    '詹森指数': '是基金业绩中超过市场基准组合所获得的超额收益，若詹森指数 > 0，表明基金业绩表现优于市场基准组合，大得越多、业绩越好。',
    'M2': '衡量基金在同等市场风险水平下的超额收益。',
    '胜率': '反映在统计区间内基金收益率超过基准收益率的周期数与区间总周期数之比，即打败基准的次数占比。',
    '最大回撤': '在统计区间内基金从净值峰值点回撤到谷底值点的最大下跌幅度，用来衡量基金的抗风险能力。',
    '最大回撤区间月份数': '从净值峰值点回撤到谷底值点所经历的月份数。',
    '最大回撤修复日期': '达到最大回撤后首次大于或等于最大回撤峰值的日期。',
    '最大回撤修复月份数': '修复最大回撤经历的月份数。',
    '年化标准差': '将区间标准差换算成年度标准差，指标越小，说明基金的业绩稳定性越高。',
    '贝塔': '表示基金的系统性风险，反映了组合收益对基准收益变化的敏感性。',
    '下行风险': '即年化下行标准差，将基金收益率小于无风险收益率的情况定义为下行风险，反映了下行风险的波动程度。',
    '跟踪误差': '反映了基金收益率与基准收益率的偏离程度，多用于指数型基金的业绩度量。',
    '历史VaR': '即在险价值，指在95%的置信水平下，基金在未来周期的最大可能损失。',
    '历史CVaR': '即条件风险价值，指基金的损失超过历史VaR值的条件下的平均损失值。',
}

const managermarks = {
    '区间收益': '在所选区间内基金经理指数的累计增长率。',
    '年化收益': '是把当前区间的收益率换算成年度收益率，是一种理论收益率。',
    '阿尔法': '是基金经理相对于基准收益和无风险利率获得的超额收益。阿尔法大于0，表示该基金经理以投资技术获得平均比预期收益大的实际收益，数值越大说明基金经理的盈利能力越强。',
    '夏普比率': '反映基金经理承担单位风险所获得的超额收益率。',
    '信息比率': '为年化后的信息比率，从主动管理的角度描述风险调整后收益，反映了每一跟踪误差带来的超额收益。',
    '索提诺比率': '为年化后的索提诺比率，反映基金经理承担每一单位下行风险所获得的超额收益。下行风险用年化下行标准差衡量。',
    '特雷诺比率': '为年化后的特雷诺比率，反映基金经理承担单位系统风险（贝塔）所获得的超额收益率。',
    '詹森指数': '是基金经理业绩中超过市场基准组合所获得的超额收益，若詹森指数 > 0，表明基金经理业绩表现优于市场基准组合，大得越多、业绩越好。',
    'M2': '衡量基金经理在同等市场风险水平下的超额收益。',
    '胜率': '反映在统计区间内基金经理收益率超过基准收益率的周期数与区间总周期数之比，即打败基准的次数占比。',
    '最大回撤': '在统计区间内基金经理指数从峰值点回撤到谷底值点的最大下跌幅度，用来衡量基金经理的抗风险能力。',
    '最大回撤区间月份数': '基金经理指数从峰值点回撤到谷底值点所经历的月份数。',
    '最大回撤修复日期': '达到最大回撤后首次大于或等于最大回撤峰值的日期。',
    '最大回撤修复月份数': '修复最大回撤经历的月份数。',
    '年化标准差': '将区间标准差换算成年度标准差，指标越小，说明基金经理的业绩稳定性越高。',
    '贝塔': '表示基金经理的系统性风险，反映了基金经理收益对基准收益变化的敏感性。',
    '下行风险': '即年化下行标准差，将基金经理收益率小于无风险收益率的情况定义为下行风险，反映了下行风险的波动程度。',
    '跟踪误差': '反映了基金经理收益率与基准收益率的偏离程度，多用于管理指数型基金的经理的业绩度量。',
    '历史VaR': '即在险价值，指在95%的置信水平下，基金经理在未来周期的最大可能损失。',
    '历史CVaR': '即条件风险价值，指基金经理的损失超过历史VaR值的条件下的平均损失值。',
}

const groupmarks = {
    '区间收益': '在所选区间内组合的累计增长率。',
    '年化收益': '是把当前区间的收益率换算成年度收益率，是一种理论收益率。',
    '阿尔法': '是组合相对于基准收益和无风险利率获得的超额收益。阿尔法大于0，表示该组合以投资技术获得平均比预期收益大的实际收益，数值越大说明组合的盈利能力越强。',
    '夏普比率': '反映组合承担单位风险所获得的超额收益率。',
    '信息比率': '为年化后的信息比率，从主动管理的角度描述风险调整后收益，反映了每一跟踪误差带来的超额收益。',
    '索提诺比率': '为年化后的索提诺比率，反映组合承担每一单位下行风险所获得的超额收益。下行风险用年化下行标准差衡量。',
    '特雷诺比率': '为年化后的特雷诺比率，反映组合承担单位系统风险（贝塔）所获得的超额收益率。',
    '詹森指数': '是组合业绩中超过市场基准组合所获得的超额收益，若詹森指数 > 0，表明组合业绩表现优于市场基准组合，大得越多、业绩越好。',
    'M2': '衡量组合在同等市场风险水平下的超额收益。',
    '胜率': '反映在统计区间内组合收益率超过基准收益率的周期数与区间总周期数之比，即打败基准的次数占比。',
    '最大回撤': '在统计区间内组合从峰值点回撤到谷底值点的最大下跌幅度，用来衡量组合的抗风险能力。',
    '最大回撤区间月份数': '组合从峰值点回撤到谷底值点所经历的月份数。',
    '最大回撤修复日期': '达到最大回撤后首次大于或等于最大回撤峰值的日期。',
    '最大回撤修复月份数': '修复最大回撤经历的月份数。',
    '年化标准差': '将区间标准差换算成年度标准差，指标越小，说明组合的业绩稳定性越高。',
    '贝塔': '表示组合的系统性风险，反映了组合收益对基准收益变化的敏感性。',
    '下行风险': '即年化下行标准差，将组合收益率小于无风险收益率的情况定义为下行风险，反映了下行风险的波动程度。',
    '跟踪误差': '反映了组合收益率与基准收益率的偏离程度。',
    '历史VaR': '即在险价值，指在95%的置信水平下，组合在未来周期的最大可能损失。',
    '历史CVaR': '即条件风险价值，指组合的损失超过历史VaR值的条件下的平均损失值。',
}
export function getMarkText (str) {
    let title = str
    let index = title.indexOf('(%)')
    if (index > -1) {
        title = title.substr(0, index)
    }
    return marks[title]
}

export function getmanagerMarkText (str) {
    let title = str
    let index = title.indexOf('(%)')
    if (index > -1) {
        title = title.substr(0, index)
    }
    return managermarks[title]
}

export function getgroupMarkText (str) {
    let title = str
    let index = title.indexOf('(%)')
    if (index > -1) {
        title = title.substr(0, index)
    }
    return groupmarks[title]
}