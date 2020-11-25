import { getHoldingDateList, getHoldingDateList2 } from '@/api/analysis'
import { push_request } from '../../api/analysis'

const state = {
    /** 基金一级分类type:
     *  1 : 非货币理财
     *  2 ：货币、理财
     */
    selectFundToAnalyze: {
        name: '',
        innercode: '',
        secucode: '',
        firsttypeChi: '', // 一级分类中文
        secondtypeChi: '', // 二级分类中文
        type: '', // 货币、非货币
        isNew: false, // 是否为新基金 
        raiseState: '' // 募集状态
    },
    analyzeFundDateList: [], // 可选截止日期（所有公布季报的日期）
    analyzeFundDateList2: [], // 可选截止日期（所有公布季报的日期）
    analyzeFundDateRange: {
        'since_founded': '',
        'year_start': '',
        'three_month': '',
        'six_month': '',
        'one_year': '',
        'three_years': '',
        'five_years': '',
    },
    analyzeFundRenderRecords: null
}

const mutations = {
    SET_SELECT_FUND_TO_ANALYZE: (state, {
        name,
        innercode,
        secucode,
        type,
        firsttypeChi,
        secondtypeChi,
        isNew,
        raiseState
    }) => {
        state.selectFundToAnalyze = {
            name,
            innercode,
            secucode,
            type,
            firsttypeChi,
            secondtypeChi,
            isNew,
            raiseState
        }
    },

    SET_ANALYZE_FUND_DATE_LIST: (state, list) => {
        if (list.length > 20) {
            list = list.slice(0, 20)
        }
        state.analyzeFundDateList = list
    },
    SET_ANALYZE_FUND_DATE_LIST_2: (state, list) => {
        if (list.length > 10) {
            list = list.slice(0, 10)
        }
        state.analyzeFundDateList2 = list
    },

    SET_ANALYZE_FUND_DATE_RANGE: (state, range) => {
        state.analyzeFundDateRange = range
    },

    CLEAR_DATA: (state) => {
        state.selectFundToAnalyze = {
            name: '',
            innercode: '',
            secucode: '',
            type: '',
            firsttypeChi: '',
            secondtypeChi: '',
            isNew: false,
            raiseState: ''
        }
        state.analyzeFundDateList = []
        state.analyzeFundDateList2 = []
        state.analyzeFundDateRange = {}
    }
}

const actions = {
    async setSelectFundToAnalyze({ commit }, data) {
        return new Promise(resolve => {
            commit('SET_SELECT_FUND_TO_ANALYZE', data)
            // 截止时间、时段（季报/半年报/年报日期）
            getHoldingDateList2({
                innerCode: data.innercode,
                fundType: data.firsttypeChi
            }).then(res => {
                let list = []
                if (Array.isArray(res) && res.length) {
                    list = res
                }
                commit('SET_ANALYZE_FUND_DATE_LIST_2', list)
            })
            getHoldingDateList({
                innerCode: data.innercode,
                fundType: data.firsttypeChi
            }).then(res => {
                let list = []
                if (Array.isArray(res) && res.length) {
                    list = res
                }
                commit('SET_ANALYZE_FUND_DATE_LIST', list)

                // 时段（自由选择）货币型/非货币型基金获取时段接口不同
                let type = data.type || (['货币型', '理财型'].includes(data.firsttypeChi) ? 2 : 1)
                let param = type === 2 ? {
                    type: 'cumulative_return_curve_time_period',
                    fund_code: data.innercode
                } : {
                    type: 'get_fund_period',
                    fund_innercode: data.innercode
                }
                push_request(param).then(res => {
                    let obj = {}
                    if (Object.keys(res).length > 0) {
                        res.period_name.forEach((key, index) => {
                            obj[key] = [res.start_date[index].slice(0, 10), res.end_date[index].slice(0, 10)]
                        })
                    }
                    commit('SET_ANALYZE_FUND_DATE_RANGE', obj)
                    resolve()
                })
            })

        })
    },

    clear({ commit }) {
        return new Promise(resolve => {
            commit('CLEAR_DATA')
            resolve()
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
