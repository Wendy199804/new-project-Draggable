const getters = {
    sidebar: state => state.app.sidebar,
    device: state => state.app.device,
    // token: state => state.user.token,
    // avatar: state => state.user.avatar,
    // name: state => state.user.name,

    token: state => state.user.token,
    userInfo: state => state.user.userInfo,
    loginError: state => state.user.loginError,

    selectFundToAnalyze: state => state.FundAnalyze.selectFundToAnalyze,
    analyzeFundDateList: state => state.FundAnalyze.analyzeFundDateList,
    analyzeFundDateList2: state => state.FundAnalyze.analyzeFundDateList2,
    analyzeFundDateRange: state => state.FundAnalyze.analyzeFundDateRange,
    analyzeFundRenderRecords: state => state.FundAnalyze.analyzeFundRenderRecords,
    analyzeFundDataSource: state => state.FundAnalyze.analyzeFundDataSource,

    managerInfo: state => state.Manager.managerInfo,
    managerDateList: state => state.Manager.managerDateList,
    managerDateList2: state => state.Manager.managerDateList2,
    managerDateRange: state => state.Manager.managerDateRange
}
export default getters
