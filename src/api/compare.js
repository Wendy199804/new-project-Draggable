import { post } from '@/utils/request'

/**
 * 产品概览比较 - 区间收益
 * @param {innerCodes} data 
 */
export function getCompareRange(data) {
    return post('/compareFund/selectMFIndexReturnList', data)
}

/**
 * 产品概览比较 - 基本信息
 * @param {innerCodes} data 
 */
export function getCompareFundInfo(data) {
    return post('/compareFund/selectCompareFundInformationList', data)
}


/**
 * 资产配置比较 - 大类资产分布
 * @param {innerCodeList}
 */
export function getAssetsDistribution(data) {
    return post('/compareFund/getCompareAssetsByInnerCodeList', data)
}

/**
 * 资产配置比较 - 股票资产分布
 * @param {innerCodeList}
 */
export function getStockDistribution(data) {
    return post('/compareFund/getCompareStockByInnerCodeList', data)
}

/**
 * 资产配置比较 - 前十大重仓股票
 * @param {innerCodeList}
 */
export function getTop10StockHoldings(data) {
    return post('/compareFund/getCompareKeyStockByInnerCode', data)
}

/**
 * 资产配置比较 - 债券资产分布
 * @param {innerCodeList}
 */
export function getBondDistribution(data) {
    return post('/compareFund/getCompareBonbByInnerCodeMap', data)
}

/**
 * 资产配置比较 - 前五大重仓债券
 * @param {innerCodeList}
 */
export function getTop5BondHoldings(data) {
    return post('/compareFund/getComparemfBondportifoliodetailByInnerCode', data)
}