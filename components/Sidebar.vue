<template lang="pug">
    aside.arrow-bar(:class="{'right-arrow': side==='right'}")
        div.button-wrapper
            button.arrow-button(@click="slide")
                img.arrow(v-if="side==='right'", src="~/assets/svg/rightArrow.svg")
                img.arrow(v-else, src="~/assets/svg/leftArrow.svg")
</template>

<script>
export default {
  props: {
    side: [String]
  },
  methods: {
    slide() {
      if (this.side === "right") {
        this.$emit("slideRight");
      } else {
        this.$emit("slideLeft");
      }
    }
  }
};
</script>
<style scoped>
.arrow {
  width: 10vw;
  height: 10vh;
  color: aliceblue;
  opacity: 0.7;
}
.arrow-bar {
  position: absolute;
  z-index: 2;
  width: 5%;
}
.right-arrow {
  margin-left: 95%;
}
.arrow-button {
  border: 0;
  outline: none;
  margin-top: 40vh;
  background-color: rgba(255, 255, 255, 0);
  padding: 0;
}
</style>

