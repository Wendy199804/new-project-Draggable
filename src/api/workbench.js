import { post } from '@/utils/request'

/**
 * 基金筛选
 * @param {*} data 
 */
export function filterMarketFund(data) {
    return post('/fund/selectFundInformationPageResult', data)
}
/**
 * 基金排行
 * @param {*} data 
 */
export function getFundsRanking(data) {
    return post('/fundRanking/getMfIntervalReturn1Page', data)
}
export function getIndexFundsRanking(data) {
    return post('/fundRanking/getIndexMfIntervalReturn1Page', data)
}


/**
 * 获取自选基金列表
 * @param {groudId} 分组id
 * @param {userId} 用户id 
 * @param {pageIndex} 页数
 * @param {pageCount} 每页条数
 */
export function getSelectedFund(data) {
    return post('/collectFund/selectAllCollectPageList', data)
}
/**
 * 获取用户某只基金的收藏状态
 * @param {innercode} 基金代码
 */
export function getCollectStatus(data) {
    return post('/collectFund/selectCollectFundByinnerCode', data)
}
/**
 * 收藏基金
 * @param {groudId} 分组id
 * @param {innercode} 基金代码 list
 */
export function collectFund(data) {
    return post('/collectFund/saveUserFund', data)
}
/**
 * 取消收藏
 * @param {innercode} 基金代码 list
 */
export function cancelCollect(data) {
    return post('/collectFund/deleteUserCollectFundByInnerCode', data)
}


/**
 * 获取自选基金经理列表
 * @param {pageIndex} 页数
 * @param {pageCount} 每页条数
 */
export function getSelectedManager(data) {
    return post('/collectManager/selectAllCollectManagerPageResult', data)
}
/**
 * 获取某个基金经理的收藏状态
 * @param {personalCode} 基金经理代码
 */
export function getManagerCollectStatus(data) {
    return post('/collectManager/selectCollectManagerByPersonalCode', data)
}
/**
 * 收藏基金经理
 * @param {groupId} 基金经理代码 list
 * @param {personalCode} 基金经理代码 list
 */
export function collectManager(data) {
    return post('/collectManager/saveCollectManager', data)
}
/**
 * 取消收藏
 * @param {personalCode} 基金经理代码 list
 */
export function cancelCollectManager(data) {
    return post('/collectManager/deleteCollectManager', data)
}

/**
 * 获取浙商代销基金列表
 * @param {pageIndex} 页数
 * @param {pageCount} 每页条数
 */
export function getZheshangFundList(data) {
    return post('/collectFund/selectCompanyCollectFundPageList', data)
}

/**
 * 获取任务列表
 * 无参
 */
export function getSysExecTaskVoList(data) {
    return post('/scheduledTask/getSysExecTaskVoList', data)
}
/**
 * 任务详情
 * @param {taskId}
 */
export function getTaskDetails(data) {
    return post('/scheduledTask/getList', data)
}

/**
 * 调整分组
 * @param {groupId} 分组id
 * @param {fundNewGroupId} 新分组分组id
 * @param {innerCodes} 基金代码
 */
export function adjustGroup(data) {
    return post('collectGroup/adjustFundGrouping', data)
}

/**
 * 调整分组
 * @param {groupId} 分组id
 * @param {fundNewGroupId} 新分组分组id
 * @param {innerCodes} 基金代码
 */
export function adjustManagerGroup(data){
    return post('collectGroup/adjustFundManagerGrouping', data)
}
/**
 * 查询自选分组
 * @param {groupName} 分组名称
 * @param {groupType} 区分自选分组基金和自选分组基金经理
 * @param {id} 主键id
 * @param {userId} 用户id
 */
export function selectCollectFundGroup(data) {
    return post('collectGroup/selectCollectFundGroup', data)
}
/**
 * 添加自选分组
 * @param {groupName} 分组名称
 * @param {groupType} 区分自选分组基金和自选分组基金经理
 * @param {id} 主键id
 * @param {userId} 用户id
 */
export function saveCollectFundGroup(data) {
    return post('collectGroup/saveCollectFundGroup', data)
}
/**
 * 删除自选分组
 * @param {groupName} 分组名称
 * @param {groupType} 区分自选分组基金和自选分组基金经理
 * @param {id} 主键id
 * @param {userId} 用户id
 */
export function deleteCollectFundGroup(data) {
    return post('collectGroup/deleteCollectFundGroup', data)
}
/**
 * 修改自选分组
 * @param {groupName} 分组名称
 * @param {groupType} 区分自选分组基金和自选分组基金经理
 * @param {id} 主键id
 * @param {userId} 用户id
 */
export function updateCollectFundGroup(data) {
    return post('collectGroup/updateCollectFundGroup', data)
}
/**
 * 查询该分组基金经理是否被收藏
 * @param {innerCode} 基金经理代码
 * @param {groupId} 组id
 */

export function selectCollectByInnerCodeAndGroupId(data) {
    return post('collectFund/selectCollectFundByinnerCodeAndGroupId', data)
}
/**
 * 查询该分组基金经理是否被收藏
 * @param {personalCode} 基金经理代码
 * @param {groupId} 组id
 */

export function selectCollectManagerByPersonalCodeAndGroupId(data) {
    return post('collectManager/selectCollectManagerByPersonalCodeAndGroupId', data)
}