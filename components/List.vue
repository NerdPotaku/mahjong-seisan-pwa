<template lang="pug">
    tr.table-list
        td.cell
          p.text {{getGameCount}}
        td.cell
          JikazeSelector(@updataKaze="setKaze", player="0", :kaze="players[0].kaze", ref="jikaze1")
        td.cell
          input.tenbou-cell(
            :class="{'tenbou-cell-over-one-hundred-thousand': players[0].tenbou >= 100000 || players[0].tenbou <= -10000}",
            :value="players[0].tenbou",
            type="number",
            min="-200000",
            max="150000",
            @change="changeTenbou(0, $event)"
          )
        td.cell.points-cell
          p.text {{players[0].points}}
        td.cell
          JikazeSelector(@updataKaze="setKaze", player="1", :kaze="players[1].kaze", ref="jikaze2")
        td.cell
          input.tenbou-cell(
            :class="{'tenbou-cell-over-one-hundred-thousand': players[1].tenbou >= 100000 || players[1].tenbou <= -10000}",
            :value="players[1].tenbou",
            type="number",
            min="-200000",
            max="150000",
            @change="changeTenbou(1, $event)"
          )
        td.cell.points-cell
          p.text {{players[1].points}}
        td.cell
          JikazeSelector(@updataKaze="setKaze", player="2", :kaze="players[2].kaze", ref="jikaze3")
        td.cell
          input.tenbou-cell(
            :class="{'tenbou-cell-over-one-hundred-thousand': players[2].tenbou >= 100000 || players[2].tenbou <= -10000}",
            :value="players[2].tenbou",
            type="number",
            min="-150000",
            max="150000",
            @change="changeTenbou(2, $event)"
          )
        td.cell.points-cell
          p.text {{players[2].points}}
        td.cell 
          JikazeSelector(@updataKaze="setKaze", player="3", :kaze="players[3].kaze", ref="jikaze4")
        td.cell
          input.tenbou-cell(
            :class="{'tenbou-cell-over-one-hundred-thousand': players[3].tenbou >= 100000 || players[3].tenbou <= -10000}",
            :value="players[3].tenbou",
            type="number",
            min="-150000",
            max="150000",
            @change="changeTenbou(3, $event)"
          )
        td.cell.points-cell
          p.text {{players[3].points}}
</template>

<script>
import JikazeSelector from "~/components/JikazeSelector.vue";
export default {
  props: {
    gameCount: [Number]
  },
  components: {
    JikazeSelector
  },
  data() {
    return {
      playersArr: [
        {
          tenbou: 0,
          points: "",
          rank: 0,
          kaze: 0 // 1: 東 2: 南 3: 西 4: 北
        },
        {
          tenbou: 0,
          points: "",
          rank: 0,
          kaze: 0
        },
        {
          tenbou: 0,
          points: "",
          rank: 0,
          kaze: 0
        },
        {
          tenbou: 0,
          points: "",
          rank: 0,
          kaze: 0
        }
      ]
    };
  },
  methods: {
    resetKaze() {
      this.$refs.jikaze1.resetValue();
      this.$refs.jikaze2.resetValue();
      this.$refs.jikaze3.resetValue();
      this.$refs.jikaze4.resetValue();
    },
    changeTenbou(playerIndex, e) {
      this.players[playerIndex].tenbou = e.target.valueAsNumber;
      this.checkInputAll();
    },
    setKaze(number, index) {
      // 東:1 南:2 西:3 北：4
      this.players[index].kaze = number;
      this.checkInputAll();
    },
    setRank() {
      const arr = [
        this.players[0].tenbou,
        this.players[1].tenbou,
        this.players[2].tenbou,
        this.players[3].tenbou
      ];
      const topPlayerIndex = arr.indexOf(Math.max(...arr));
      const lastPlayerIndex = arr.indexOf(Math.min(...arr));
      if (topPlayerIndex === lastPlayerIndex) {
        // 全員同点の場合
        this.players.forEach((player, index) => {
          this.players[index].rank = player.kaze;
        });
      } else if (arr.length !== new Set(arr).size) {
        // 1人以上同点がいる場合
        let topPlayers = [
          {
            index: topPlayerIndex,
            kaze: this.players[topPlayerIndex].kaze
          }
        ];
        let lastPlayers = [
          {
            index: lastPlayerIndex,
            kaze: this.players[lastPlayerIndex].kaze
          }
        ];
        let otherPlayers = [];
        this.players.forEach((player, index) => {
          if (index !== topPlayerIndex && index !== lastPlayerIndex) {
            if (player.tenbou === this.players[topPlayerIndex].tenbou) {
              topPlayers.push({ index, kaze: player.kaze });
            } else if (player.tenbou === this.players[lastPlayerIndex].tenbou) {
              lastPlayers.push({ index, kaze: player.kaze });
            } else {
              otherPlayers.push({ index, kaze: player.kaze });
            }
          }
        });
        if (otherPlayers.length === 2) {
          // トップとラス以外が同点の場合
          this.players[topPlayerIndex].rank = 1;
          this.players[lastPlayerIndex].rank = 4;
          if (otherPlayers[0].kaze < otherPlayers[1].kaze) {
            this.players[otherPlayers[0].index].rank = 2;
            this.players[otherPlayers[1].index].rank = 3;
          } else {
            this.players[otherPlayers[0].index].rank = 3;
            this.players[otherPlayers[1].index].rank = 2;
          }
        } else if (otherPlayers.length === 1) {
          if (topPlayers.length === 2) {
            // トップのプレイヤーが2人の場合
            this.players[otherPlayers[0].index].rank = 3;
            this.players[lastPlayerIndex].rank = 4;
            if (topPlayers[0].kaze < topPlayers[1].kaze) {
              this.players[topPlayers[0].index].rank = 1;
              this.players[topPlayers[1].index].rank = 2;
            } else {
              this.players[topPlayers[0].index].rank = 2;
              this.players[topPlayers[1].index].rank = 1;
            }
          } else {
            // ラスのプレイヤーが2人の場合
            this.players[topPlayerIndex].rank = 1;
            this.players[otherPlayers[0].index].rank = 2;
            if (lastPlayers[0].kaze < lastPlayers[1].kaze) {
              this.players[lastPlayers[0].index].rank = 3;
              this.players[lastPlayers[1].index].rank = 4;
            } else {
              this.players[lastPlayers[0].index].rank = 4;
              this.players[lastPlayers[1].index].rank = 3;
            }
          }
        } else {
          if (topPlayers.length === 3) {
            // トップのプレイヤーが3人の場合
            this.players[lastPlayerIndex].rank = 4;
            const array = [
              topPlayers[0].kaze,
              topPlayers[1].kaze,
              topPlayers[2].kaze
            ];
            topPlayers.forEach(player => {
              if (player.kaze === Math.max(...array)) {
                this.players[player.index].rank = 3;
              } else if (player.kaze === Math.min(...array)) {
                this.players[player.index].rank = 1;
              } else {
                this.players[player.index].rank = 2;
              }
            });
          } else if (lastPlayers.length === 3) {
            // ラスのプレイヤーが3人の場合
            this.players[topPlayerIndex].rank = 1;
            const array = [
              lastPlayers[0].kaze,
              lastPlayers[1].kaze,
              lastPlayers[2].kaze
            ];
            lastPlayers.forEach(player => {
              if (player.kaze === Math.max(...array)) {
                this.players[player.index].rank = 4;
              } else if (player.kaze === Math.min(...array)) {
                this.players[player.index].rank = 2;
              } else {
                this.players[player.index].rank = 3;
              }
            });
          } else {
            // トップ、ラスのプレイヤーがそれぞれ2人ずつの場合
            if (topPlayers[0].kaze < topPlayers[1].kaze) {
              this.players[topPlayers[0].index].rank = 1;
              this.players[topPlayers[1].index].rank = 2;
            } else {
              this.players[topPlayers[0].index].rank = 2;
              this.players[topPlayers[1].index].rank = 1;
            }
            if (lastPlayers[0].kaze < lastPlayers[1].kaze) {
              this.players[lastPlayers[0].index].rank = 3;
              this.players[lastPlayers[1].index].rank = 4;
            } else {
              this.players[lastPlayers[0].index].rank = 4;
              this.players[lastPlayers[1].index].rank = 3;
            }
          }
        }
      } else {
        // 同点がいない場合
        this.players[topPlayerIndex].rank = 1;
        this.players[lastPlayerIndex].rank = 4;
        let array = [];
        this.players.forEach((player, index) => {
          if (index !== topPlayerIndex && index !== lastPlayerIndex) {
            array.push(index);
          }
        });
        if (this.players[array[0]].tenbou > this.players[array[1]].tenbou) {
          this.players[array[0]].rank = 2;
          this.players[array[1]].rank = 3;
        } else {
          this.players[array[0]].rank = 3;
          this.players[array[1]].rank = 2;
        }
      }
      this.calculatePoints();
    },
    async calculatePoints() {
      let tenbou = 0;
      let points = 0;
      const arr = this.getUma.split("-");
      const uma = [Number(arr[0]), Number(arr[1])];
      this.players.forEach((player, index) => {
        // 30000点返し処理
        tenbou = player.tenbou - 30000;
        // 百の位の切り捨て処理
        points = tenbou / 1000;
        points = Math.floor(points);
        switch (player.rank) {
          case 1:
            points = points + 20 + uma[1];
            break;
          case 2:
            points = points + uma[0];
            break;
          case 3:
            points = points - uma[0];
            break;
          case 4:
            points = points - uma[1];
            break;
        }
        this.players[index].points = points;
      });
      await this.$store.dispatch("addGameResults", {
        gameCount: this.getGameCount,
        players: this.players
      });
      await this.$store.dispatch("setTotalPoints");
    },
    checkInputAll() {
      let total = 0;
      let kazeChecker = [0, 0, 0, 0];
      for (let player of this.players) {
        if (!player.kaze || !/^\-?\d+/.test(player.tenbou)) {
          // kazeの設定がない、または、点数の設定がないplayerがいる場合
          return;
        } else {
          total += player.tenbou;
          kazeChecker[player.kaze - 1] = 1;
        }
      }
      if (total !== 100000) {
        // 4player合計点棒が100000点じゃない場合
        return;
      } else if (
        !kazeChecker[0] ||
        !kazeChecker[1] ||
        !kazeChecker[2] ||
        !kazeChecker[3]
      ) {
        // kazeが重複している場合
        return;
      } else {
        this.setRank();
      }
    }
  },
  computed: {
    players() {
      const storePlayer =
        this.$store.getters.getGameResults[this.getGameCount - 1] || [];
      const players = Object.assign(
        [],
        JSON.parse(JSON.stringify(this.playersArr)),
        JSON.parse(JSON.stringify(storePlayer))
      );
      return players;
    },
    getGameCount() {
      return this.gameCount;
    },
    getUma() {
      return this.$store.getters.getUma;
    }
  },
  watch: {
    getUma: function() {
      this.checkInputAll();
    }
  }
};
</script>

<style scoped>
@font-face {
  font-family: "GAGAGAGA-FREE";
  src: url("~assets/fonts/GAGAGAGA-FREE.otf") format("opentype");
}
input {
  height: 100%;
  width: 100%;
  border: 0;
  text-align: center;
  color: aliceblue;
  background-color: black;
}
.cell {
  height: 19vh;
  width: 7.8%;
  text-align: center;
}
.tenbou-cell {
  font-family: "GAGAGAGA-FREE";
  font-size: 1.7vw;
}
.tenbou-cell-over-one-hundred-thousand {
  font-size: 1.4vw;
}
.points-cell {
  font-family: "GAGAGAGA-FREE";
  font-size: 1vw;
  padding: 0 0;
}
.text {
  font-size: 3vw;
  padding-top: 5vh;
}
</style>
