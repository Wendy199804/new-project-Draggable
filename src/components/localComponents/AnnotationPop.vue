<template>
    <el-popover v-if="title"
        placement="right"
        width="300"
        trigger="hover"
        :content="annotationContent"
    >
        <span slot="reference">
            <svg-icon icon-class="mark"/>
        </span>
        <!-- <div slot v-html="annotationContent"></div> -->
    </el-popover>
</template>

<script>
import analisisAnnotation from '@/utils/analisisAnnotation'
import managerAnnotation from '@/utils/managerAnnotation'

export default {
    name: 'AnnotationPop',
    props: ['title', 'from'],
    data() {
        return {

        }
    },
    computed: {
        annotationContent() {
            if (!this.title) return ''
            if (this.from == 'manager') {
                return managerAnnotation(this.title)[0]
            } else {
                return analisisAnnotation(this.title)[0]
            }
        }
    }
}
</script>

<style scoped>

</style>
