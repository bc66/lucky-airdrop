<template>
  <div class="container-fluid">
    <div class="container-fluid envelope-wrap">
      <div class="envelope-wrap--title">
        <h2>You received Ether.</h2>
        <p>Click CLAIM to see how much you received.</p>
      </div>
      <div
        class="container-fluid envelope-container envelope-container--claim envelope--verified envelope-container--red envelope-container--with-card"
      >
        <div class="container-fluid envelope-info">
          <div class="row envelope-info--top">
            <div class="col-xs-5 left-align">
              <p>Envelope #54</p>
            </div>
            <div class="col-xs-7 right-align">
              <p>
                <span>Expires
                  <time datetime="2019-03-07T15:19:30.000Z" title="2019-03-07 15:19">in 7 days</time>
                </span>
              </p>
            </div>
          </div>
          <div>
            <svg
              class="svg--icon-dog"
              version="1.1"
              x="0px"
              y="0px"
              viewBox="0 0 100 100"
              xml:space="preserve"
            >
              <circle cx="46.2" cy="35" r="3.7"></circle>
              <path
                d="M63.7,31.3c-3.1-8.7-11.4-15-21.2-15l-7.5,0c-6.1,0-11.3,3.6-13.7,8.8c-5.2,2.4-8.8,7.6-8.8,13.7v30H20v15h37.5V61.2l7.5,0  c12.4,0,22.5-10.1,22.5-22.5v-7.5H63.7z M65,53.7h-7.5c-4.1,0-7.5,3.4-7.5,7.5v15H27.5v-7.5c8.3,0,15-6.7,15-15v-7.5  c0-2.1-1.7-3.7-3.8-3.7S35,44.2,35,46.3v7.5c0,4.1-3.4,7.5-7.5,7.5l-7.5,0V38.8c0-4.1,3.4-7.5,7.5-7.5c0-4.1,3.4-7.5,7.5-7.5h7.5  c8.3,0,15,6.7,15,15H65h15C80,47,73.3,53.7,65,53.7z"
              ></path>
            </svg>
          </div>
          <div class="envelope-info--message">
            <h2>111</h2>
            <p>– Anonymous</p>
          </div>
        </div>

        <div class="envelope--buttons">
          <div class="envelope--input--disclaimer">
            <p>
              <span>You understand that you are using free software, provided under
                <a
                  href="https://github.com/OhJia/LuckyEnv-contract/blob/temp-create-nw/license.txt"
                  target="_blank"
                >MIT License</a>, at your own risk.
              </span>
            </p>
          </div>
          <p>
            <button class="btn btn-env">Claim</button>
          </p>
          <p>1 claim is permitted every 6 minutes.</p>
        </div>

      </div>
    </div>

    <ClaimedInfo/>
  </div>
</template>


<script>
import ClaimedInfo from "@/components/ClaimedInfo.vue";

export default {
  name: "ClaimPacket",
  components: {
    ClaimedInfo
  },
  props: {
    visitor: String
  }
};
</script>
