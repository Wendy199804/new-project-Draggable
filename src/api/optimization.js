import { post,get } from '@/utils/request'

/**
 * 查询优选基金
 * @param {fundType,fundType2} string
 */
export function selectGoodFundsAll(data){
    return post(`/goodFundPools/selectGoodFundsPoolAll`, data)
}
//goodFundPools/selectFundType2 返回type2

/**
 * 获取所有type2
 * @param {}
 */
export function getFundType2(data){
    return post(`/goodFundPools/selectFundType2`, data)
}

/**
 * 获取所有type
 * @param {}
 */
export function getFundType(data){
    return post(`/goodFundPools/selectFundType`, data)
}

/**
 * 首页获取部分优选基金
 */
export function selectGoodFundsHomePage(data){
    return get(`/goodFundPools/selectGoodFundsHomePage`, data)
}

/**
 * 获取市场观察报告
 */
export function selectFundReportList(data) {
    return post(`/fundReport/selectFundReportList`, data)
}

/**
 * 获取新基金列表
 */
export function getNewFundList(data) {
    return post(`/fund/selectFundInformationNewPageList`, data)
}