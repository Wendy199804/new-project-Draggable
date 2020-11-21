
<template>
    <div class="print">
        <iframe id="iframe" style="display: none"></iframe>
    </div>
</template>
<script>
export default {
    name: 'print',
    props: {
        html: {
            type: String,
            default: '',
        },
    },
    mounted() {
        this.setBodyHtml(this.html)
    },
    methods: {
        setBodyHtml(html) {
            const document = window.document
            const iframe = window.frames[0]
            iframe.document.head.innerHTML = document.head.innerHTML
            iframe.document.body.innerHTML = html
            iframe.window.print()
        },
    },
}
</script>