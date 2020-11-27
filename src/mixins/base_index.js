import { mapGetters } from 'vuex'

export default {
    computed: {
        ...mapGetters(['selectFundToAnalyze']),
        base_index_name() {
            return this.selectFundToAnalyze.firsttypeChi === '债券型' ? '中证全债' : '沪深300'
        },
        base_index_code(){
            return this.selectFundToAnalyze.firsttypeChi === '债券型' ? 'H11001' : '000300'
        }
    }
}
