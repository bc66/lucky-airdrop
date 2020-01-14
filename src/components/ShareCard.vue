<template>
    <div class="container-fluid envelope-container envelope-container--link">
        <div class="container-fluid envelope-link">
            <h2>{{ $t("share.title") }}</h2>
            <div class="envelope--field envelope-link--row">
            <div class="envelope-link--content">
                <div class="envelope--input--warning"><p>{{ $t("share.reminder") }}</p></div>

                <div class="input-group envelope-link--field">
                    <input type="text" class="print-hide" v-model="shareLink" readonly>
                    <pre class="print-only">{{shareLink}}</pre>
                    <div class="input-addon">
                        <button class="btn btn-env" v-clipboard:copy="shareLink" v-clipboard:success="onCopy">{{copyBtnMsg}}</button>
                    </div>
                </div>
            </div>
            <div class="envelope-link--qrcode">
                <canvas ref="qr"></canvas>
            </div>
            </div>
        </div>

        <V-share :shareUrl="shareLink" :shareSites="sites"></V-share>
    </div>
</template>


<script>
import QRCode from 'qrcode'
import share from 'vue-shares'

export default {
    name: 'ShareCard',
    components: {
        'V-share': share
    },
    props: {
        shareLink: String,
    },
    data() {
        return {
            copyBtnMsg: this.$t("share.copy_btn_text"),
            sites: ["qq", "weibo", "wechat", "facebook", "twitter", "google"]
        }
    },
    mounted() {
        this.changeQrCodeImage()
    },
    methods: {
        changeQrCodeImage() {
            let canvas = this.$refs.qr
            QRCode.toCanvas(canvas, this.shareLink, {width: 140}, function (error) {
                // pass
            })
        },
        onCopy() {
            this.copyBtnMsg = this.$t("share.copied_btn_text")
            setTimeout(() => { this.copyBtnMsg = this.$t("share.copy_btn_text") }, 2000)
        }
    }
}
</script>
