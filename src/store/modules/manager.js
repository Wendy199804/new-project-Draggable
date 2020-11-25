import { push_request } from '@/api/analysis'
import { getManagerType } from '@/api/manager'
import { gettheManagerType } from '@/utils/analyze'

const state = {
    managerInfo: {
        name: '',
        id: '',
        type: '',
        typechi: ''
    },
    managerDateList: [],
    managerDateList2: [],
    managerDateRange: {
        since_founded: '',
        year_start: '',
        one_year: '',
        three_years: '',
        five_years: ''
    }
}

const mutations = {
    SET_MANAGER_INFO: (state, { name, id, type, typechi }) => {
        state.managerInfo = { name, id, type, typechi }
    },

    SET_MANAGER_DATE_LIST: (state, list) => {
        if (list.length > 20) {
            list = list.slice(0, 20)
        }
        state.managerDateList = list
    },

    SET_MANAGER_DATE_LIST_2: (state, list) => {
        if (list.length > 20) {
            list = list.slice(0, 20)
        }
        state.managerDateList2 = list
    },

    SET_MANAGER_DATE_RANGE: (state, range) => {
        state.managerDateRange = range
    },

    CLEAR_MANAGER_INFO: state => {
        state.managerInfo = {
            name: '',
            id: '',
            type: '',
            typechi: ''
        }
        state.managerDateList = []
        state.managerDateList2 = []
        state.managerDateRange = {}
    }
}

const actions = {
    async setManagerInfo({ commit }, data) {
        return new Promise(async resolve => {
            let manager_info = {}
            if (Object.keys(data).length === 2) {
                const res = await getManagerType({ personalCode: data.id })
                let option = gettheManagerType(res)
                manager_info = {
                    id: data.id,
                    name: data.name,
                    type: option.value,
                    typechi: option.label
                }
                
            } else {
                manager_info = data
            }
            commit('SET_MANAGER_INFO', manager_info)
            // 截止时间
            push_request({
                type: 'get_manager_half_year_report_dates',
                personal_id: data.id
            }).then(res => {
                let list = []
                if (res && res.end_date) {
                    list = res.end_date.map(item => item.slice(0, 10))
                }
                commit('SET_MANAGER_DATE_LIST_2', list)
            })
            push_request({
                type: 'asset_distribution_end_date',
                personal_id: data.id
            }).then(res => {
                let list = []
                if (res && res.end_date) {
                    list = res.end_date.map(item => item.slice(0, 10))
                }
                commit('SET_MANAGER_DATE_LIST', list)
                // 时段
                push_request({
                    type: 'manager_index_curve_time_period',
                    personal_id: data.id,
                    manager_type: manager_info.type
                }).then(res => {
                    let obj = {}
                    if (Object.keys(res).length > 0) {
                        res.period_name.forEach((key, index) => {
                            obj[key] = [res.start_date[index].slice(0, 10), res.end_date[index].slice(0, 10)]
                        })
                    }
                    commit('SET_MANAGER_DATE_RANGE', obj)
                    resolve()
                })
            })
        })
    },

    clear({ commit }) {
        return new Promise(resolve => {
            commit('CLEAR_MANAGER_INFO')
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
