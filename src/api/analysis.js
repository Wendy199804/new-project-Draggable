import { post } from '@/utils/request'

/**
 * 搜索基金
 * @param {innerCode}
 */
export function searchFund(data){
    return post(`/fund/selectFundInformationList`, data)
}


//** ---非货币型基金--- */

/**
 * 顶部标签
 * @param {innerCode} api/mfShareschange/selectLabels
 */
export function fundselectLabels(data){
    return post(`/mfShareschange/selectLabels`, data)
}

/**
 * 基金评级、净值 - （左边部分）
 * @param {innerCode}
 */
export function fundNetValue(data){
    return post(`/mfShareschange/selectFundInfoByInnercode`, data)
}
export function getCurrentValuation(data) {
    return post ('/realTimeValuation/getFundRealTimePriceByInnercode', data)
}
export function getRealTimeValuation(data) {
    return post ('/realTimeValuation/getFundPriceByInnercode', data)
}

/**
 * 基金指标与排名 - （右边部分）
 * @param {innerCode}
 */
export function FundIndAndRank(data){
    return post(`/mfShareschange/selectmfReturnByInnercode`, data)
}

/**
 * 历史评级 
 * @param {innerCode: 2403,startDate: "2020-05-20"}
 */
export function FundHistoryRank(data){
    return post(`/mfShareschange/selectHistoricalRating`, data)
}

/**
 * 基金信息
 * @param {innercode} 
 */
export function FundInfomsg(data){
    return post(`/mfShareschange/selectFundInfoMationBasic`, data)
}

/**
 * 基金购买信息
 * @param {innercode}
 */
 export function FundCustInfo(data){
    return post(`/mfShareschange/selectMfFundArchives`, data)
}

/**
 * 基金经理：现任/历任
 * @param {innercode}
 */
export function FundManagerList(data){
    return post(`/mfShareschange/selectManagerByInnercode`, data)
}

/**
 * 运营信息
 * @param {innercode startDate endDate}  
 */
export function operationalInformation(data){
    return post(`/mfShareschange/selectByInnercodeAndTime`, data)
}

/**
 * 收藏基金
 * @param {innerCodes:[]}  
 */
export function FavFund(data){
    return post(`/collectFund/saveUserFund`, data)
}

/**
 * 取消收藏基金
 * @param {innerCodes:[]}  
 */
export function cancelFavFund(data){
    return post(`/collectFund/deleteUserCollectFundByInnerCode`, data)
}

/**
 * 该基金是否被收藏
 * @param {innerCodes}  
 */
export function isFundFaved(data){
    return post(`/collectFund/selectCollectFundByinnerCode`, data)
}

/**
 * 下载历史净值表格
 * @param {*} data 
 */
export function getNvReturnTable(data){
    return post(`/apiModel/getNvReturnTable`,data)
}

/**
 * 新基金信息 
 * @param {*} data 
 */
export function searchNewFund(data){
    return post(`/fund/selectFundInformationNewByInnerCode`, data)
}
//** ---非货币型基金 结束--- */

//** ---货币型基金--- */

/**
 * 基金名称、信息
 * @param {innercode}
 */
export function nfundNetValue(data){
    return post(`/currencyFund/getCurrencyFund`, data)
}

/**
 * 基金指标
 * @param {innercode} 
 */
export function nFundIndAndRank(data){
    return post(`/currencyFund/getMfweeklyyieldavg`, data)
}

/**
 * 业绩走势
 * @param {innercode} 
 */
export function getDailyProfitAndYield(data){
  return post(`/currencyFund/getDailyProfitAndYield`, data)
}

//** ---货币型基金 结束--- */

//**---模型接口--- */

/**
 * 业绩走势
 * @param {
 * type //模型名称
 * exec_type //sync
 * fund_innercode //innerCode
 * index_code //基数
 * start_date //开始日期
 * end_date //结束日期
 * }  
 */
export function push_request(data){
    return post(`/model/push_request`, data)
}

/**
 * 业绩走势时段
 * @param {fund_innercode //innerCode}  
 */
export function get_result(data){
    return post(`/model/get_result`, data)
}
//**---模型接口 结束--- */


/**
 * 获取基金公布季报的日期（从两张不同表里取）
 * @param {innercode}
 */
// MF_AssetAllocation
export function getHoldingDateList(data){
    return post('/assetallocation/getReportDateList', data)
}
// MF_IncomeStatementNew
export function getHoldingDateList2(data){
    return post('/assetallocation/getMfIncomestatementnewByEndDate', data)
}

/** ---产品概览--- */
// 前十大重仓
export function getTop10Stocks(data) {
    return post('assetallocation/getMfStockSecuAbbrList', data)
}

/**新增 */

/**收益风险指标 */
export function getFundRiskIndicators(data){
    return post('/fund/getFundRiskIndicators',data)
}
/**同公司基金 */
// export function getSameCompanyFundInfoList(data){
//     return post('/fund/getSameCompanyFundInfoList',data)
// }

/** ---产品概览 结束--- */


/** ---持仓分析--- */
// 大类资产分布
export function getAssetsTypeDistribution(data) {
    return post('/assetallocation/findMfAssetallocationList', data)
}
// 股票资产分布
export function getStockAssetsDistribution(data) {
    return post('/assetallocation/findMfInvestindustryList', data)
}
// 股票风格
export function getStockStyle(data) {
    return post('/assetallocation/findFundStyleSquaredUpVoByInnerCodeMap', data)
}
// 前十大重仓股票
export function getTopStockHoldings(data) {
    return post('/assetallocation/selectMfStockSecuAbbrRatioInNV', data)
}
// 前十大重仓股票权重变化
export function getTopStockWeights(data) {
    return post('/assetallocation/getMfKeystockportfolioListMap', data)
}
// 全部股票明细
export function getStockDetails(data) {
    return post('/assetallocation/getMfStockportfoliodetailListMap', data)
}
// 债券资产分布
export function getBondAssetsDistribution(data) {
    return post('/assetallocation/findMfBondportifoliostruList', data)
}
// 前五大重仓债券
export function getTopBondHoldings(data) {
    return post('/assetallocation/getIMfBondportifoliodetailList', data)
}
// 前十大持仓基金
export function getTopFundHoldings(data) {
    return post('/assetallocation/findFundSecuNameAndRatioInNVMap', data)
}
/** ---持仓分析 结束--- */


/** ---收益归因--- */

/** ---收益归因 结束--- */


/** ---场景分析--- */

/** ---场景分析 结束--- */


/** ---相似基金--- */
export function getSimilarRanking(data) {
    return post('/mfShareschange/selectIncomeRanking', data)
}
/** ---相似基金 结束--- */


/** ---基金公司--- */
// 基金公司概览
export function getFundCompanyInfo(data) {
    return post('/fundCompany/getFundCompanyByInnerCode', data)
}
// 规模变化图表
export function getCompanySizeChart(data) {
    return post('/fundCompany/getByCompanyCodeAndEndDate', data)
}
// 规模变化表格
export function getCompanySizeTable(data) {
    return post('/fundCompany/getByCompanyCodeAndEndDateTable', data)
}
// 旗下产品结构图表
export function getCompanyProductsChart(data) {
    return post('/fundCompany/getFundTypeAndNv', data)
}
// 旗下产品结构表格
export function getCompanyProductsTable(data) {
    return post('/fundCompany/getFundTypeAll', data)
}
// 基金评级分布
export function getCompanyFundsRating(data) {
    return post('/fund/getSameCompanyFundStarsSizeNv', data)
}
// 基金经理评级分布
export function getCompanyManagersRating(data) {
    return post('/fundNewManager/getSameFundManagerNv', data)
}
// 同公司基金
export function getCompanyRatedFunds(data) {
    return post('/fund/getSameCompanyFundInfoList', data)
}
/** ---基金公司 结束--- */


/** ---基金经理--- */
export function getHistoryManagers(data) {
    return post('/fundNewManager/selectAllManagerByInnercode', data)
}
/** ---基金经理 结束--- */