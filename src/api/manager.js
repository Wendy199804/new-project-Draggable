import { post } from '@/utils/request'


/**
 * 搜索基金经理
 * @param {}
 */


/** ---人物概览--- */

/**
 * 基金经理基本信息
 * @param {personalCode managerType}  
 */
export function getManagerInfo(data){
  return post(`/fundNewManager/getManagerInformation`, data)
}

/**
 * 基金经理职业生涯
 * @param {personalCode}  
 */
export function getProfessionalHistory(data){
  return post(`/fundNewManager/getFundManagerCareer`, data)
}

/**
 * 基金经理指标
 * @param {personalCode managerType}  getmanagerType
 */
export function getManagerIndex(data){
  return post(`/fundNewManager/getManagerindex`, data)
}

/**
 * 基金经理指数
 * @param {personalCode managerType}  
 */
export function getManagerType(data){
  return post(`/fundNewManager/getmanagerType`, data)
}

/**
 * 基金经理基本信息 概览
 * @param {personalCode managerType}  
 */
export function getManagerBasic(data){
  return post(`/fundNewManager/getManagerBasic`, data)
}

/**
 * 基金经理历史评级 
 * @param {personalCode} 
 */
export function getManagerstars(data){
  return post(`/fundNewManager/getManagerstars`, data)
}

/**
 * 风险收益表现
 * @param {*} data 
 */
export function getManagerFundRiskReturnPerformance(data){
  return post(`/fundNewManager/getManagerFundRiskReturnPerformance`,data)
}

/**
 * 收益表现-区间收益
 * @param {*} data 
 */
export function getRangeReturn(data){
  return post(`/fundNewManager/getRangeReturn`,data)
}
/** ---人物概览 结束--- */


/** ---旗下基金--- */
// 获取基金列表
export function getFundList(data){
    return post(`/fundNewManager/getManagersFundDistribution`, data)
}
// 基金类型分布-当前
export function getCurrentFundTypeDistribution(data) {
    return post('/fundNewManager/getHistoryFundTypeDistribution', data)
}
// 基金风格分布
export function getFundStyleDistribution(data) {
    return post('/fundNewManager/getFundManagerSubordinateFundStyle', data)
}
// 收益风险指标
export function getReturnAndRiskIndicators(data) {
    return post('/fundNewManager/getReturnRiskIndex', data)
}
/** ---旗下基金 结束--- */


/** ---收益与风险--- */

/** ---收益与风险 结束--- */


/** ---持仓汇总--- */

/** ---持仓汇总 结束--- */