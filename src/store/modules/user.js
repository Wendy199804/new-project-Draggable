import { login } from "@/api/user";
import {
    getToken,
    setToken,
    removeToken,
    getExpiredTime,
    setExpiredTime,
    getUser,
    setUser,
    removeUser
} from "@/utils/auth";
import { resetRouter } from "@/router";
import { getUserinfo } from "@/api/user";

const state = {
    token: getToken() || '',
    userInfo: getUser() || { username: '', company: '', userId: '' },
    loginError: {}
};

const mutations = {
    SET_TOKEN: (state, data) => {
        state.token = data
    },
    SET_USERINFO: (state, data) => {
        state.userInfo = data
    },
    SET_LOGINERROR: (state, data) => {
        state.loginError = data
    }
};

const actions = {
    // 用户登录
    login({ commit }, { username, password }) {
        return new Promise((resolve, reject) => {
            login({
                username: username.trim(),
                password: password
            })
            .then(res => {
                commit("SET_LOGINERROR", '')
                commit("SET_TOKEN", res.token);
                setToken(res.token);
                setExpiredTime(res.expiresIn);
                getUserinfo().then(res => {
                    commit("SET_USERINFO", res);
                    setUser(res);
                    localStorage.setItem(
                        "selectFundsToCompare",
                        JSON.stringify([])
                    );
                    resolve();
                });
                resolve();
            })
            .catch(error => {
                commit("SET_LOGINERROR", error)
                reject(error);
            });
        });
    },

    // 用户登出
    logout({ commit, dispatch }) {
        return new Promise(resolve => {
            commit("SET_TOKEN", "");
            removeToken();

            commit("SET_USERINFO", { username: "", company: "", userId: "" });
            removeUser();

            resetRouter();
            // 清除基金评测、基金比较数据
            dispatch("FundAnalyze/clear", {}, { root: true });
            // dispatch("FundsCompare/clear", {}, { root: true });
            // localStorage.removeItem("selectFundsToCompare");
            // localStorage.removeItem("compareFundsDateList");
            // localStorage.removeItem("compareFundsDateRange");
            resolve();
        });
    },

    resetToken({ commit }, token) {
        commit("SET_TOKEN", token);
        setToken(token);
    },

    getUserInfo({ commit }) {
        return new Promise(resolve => {
            getUserinfo().then(res => {
                commit('SET_USERINFO', res)
                setUser(res)
                resolve()
            })
        })
    },

    clearLoginError({ commit }) {
        commit('SET_LOGINERROR', '')
    }

};

export default {
    namespaced: true,
    state,
    mutations,
    actions
};
