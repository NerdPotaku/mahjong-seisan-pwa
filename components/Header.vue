<template lang="pug">
    nav.header
      div.title 麻雀精算表
      div
        button.header-button.button.is-dark(@click="openResetDialog")
          span.button-text リセット
      b-dropdown
        button.header-button.button.is-primary(slot="trigger")
          span.button-text 共有
        b-dropdown-item(:href="'https://twitter.com/intent/tweet?url=' + getShareUrl", target="_blank") Twitter
        b-dropdown-item(:href="'https://social-plugins.line.me/lineit/share?url=' + getShareUrl", target="_blank") Line
        b-dropdown-item(@click="copyShareUrl") URLをコピー
      div.config-button-box
        button.config-button(@click="openConfig")
            img.gear(src="~/assets/svg/gear.svg", :class="{'is-config-opened': isConfigOpened}")

</template>

<script>
export default {
  data() {
    return {
      currentUrl: document.location.search
        ? location.href.replace(document.location.search, "")
        : location.href
    };
  },
  props: {
    isConfigOpened: [Boolean]
  },
  methods: {
    openConfig() {
      this.$emit("showConfig");
    },
    openResetDialog() {
      this.$dialog.confirm({
        title: "Reset Results",
        message: "今回の対局の結果をリセットします",
        confirmText: "Reset",
        type: "is-danger",
        hasIcon: true,
        onConfirm: () => this.reset()
      });
    },
    reset() {
      this.$emit("resetKaze");
      this.$store.dispatch("resetStore");
      window.localStorage.removeItem("mahjong-store");
    },
    copyShareUrl() {
      if (navigator.clipboard) {
        navigator.clipboard
          .writeText(this.getShareUrl)
          .then(() => {
            this.$dialog.alert("URLをクリップボードにコピーしました");
          })
          .catch(() => {
            this.$dialog.alert({
              title: "Error",
              message: "URLのコピーに失敗しました",
              type: "is-danger",
              hasIcon: true,
              icon: "times-circle",
              iconPack: "fa"
            });
          });
      } else {
        const textarea = document.createElement("textarea");
        textarea.textContent = this.getShareUrl;
        const bodyElm = document.getElementsByTagName("body")[0];
        // 子要素にテキストエリアを配置
        bodyElm.appendChild(textarea);

        // テキストエリアの値を選択
        textarea.select();
        // コピーコマンド発行
        const copy = document.execCommand("copy");
        // 追加テキストエリアを削除
        bodyElm.removeChild(textarea);

        if (copy) {
          this.$dialog.alert("URLをクリップボードにコピーしました");
        } else {
          this.$dialog.alert({
            title: "Error",
            message: "URLのコピーに失敗しました",
            type: "is-danger",
            hasIcon: true,
            icon: "times-circle",
            iconPack: "fa"
          });
        }
      }
    }
  },
  computed: {
    getShareUrl() {
      let urlParams = "";
      if (this.$store.getters.getGameId) {
        urlParams += urlParams
          ? "&gameId=" + this.$store.getters.getGameId
          : "?gameId=" + this.$store.getters.getGameId;
      }
      return this.currentUrl + urlParams;
    }
  }
};
</script>

<style scoped>
@font-face {
  font-family: "Kaiso-Next";
  src: url("~assets/fonts/Kaiso-Next-B.otf") format("opentype");
}
.button-text {
  font-size: 1.8vw;
  font-family: "Noto Sans JP";
  line-height: 1vh;
}
.header-button {
  margin-top: 1.3vh;
  height: 6vh;
  padding: 1vh 2vw;
  margin-right: 1vw;
}
.header {
  background-color: black;
  height: 9vh;
  width: 100%;
  display: flex;
  z-index: 10;
}
.title {
  font-size: 8vh;
  font-family: "Kaiso-Next";
  color: #00bfff;
  width: 95%;
  margin: 0;
}
.config-button-box {
  z-index: 5;
}
.config-button {
  background-color: black;
  border: 0;
  outline: none;
  height: 100%;
}
.gear {
  width: 3vw;
  height: 3vh;
}
.is-config-opened {
  animation: rotate-anime 5s linear infinite;
}
@keyframes rotate-anime {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
