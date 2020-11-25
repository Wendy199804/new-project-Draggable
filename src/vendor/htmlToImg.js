import html2canvas from 'html2canvas'

/**
 * @param  domId        要生成 pdf 的DOM元素
 * */

// export function downloadIMG(domId, imgName) {
//     let dom = document.getElementById(domId)
//     let style_width = dom.offsetWidth + 'px'
//     let style_height = dom.offsetHeight + 'px'
//     dom.style.position='fixed'
//     let style_top = dom.offsetTop - window.pageYOffset + 'px'
//     let style_left = dom.offsetLeft + 'px'
//     dom.style.top= style_top
//     dom.style.left= style_left
//     dom.style.width= style_width
//     dom.style.height= style_height

//     let canvas_y = dom.offsetTop + window.pageYOffset
//     let canvas_x = dom.offsetLeft
//     // window.pageYOffset = 0
//     // document.documentElement.scrollTop = 0
//     // document.body.scrollTop = 0
//     html2canvas(dom, {
//         // useCORS: true, //（图片跨域相关）
//         // allowTaint: false, //允许跨域（图片跨域相关）
//         // taintTest: true, //是否在渲染前测试图片
//         width: dom.offsetWidth,     //显示的canvas窗口的宽度
//         height: dom.offsetHeight,   //显示的canvas窗口的高度
//         // windowWidth: Window.innerWidth,   // 获取X轴方向滚动条中的内容
//         // windowHeight: Window.innerHeight,   // 获取Y轴方向滚动条中的内容
//         x: canvas_x,   // 页面在X轴上没有滚动，故设为0
//         y: canvas_y  // 页面在垂直方向的滚动距离
//     }).then(canvas => {
//         let base64 = canvas.toDataURL("image/png")
//         // var image = new Image()
//         // image.src = base64
//         // document.body.appendChild(image)
//         dom.style.position='relative'
//         dom.style.top= null
//         dom.style.left= null

//         let blob = base64ToBlob(base64)
//         let a = document.createElement('a')
//         a.href = URL.createObjectURL(blob)
//         a.download = imgName
//         a.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true, view: window}))
//     })
// }
// function base64ToBlob(code) {
//     let parts = code.split(';base64,')
//     let contentType = parts[0].split(':')[1]
//     let raw = window.atob(parts[1])
//     let rawLength = raw.length

//     let uInt8Array = new Uint8Array(rawLength)

//     for (let i = 0; i < rawLength; ++i) {
//         uInt8Array[i] = raw.charCodeAt(i)
//     }
//     return new Blob([uInt8Array], {type: contentType})
// }

export function downloadIMG(domId, imgName, ) {

    let imageWrapper = document.getElementById(domId)
    let windowpageYOffset = window.pageYOffset
    window.scrollTo(0, 0) //如果窗口滚动的话需要 滚动到顶部
    html2canvas(imageWrapper, {
        x: imageWrapper.getBoundingClientRect().left, // 绘制的dom元素相对于视口的位置，由于获取的位置比原本往前偏离的所以要加上，你需要根据自己的视图去计算
        y: imageWrapper.getBoundingClientRect().top, // top没有偏离所以不用修改
        backgroundColor: '#FFF',
        width: imageWrapper.offsetWidth, // 因为多出的需要剪裁掉，
        height: imageWrapper.offsetHeight,
        useCORS: true,
        scale: 3, // 因为生成图片会模糊，但是这个会使下载的图片变大，可以使用base64压缩
        dpi: window.devicePixelRatio, //z
        windowWidth: document.body.scrollWidth,
        windowHeight: document.body.scrollHeight,
    }).then(canvas => {
        const img = canvas.toDataURL("image/png").replace("data:image/png;base64,", "")
        const finalImageSrc = "data:image/png;base64," + img
        // 添加a标签用于下载
        const aElem = document.createElement('a')
        document.body.appendChild(aElem) // ...kb
        aElem.href = finalImageSrc
        // 图片下载名
        aElem.download = imgName
        aElem.click()
        document.body.removeChild(aElem) // 完成后移除
    })
    window.scrollTo(0,windowpageYOffset) // 滚动回原来的位置
}
