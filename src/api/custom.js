import { post,get } from '@/utils/request'

/**客户 */

/**
 * 新增-修改客户
 * @param {name,sex,birthday,phone,wechat,familyStatus,annualIncome,area,userIndustry,natureWork,remark} data 
 */
export function addNewCustom(data) {
    return post('/sysClient/saveSysClient', data)
}

/**
 * 客户管理表
 * @param {name,sex,birthday,phone,wechat,familyStatus,annualIncome,area,userIndustry,natureWork,remark} data 
 */
export function getAllCustom(data) {
    return post('/sysClient/selectClientVo', data)
}

/**
 * 客户总数 
 */
export function getCustomsNum() {
    return get('/sysClient/selectClientCount')
}

/**
 * 查询某客户的信息 （编辑时）
 */
export function getCustomMsg(data) {
    return post('/sysClient/getSysClientByClientId',data)
}

/**
 * 删除客户 
 */
export function deleteCostom(data) {
    return post('/sysClient/deleteSysClient',data)
}

/**
 * 获取客户交易日净值，最多赎回数量和持仓金额
 */
export function getUnivByTradingDay(data) { 
    return post('/clientTransaction/getUnivByTradingDay',data)
}

/**
 * 获取客户交易日净值，最多申购数量和持仓金额  // 废弃
 */
export function getApplyByTradingDay(data) { 
    return post('/clientTransaction/getApplyByTradingDay',data)
}

/**
 * 获取客户当前持仓
 */
export function getClientHoldingList(data) { 
    return post('/clientHolding/getClientHoldingList',data)
}

/**
 * 删除客户持仓
 * @param {*} data 
 */
export function deleteClientHolding(data){
    return post('/clientHolding/deleteClientHolding',data)
}

/**
 * 历史明细
 */
export function getTransactionHistory(data) { 
    return post('/clientTransaction/getTransactionHistory',data)
}

/**
 * 添加新的申购/赎回
 */
export function ApplyingRedeem(data) { 
    return post('/clientTransaction/ApplyingRedeem',data)
}

/**
 * 客户持仓和收益 
 */
export function getHoldingCost(data) { 
    return post('/sysClient/getHoldingCostAndReturnByClientId',data)
}

/**
 * 获取页面提示信息
 */
 export function getSysTipsRecord(data) { 
    return post('/getSysTipsRecord',data)
}
export function updateTSysTipsRecord(data) { 
    return post('/updateTSysTipsRecord',data)
}