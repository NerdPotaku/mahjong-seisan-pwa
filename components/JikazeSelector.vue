<template lang="pug">
        div.select
            select.select.select-param(@change="updataKaze", :value="computedKaze")
                option.text(v-for="option in options", :value="option.value", :disabled="option.value === 0") {{option.text}}
</template>

<script>
export default {
  props: {
    player: [String],
    kaze: [Number]
  },
  data() {
    return {
      value: -1,
      options: [
        {
          text: "東",
          value: 1
        },
        {
          text: "南",
          value: 2
        },
        {
          text: "西",
          value: 3
        },
        {
          text: "北",
          value: 4
        }
      ]
    };
  },
  methods: {
    updataKaze(e) {
      this.computedKaze = e.target.selectedIndex + (this.options.length === 4);
      this.$emit(
        "updataKaze",
        e.target.selectedIndex + (this.options.length === 4),
        this.getPlayer
      );
    },
    resetValue() {
      this.computedKaze = 0;
    }
  },
  computed: {
    getPlayer() {
      return this.player;
    },
    computedKaze: {
      set(newVal) {
        this.value = newVal;
      },
      get() {
        return this.value;
      }
    }
  },
  watch: {
    kaze: {
      handler(newVal) {
        this.computedKaze = newVal;
      }
    }
  },
  created() {
    const userAgent = navigator.userAgent.toLowerCase();
    if (
      userAgent.indexOf("chrome") === -1 &&
      userAgent.indexOf("safari") > -1
    ) {
      this.options = [
        {
          text: "",
          value: 0
        },
        {
          text: "東",
          value: 1
        },
        {
          text: "南",
          value: 2
        },
        {
          text: "西",
          value: 3
        },
        {
          text: "北",
          value: 4
        }
      ];
    }
    this.computedKaze = this.kaze;
  }
};
</script>

<style scoped>
@font-face {
  font-family: "Kaiso-Next";
  src: url("~assets/fonts/Kaiso-Next-B.otf") format("opentype");
}
.select {
  width: 100%;
  height: 100%;
  border: 0;
  display: flex;
  align-items: center;
}
.select-param {
  background-color: black;
  color: aliceblue;
  font-size: 4vw;
  font-family: "Kaiso-Next";
}
.select select:not([multiple]) {
  padding-right: 0.5vw;
  padding-left: 0.5vw;
}
::after {
  right: 1vw !important;
}
</style>
