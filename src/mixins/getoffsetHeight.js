export default {
    data() {
        return {
            my_offsetTop:''
        }
    },
    computed: {
        top(){
            console.log(1)
        }
    },
    methods: {
        getmyOffsetTop(){
            console.log(this.$refs['component-wrap'].offsetTop);
        }
    },
}