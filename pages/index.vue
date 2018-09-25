<template lang="pug">
  section.index-page
    transition
      ConfigPopup(v-show="isConfigOpened", @closePopup="turnConfigFlag")
    transition
      div.cover-screen(v-show="isConfigOpened", @click="turnConfigFlag")
    div.dialog.modal(:class="{'is-active': isIOSModalOpen}")
      div.modal-background
      div.modal-card.animation-content
        section.modal-card-body.is-titleless 端末を横向きにしてください。
        footer.modal-card-foot
          button.button(@click="onIOSModalButton") OK
    Header(@resetKaze="resetKaze",@showConfig="turnConfigFlag", :isConfigOpened="isConfigOpened")
    Table(v-if="isCreatedAfter", ref="table")
</template>

<script>
import Table from "~/components/Table.vue";
import Header from "~/components/Header.vue";
import ConfigPopup from "~/components/ConfigPopup.vue";

export default {
  data() {
    return {
      isConfigOpened: false,
      isCreatedAfter: false,
      isIOSModalOpen: false
    };
  },
  components: {
    Table,
    Header,
    ConfigPopup
  },
  methods: {
    turnConfigFlag() {
      this.isConfigOpened = !this.isConfigOpened;
    },
    resetKaze() {
      this.$refs.table.reset();
    },
    onIOSModalButton() {
      this.isIOSModalOpen = false;
    }
  },
  created() {
    this.isIOSModalOpen = /iP(hone|(o|a)d)/.test(navigator.userAgent);
    if (
      window.location.search &&
      window.location.search.indexOf("gameId") > -1
    ) {
      const params = window.location.search.split("?")[1].split("&");
      const obj = {};
      for (let param of params) {
        let variable = param.split("=");
        if (variable[0] === "gameId") {
          window.localStorage.removeItem("mahjong-store");
          this.$store.dispatch("setGameId", variable[1]);
          this.$store.dispatch("changeSharedMode");
          this.$store.dispatch("setFireStoreItem").then(() => {
            this.isCreatedAfter = true;
          });
          return;
        }
      }
    } else if (window.localStorage.getItem("mahjong-store")) {
      const localStorageItem = JSON.parse(
        window.localStorage.getItem("mahjong-store")
      );
      this.$store.dispatch("setlocalStorageItem", localStorageItem);
    }
    this.isCreatedAfter = true;
  }
};
</script>

<style scoped>
.index-page {
  width: 100%;
  overflow-x: hidden;
}
.cover-screen {
  height: 100%;
  width: 100%;
  background-color: black;
  z-index: 3;
  position: fixed;
  opacity: 0.7;
}
.v-enter-active,
.v-leave-active {
  transition: 0.3s;
}
.v-enter,
.v-leave-to {
  opacity: 0;
}
</style>
