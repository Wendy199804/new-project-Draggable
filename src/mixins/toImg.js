import html2canvas from 'html2canvas'

export default {
    methods: {
        toimg() {
            let that = this
            // event.preventDefault()
            let canvas2 = document.createElement('canvas')
            let _canvas = document.getElementById('component-wrap')
            let w = parseInt(window.getComputedStyle(_canvas).width)
            let h = parseInt(window.getComputedStyle(_canvas).height)
            canvas2.width = w
            canvas2.height = h
            canvas2.style.width = w - 1 + 'px'
            canvas2.style.height = h - 1 + 'px'
            let context = canvas2.getContext('2d')
            context.scale(1, 1)
            html2canvas(_canvas, {
                canvas: canvas2,
            }).then((res) => {
                let blob = that.getBlob(res)
                this.blob = window.URL.createObjectURL(blob)
                this.finished = true
            })
        },
        getBlob(canvas) {
            //获取blob对象
            let data = canvas.toDataURL('image/jpeg', 1)
            data = data.split(',')[1]
            data = window.atob(data)
            let ia = new Uint8Array(data.length)
            for (let i = 0; i < data.length; i++) {
                ia[i] = data.charCodeAt(i)
            }
            return new Blob([ia], {
                type: 'image/jpeg',
            })
        },
    },
}