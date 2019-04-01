<template>
    <div class="container-fluid envelope-container envelope-container--link">
        <div class="container-fluid envelope-link">
            <h2>Send this link to your recipients</h2>
            <div class="envelope--field envelope-link--row">
            <div class="envelope-link--content">
                <div class="envelope--input--warning"><p>Do not lose it! Once lost this link cannot be recovered.</p></div>

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
    </div>
</template>


<script>
import QRCode from 'qrcode'

export default {
    name: 'ShareCard',
    props: {
        shareLink: String,
    },
    data() {
        return {
            copyBtnMsg: 'Copy',
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
            this.copyBtnMsg = 'Copied'
            setTimeout(() => { this.copyBtnMsg = 'Copy' }, 2000)
        }
    }
}
</script>
