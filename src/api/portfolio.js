import { post } from '@/utils/request'

/**
 * 获取多个基金的成立日期等基本信息
 * @param {innerCodes}
 */
export function getBasicInfoByInnercode(data) {
    return post(`/fundGroupItem/getMaxStartData`, data)
}

/**
 * 获取多个基金简称等基本信息
 * @param {secuCodeList} 
 */
export function getFundNameBySecucode(data) {
    return post('/SecuMain/selectSecuCodes', data)
}

/**
 * 新建/另存新组合、保存组合
 */
export function savePortfolio(data) {
    return post('/fundGroup/saveParentFundGroup', data)
}

/**
 * 获取我的组合列表
 * @param {pageIndex} 分页页码
 * @param {pageCount} 每页条数
 */
export function getPortfolioList(data) {
    return post('/fundGroup/selectFundGroupVoByCreateUser', data)
}

/**
 * 删除一个组合
 * @param {id} 要删除的组合id
 */
export function deletePortfolio(data) {
    return post('/fundGroup/deleteFundGroupById', data)
}

/**
 * 获取单个组合信息
 * @param {id} 查询的组合id
 */
export function getPortfolioDetail(data) {
    return post('/fundGroup/findByIdFundGroupResult', data)
}