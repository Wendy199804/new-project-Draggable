// tableData = [{}, {}, {}, {}]
// tHeader = ['序号', '组合名称', '资金规模', '股票数量', '累计收益', '创建时间', '创建人']
// valName = ['id', 'name', 'size', 'number', 'earnings', 'time', 'founder']
// filename: 'table-list'

/**
 * @description 导出Excel（数据型）
 * @param {tableData}  表格数据list
 * @param {tHeader}  表头名称list
 * @param {valName}  每列数据对应的key
 * @param {filename}  下载后的文件名
 * @param {isGroup}  是否多表格数据拼接
 * @param {isSheets}  是否多sheet
 */
export function downloadExcel(tableData, tHeader, valName, filename, isGroup, isSheets) {
    // if (tableData.length === 0) return
    import('@/vendor/Export2Excel').then(excel => {
        let data = [],
            colStyle = [],
            header = []
        if (isGroup || isSheets) {
            data = tableData.map((arr, index) => {
                return arr.map(v => valName[index].map(j => v[j]))
            })
            tHeader.forEach((h, i) => {
                colStyle[i] = []
                header[i] = []
                h.forEach((title, index) => {
                    if (typeof(title) == 'object') {
                        const {name, style} = title
                        header[i][index] = name
                        colStyle[i][index] = style
                    } else {
                        header[i][index] = title
                        colStyle[i][index] = ''
                    }
                })
            })
        } else {
            data = tableData.map(v => valName.map(j => v[j]))
            tHeader.forEach((title, index) => {
                if (typeof(title) == 'object') {
                    const {name, style} = title
                    header[index] = name
                    colStyle[index] = style
                } else {
                    header[index] = title
                    colStyle[index] = ''
                }
            })
        }

        excel.export_json_to_excel({
            isGroup: isGroup || false,
            isSheets: isSheets || false,
            header,
            colStyle,
            data,
            filename
        })
    })
}

/**
 * 以页面table元素作为下载目标
 * @param {id}
 * @param {filename}
 * @param {colStyle} // [{width:200,align:'left'}]
 * @param {cellStyle} // [{'A1':{font:{}}}]
 */
export function downloadExcelFromTable(id, filename, colStyle, cellStyle) {
    import('@/vendor/Export2Excel').then(excel => {
        const el = document.getElementById(id)
        if (!el) return
        excel.export_table_to_excel({
            id,
            filename,
            colStyle,
            cellStyle
        })
    })
}

/**
 * 下载含有多级表头的表格
 * @param {tableData} 
 * @param {multiHeader}  多级表头，不含最后一行
 * @param {tHeader}  最后一行表头
 * @param {merges}  合并规则
 * @param {valName} 
 * @param {filename} 
 */
export function downloadMultiHeaderTable(tableData, multiHeader, tHeader, merges, valName, filename) {
    import('@/vendor/Export2Excel').then(excel => {
        let data = tableData.map(v => valName.map(j => v[j])),
            header = tHeader
        excel.export_json_to_excel({
            multiHeader,
            header,
            merges,
            data,
            filename
        })
    })
}