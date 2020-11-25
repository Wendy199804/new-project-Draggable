
// 全局方法
// 页内路由跳转
export default function routeOpen(match){
    const { href } = this.$router.resolve(match)
    window.open(href, '_blank', 'noopener')
}