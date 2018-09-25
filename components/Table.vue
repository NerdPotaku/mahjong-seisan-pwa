<template lang="pug">
  v-touch(@swipeleft="slideRight" @swiperight="slideLeft"  :swipe-options="{direction: 'horizontal'}")
    Sidebar(@slideLeft="slideLeft", side="left")
    Sidebar(@slideRight="slideRight", side="right")
    div.sheets
      table(
        border="1",
        cellspacing="0",
        v-for="n in getTotalSheetsNo",
        :class="{'sheet-left': n < getShowSheetsNo, 'slide-next': n < getShowSheetsNo && style === 'slideNext', 'sheet-slide-right':n === getShowSheetsNo && style === 'slidePrev'}"
      )
        tr.table-header
          th.text ゲーム数
          th(v-for="n in 4", colspan="3") 
            input.text(type="text", :placeholder="'Player' + n", :value="playersName[n-1]", @change="changePlayersName(n-1, $event)")
        List(v-for="i in 4", :game-count="i + 4 * (n - 1)", ref="list", :key="i")
        tr
          td
          td.total-cells(v-for="n in 4", colspan="3") {{getTotalPoints[(n - 1)]}}
</template>

<script>
import List from "~/components/List.vue";
import Sidebar from "~/components/Sidebar.vue";
export default {
  data() {
    return {
      playersName: ["", "", "", ""],
      style: ""
    };
  },
  components: {
    List,
    Sidebar
  },
  methods: {
    reset() {
      this.style = "";
      for (let list of this.$refs.list) {
        list.resetKaze();
      }
      this.playersName = ["", "", "", ""];
    },
    changePlayersName(index, e) {
      this.playersName[index] = e.target.value;
      for (let name of this.playersName) {
        if (!name) {
          return;
        }
      }
      this.$store.dispatch("changePlayersName", this.playersName);
    },
    slideLeft() {
      if (this.getShowSheetsNo > 1) {
        this.$store.dispatch("changeShowSheets", -1);
        this.style = "slidePrev";
      }
    },
    slideRight() {
      if (this.getShowSheetsNo === this.getTotalSheetsNo) {
        this.$store.dispatch("addSheets");
      }
      this.$store.dispatch("changeShowSheets", 1);
      this.style = "slideNext";
    }
  },
  computed: {
    getTotalSheetsNo() {
      return this.$store.getters.getTotalSheetsCount;
    },
    getShowSheetsNo() {
      return this.$store.getters.getShowSheetsNo;
    },
    getTotalPoints() {
      return this.$store.getters.getTotalPoints;
    }
  },
  created() {
    this.playersName = Object.assign([], this.$store.getters.getPlayersName);
  }
};
</script>

<style scoped>
@font-face {
  font-family: "nicomoji";
  src: url("~assets/fonts/nicomoji-plus_1.11.ttf") format("truetype");
}
.sheets {
  display: box;
  display: -webkit-box;
}
table {
  border-color: #00bfff;
  color: aliceblue;
  background-color: black;
  table-layout: fixed;
  width: 100%;
}
.table-header {
  height: 5vh;
}
.table-header th {
  vertical-align: middle;
}
.table-header th input {
  font-family: "nicomoji";
  color: aliceblue;
  outline: none;
  border: none;
  background-color: black;
  font-size: 2vw;
  width: 100%;
}
.total-cells {
  height: 9.9vh;
  vertical-align: middle;
  text-align: center;
  font-size: 3.2vw;
}
th.text {
  color: aliceblue;
  vertical-align: middle;
  font-size: 1.4vw;
  font-family: "Noto Sans JP";
}
.sheet-slide-right {
  animation: slideRight 0.5s linear;
}
@keyframes slideRight {
  0% {
    margin-left: -100%;
  }
  100% {
    margin-left: 0;
  }
}
.sheet-left {
  margin-left: -100%;
}
.slide-next {
  animation: slideLeft 0.5s linear;
}
@keyframes slideLeft {
  0% {
    margin-left: 0;
  }
  100% {
    margin-left: -100%;
  }
}
</style>

