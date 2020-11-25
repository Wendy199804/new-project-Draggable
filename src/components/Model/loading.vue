<template>
    <div v-if="show" :class="['loading-mask',transparent ? 'transparent' : 'nottransparent']">
        <div class="loading-content"></div>
    </div>
</template>

<script>
export default {
    name: 'Loading',
    props: {
        show: {
            type: Boolean,
            default: false
        },
        transparent:{
            type: Boolean,
            default: false
        }
    },
    methods: {
        toggleClick() {
            this.$emit('toggleClick')
        }
    }
}
</script>

<style lang="scss" scoped>
.transparent{
    background: rgba(255, 255, 255, 0.7);
}
.nottransparent{
    background: rgba(255,255,255,1);
}
.loading-mask{
    position: absolute;
    z-index: 1500;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    // background: rgba(255,255,255,1);
    display: flex;
    justify-content: center;
    align-items: center;
    
    .loading-content{
        position: absolute;
        width: 100%;
        top: 50%;
        transform: translateY(-50%);
        text-align: center;
        &:before {
            content: "";
            display: inline-block;
            width: 34px;
            height: 34px;
            background-image: url(data:image/gif;base64,R0lGODlhIgAiALMJAL3t/wCp5gCRxgm9/53l/ynG/0vP/2vY/4vg/////wAAAAAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/wtYTVAgRGF0YVhNUDw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDE0IDc5LjE1Njc5NywgMjAxNC8wOC8yMC0wOTo1MzowMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDozOWFmMzQ2MC01YjUzLTA3NGYtYWRkOC0xNWRmMWZmNWNmMTgiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NUY2MTFENzYzOTE1MTFFN0I3NTBBN0FERDkzMkJCQzkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NUY2MTFENzUzOTE1MTFFN0I3NTBBN0FERDkzMkJCQzkiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NjljZWM3OTQtYzJjNS1mZDQ3LWI5NjQtZTllNDhkN2FlY2JkIiBzdFJlZjpkb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6Y2U2N2FmMDctMzkxMi0xMWU3LThkZDgtOWE2NWYz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);
        }
        &:after {
            // content: "\6570\636E\52A0\8F7D\4E2D\FF0C\8BF7\7B49\5F85\FF01";
            display: block;
            color: #17c;
        }
    }
}
</style>
