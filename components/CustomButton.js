Vue.component('custom-buttom', {
    data: function() {
        return {
            count: 0
        }
    },
    props: ["title", ""],
    template: `
        <div class="customLink q-mr-xs q-ml-xs">
            <div class="customLinkText text-weight-bold">
                <div class="q-pa-sm text-h5">
                   {{this.title}}
                </div>
                <div class="customLinkBackground"></div>
            </div>
        </div>
    `
})