<template lang="pug">
    div.popup
      div.contents
        section
          p.text ウマ
          div.radio(v-for="uma of this.uma")
              input(type="radio", name="uma", :value="uma.value", :id="uma.value", :checked="uma.default", @change="changeUma")
              label.radio-label(:for="uma.value") {{uma.label}}
        section
          p.text 開始持ち点
          div.radio(v-for="startTenbou of this.startTenbou")
              input(type="radio", name="startTenbou", :value="startTenbou.value", :id="startTenbou.value", :checked="startTenbou.default")
              label.radio-label(:for="startTenbou.value") {{startTenbou.label}}
        section
          p.text 人数
          div.radio(v-for="num of NumOfPerson")
              input(type="radio", name="numOfPerson", :value="num.value", :id="num.value", :checked="num.default")
              label.radio-label(:for="num.value") {{num.label}}
        div.close-button
          button.close(@click="closePopup") 閉じる
</template>

<script>
export default {
  data() {
    return {
      startTenbou: [{ value: 25000, label: "25000点", default: true }],
      NumOfPerson: [{ value: 4, label: "4人", default: true }]
    };
  },
  methods: {
    closePopup() {
      this.$emit("closePopup");
    },
    changeUma(evt) {
      this.$store.dispatch("changeUma", evt.target.value);
    }
  },
  computed: {
    uma() {
      return [
        {
          value: "5-10",
          label: "5-10",
          default: this.$store.getters.getUma === "5-10"
        },
        {
          value: "10-20",
          label: "10-20",
          default: this.$store.getters.getUma === "10-20"
        },
        {
          value: "20-30",
          label: "20-30",
          default: this.$store.getters.getUma === "20-30"
        },
        {
          value: "10-30",
          label: "10-30",
          default: this.$store.getters.getUma === "10-30"
        }
      ];
    }
  }
};
</script>

<style scoped>
.popup {
  width: 70vw;
  z-index: 5;
  position: absolute;
  background-color: black;
  left: 15vw;
  top: 20vh;
  border: #00bfff solid 0.1em;
}
section {
  padding: 1vh;
}
input[type="radio"] {
  -webkit-transform: scale(1.2);
  transform: scale(1.2);
}
.radio-label {
  padding: 0 1vw;
  font-size: 2vw;
  vertical-align: middle;
  color: aliceblue;
}

.contents {
  margin: 2vh;
}
.text {
  color: aliceblue;
  font-size: 3vw;
}
.radio {
  display: inline;
  padding: 0.2vw;
}
.close-button {
  text-align: center;
}
.close {
  background-color: black;
  color: aliceblue;
  outline: 0;
  border-color: #00bfff;
  font-size: 2.5vw;
}
</style>
