
import { post } from '@/utils/request';

export default {
    data() {
        return {
            
        }
    },
    methods: {
        /**
         * 基金搜索、添加
         */
        querySearchCodeAsync(queryString, cb) {
            if (!queryString) {
                cb([])
                return
            }
            this.timeout && clearTimeout(this.timeout)
            setTimeout(() => {
                this.searchFund({ secuCode: queryString }).then(results => {
                    cb(results)
                })
            }, 1000)
        },
        querySearchNameAsync(queryString, cb) {
            if (!queryString) {
                cb([])
                return
            }
            this.timeout && clearTimeout(this.timeout)
            this.timeout = setTimeout(() => {
                this.searchFund({ chiNameAbbr: queryString }).then(results => {
                    cb(results)
                })
            }, 1000)
        },
        searchFund(query) {
            return new Promise((resolve, reject) => {
                post('/SecuMain/selectSecuCodeAndabbr',
                Object.assign(query, { pageCount: 10, pageIndex: 1 })).then(res => {
                    let list = res.records.map(item => {
                        return Object.assign(item, {
                            value: `${item.chiNameAbbr}(${item.secuCode})`
                        })
                    })
                    resolve(list)
                })
            })
        },

        handleSelect(item, index) {
            if (this.tableData.find(row => row.code == item.secuCode)) {
                this.$message.error('请勿重复添加')
                return
            }

            let current = this.tableData[index]
            delete current.isAdd
            delete current.searchCode
            delete current.searchName
            current.code = item.secuCode
            current.name = item.chiNameAbbr
            current.type = item.fundType
            this.$set(this.tableData, index, current)
        }
    }
}