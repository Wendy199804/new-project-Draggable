/* eslint-disable */
require('script-loader!file-saver');
// import XLSX from 'xlsx-style'

function generateArray(table) {
    let out = [];
    let rows = table.querySelectorAll('tr');
    let ranges = [];
    for (let R = 0; R < rows.length; ++R) {
        let outRow = [];
        let row = rows[R];
        let columns = row.querySelectorAll('td');
        for (let C = 0; C < columns.length; ++C) {
            let cell = columns[C];
            let colspan = +cell.getAttribute('colspan');
            let rowspan = +cell.getAttribute('rowspan');
            let cellValue = cell.innerText;
            if (cellValue !== "" && cellValue == +cellValue) cellValue = +cellValue;

            //Skip ranges
            ranges.forEach(function (range) {
                if (R >= range.s.r && R <= range.e.r && outRow.length >= range.s.c && outRow.length <= range.e.c) {
                    for (let i = 0; i <= range.e.c - range.s.c; ++i) outRow.push(null);
                }
            });
            //Handle Row Span
            if (rowspan || colspan) {
                rowspan = rowspan || 1;
                colspan = colspan || 1;
                ranges.push({
                    s: { //s为开始
                        r: R, // 开始列
                        c: outRow.length // 开始取值范围
                    },
                    e: { // e为结束
                        r: R + rowspan - 1, // 结束列 
                        c: outRow.length + colspan - 1 // 结束取值范围
                    }
                });
            };

            //Handle Value
            outRow.push(cellValue !== "" ? cellValue : null);

            //Handle Colspan
            if (colspan)
                for (let k = 0; k < colspan - 1; ++k) outRow.push(null);
        }
        out.push(outRow);
    }
    return [out, ranges];
};

function datenum(v, date1904) {
    if (date1904) v += 1462;
    let epoch = Date.parse(v);
    return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
}

function sheet_from_array_of_arrays(data, opts) {
    let ws = {};
    let range = {
        s: {
            c: 10000000,
            r: 10000000
        },
        e: {
            c: 0,
            r: 0
        }
    };
    for (let R = 0; R != data.length; ++R) {
        for (let C = 0; C != data[R].length; ++C) {
            if (range.s.r > R) range.s.r = R;
            if (range.s.c > C) range.s.c = C;
            if (range.e.r < R) range.e.r = R;
            if (range.e.c < C) range.e.c = C;
            let cell = {
                v: data[R][C]
            };
            if (cell.v == null) continue;
            let cell_ref = XLSX.utils.encode_cell({
                c: C,
                r: R
            });

            if (typeof cell.v === 'number') cell.t = 'n';
            else if (typeof cell.v === 'boolean') cell.t = 'b';
            else if (cell.v instanceof Date) {
                cell.t = 'n';
                cell.z = XLSX.SSF._table[14];
                cell.v = datenum(cell.v);
            } else cell.t = 's';

            ws[cell_ref] = cell;
        }
    }
    if (range.s.c < 10000000) ws['!ref'] = XLSX.utils.encode_range(range);
    return ws;
}

function Workbook() {
    if (!(this instanceof Workbook)) return new Workbook();
    this.SheetNames = [];
    this.Sheets = {};
}

function s2ab(s) {
    let buf = new ArrayBuffer(s.length);
    let view = new Uint8Array(buf);
    for (let i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
}

export function export_table_to_excel({
    id,
    filename,
    colStyle,
    cellStyle
}) {
    let theTable = document.getElementById(id);
    let oo = generateArray(theTable),
        data = oo[0],
        ranges = oo[1]
    let ws_name = 'SheetJS',
        wb = new Workbook(),
        ws = get_ws_of_wb({ data, colStyle })
    ws['!merges'] = ranges
    if (cellStyle) {
        let keys = Object.keys(cellStyle)
        keys.forEach(key => {
            ws[key].s = cellStyle[key]
        })
    }
    wb.SheetNames.push(ws_name)
    wb.Sheets[ws_name] = ws
    save_to_excel(wb, filename)
}

export function export_json_to_excel({
    isGroup,        // 是否为多表格拼接
    isSheets,       // 是否含有多sheet
    header,         // 子表数据头信息
    colStyle,       // 列的样式
    data,           // 子表数据
    masterTable,	// 主表数据
    foot,			// 页脚
    filename,       // 文件名
    multiHeader,
    merges,
    autoWidth = true,
    bookType = 'xlsx'
} = {}) {
    let wb = new Workbook(), ws = null, ws_name = ''
    if (!isSheets) {
        ws_name = 'Sheet1'
        ws = get_wb_to_excel({
            isGroup,
            header,
            data,
            masterTable,
            multiHeader,
            merges,
            autoWidth,
            colStyle
        })
        wb.SheetNames.push(ws_name)
        wb.Sheets[ws_name] = ws
    } else {
        header.forEach((h, i) => {
            ws_name = filename[i] || 'Sheet' + (i+1)
            ws = get_wb_to_excel({
                header: h,
                data: data[i],
                masterTable,
                merges,
                autoWidth,
                colStyle
            })
            wb.SheetNames.push(ws_name)
            wb.Sheets[ws_name] = ws
        })
        // filename = filename.join('_')
        filename = filename[0]
    }
    save_to_excel(wb, filename)
}
function get_wb_to_excel({ isGroup, header, data, masterTable, multiHeader, merges, autoWidth, colStyle }) {
    if (!isGroup) {
        // 单个表格
        data = [...data]
        data.unshift(header)
        if (multiHeader) {
            for (let i = multiHeader.length - 1; i > -1; i--) {
                data.unshift(multiHeader[i])
            }
        }
        return get_ws_of_wb({ data, merges, colStyle })
    } else {
        // 多个表格
        let groupWs = {}, new_data = []
        header.forEach((h, i) => {
            new_data = [...data[i]]
            new_data.unshift(h)
            let ws = get_ws_of_wb({ data: new_data, colStyle: colStyle[i] })
            groupWs = togetherWs(groupWs, ws)
        })
        groupWs['!ref'] = 'A1:Z1000'
        return groupWs
    }
}
function togetherWs(ws1, ws2) {
    let gotLength = Object.keys(ws1).filter(item => item.indexOf('A') > -1).length,
        ws3 = {}
    Object.keys(ws2).forEach(key => {
        if (typeof(ws2[key]) == 'object' && key.indexOf('!') < 0) {
            ws3[key.slice(0, 1) + (+key.slice(1, key.length) + gotLength)] = ws2[key]
        }
    })
    let newWs = Object.assign(ws1, ws3)
    return newWs
}
function get_ws_of_wb({ data, masterTable, merges, autoWidth, colStyle }) {
    let ws = sheet_from_array_of_arrays(data);
    let mastertableList = [];
    let newTableData = [];


    if (masterTable) {
        // 处理主表内容
        let keyList = Object.keys(masterTable)
        let valueList = Object.values(masterTable)
        for (let i = 0; i < keyList.length; i += 2) {
            mastertableList.push([keyList[i], valueList[i] ? valueList[i] : '', '', '', keyList[i + 1] ? keyList[i + 1] : '', valueList[i + 1] ? valueList[i + 1] : ''])
        }
        newTableData = [...mastertableList, [], ...data] // 这个新数组是主表+字表
    }


    if (merges && merges.length > 0) {
        if (!ws['!merges']) ws['!merges'] = [];
        merges.forEach(item => {
            ws['!merges'].push(XLSX.utils.decode_range(item))
        })
    }

    if (autoWidth) {
        /*设置worksheet每列的最大宽度*/
        const colWidth = data.map(row => row.map(val => {
            /*先判断是否为null/undefined*/
            if (val == null) {
                return {
                    'wch': 10
                };
            }
            /*再判断是否为中文*/
            else if (val.toString().charCodeAt(0) > 255) {
                return {
                    'wch': val.toString().length * 2
                };
            } else {
                return {
                    'wch': val.toString().length
                };
            }
        }))
        /*以第一行为初始值*/
        let result = colWidth[0];
        for (let i = 1; i < colWidth.length; i++) {
            for (let j = 0; j < colWidth[i].length; j++) {
                if (result[j]['wch'] < colWidth[i][j]['wch']) {
                    result[j]['wch'] = colWidth[i][j]['wch'];
                }
            }
        }
        ws['!cols'] = result;
    }

    if (colStyle && colStyle.length > 0) {
        if (colStyle[0].align) {
            let keys = Object.keys(ws)
            keys.forEach((cell, index) => {
                if (index < keys.length - 1 && cell.indexOf('!') < 0) {
                    ws[cell].s = Object.assign(ws[cell].s || {}, {
                        alignment: {
                            horizontal: colStyle[index % colStyle.length].align
                        }
                    })
                }
            })
        }
        if (colStyle[0].width) {
            ws['!cols'] = colStyle.map(item => {
                return { wpx: item.width }
            })
        }
    }

    // 需要合并单元格的数组处理
    if (mastertableList.length > 0) {
        let mergeclumns = []
        mastertableList.forEach((element, index) => {
            mergeclumns.push({
                s: {
                    c: 1,
                    r: index + 1
                },
                e: {
                    c: 3,
                    r: index + 1
                }
            })
            mergeclumns.push({
                s: {
                    c: 5,
                    r: index + 1
                },
                e: {
                    c: 7,
                    r: index + 1
                }
            })
        });
        ws["!merges"] = [{
            s: {
                c: 0,
                r: 0
            },
            e: {
                c: ws['!cols'].length - 1,
                r: 0
            }
        }, ...mergeclumns,
        {
            s: {
                c: 0,
                r: mastertableList.length + 1
            },
            e: {
                c: ws['!cols'].length - 1, 
                r: mastertableList.length + 1
            }
        },
        {
            s: {
                c: 0,
                r: newTableData.length-1
            },
            e: {
                c: ws['!cols'].length - 1,
                r: newTableData.length-1
            }
        }];
        ws['!cols'] = [{wch: 10}] // 还是自定义样式：第一列列宽
        ws['!rows'] = [{hpx: 25}] // 还是自定义样式：第一行行高    
    }
    return ws
}
function save_to_excel(wb, filename) {
    let wbout = XLSX.write(wb, {
        bookType: 'xlsx',
        bookSST: false,
        type: 'binary'
    });
    saveAs(new Blob([s2ab(wbout)], {
        type: "application/octet-stream"
    }), `${filename}.xlsx`);
}
