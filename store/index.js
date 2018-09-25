import Vuex from 'vuex';
import db from '~/plugins/firebaseInit'

const gameRef = db.collection('games')

const store = () => new Vuex.Store({
  state: {
    gameResults: [],
    totalPoints: [0, 0, 0, 0],
    uma: '5-10',
    totalSheetsCount: 1,
    showSheetsNo: 1,
    gameId: '',
    isSharedMode: false,
    playersName: ['', '', '', '']
  },
  getters: {
    getGameResults(state) {
      return state.gameResults;
    },
    getTotalPoints(state) {
      return state.totalPoints;
    },
    getUma(state) {
      return state.uma;
    },
    getTotalSheetsCount(state) {
      return state.totalSheetsCount
    },
    getShowSheetsNo(state) {
      return state.showSheetsNo
    },
    getGameId(state) {
      return state.gameId
    },
    getIsSharedMode(state) {
      return state.isSharedMode
    },
    getPlayersName(state) {
      return state.playersName
    }
  },
  mutations: {
    setTotalPoints(state, totalPoints) {
      state.totalPoints.splice(0, 4, ...totalPoints);
    },
    setGameResults(state, gameResults) {
      state.gameResults.splice(0, gameResults.length, ...gameResults)
    },
    setGameId(state, gameId) {
      state.gameId = gameId
    },
    setUma(state, uma) {
      state.uma = uma
    },
    changeShowSheetsNo(state, i) {
      state.showSheetsNo += i
    },
    addTotalSheetsCount(state) {
      state.totalSheetsCount++
    },
    resetStore(state) {
      if (state.isSharedMode) {
        state.isSharedMode = false
      } else if (state.gameId) {
        gameRef.doc(state.gameId).delete().catch((e) => {
          console.error(e)
        })
      }
      state.gameResults.splice(0, state.gameResults.length)
      state.totalPoints.splice(0, 4, ...[0, 0, 0, 0])
      state.uma = '5-10'
      state.totalSheetsCount = 1
      state.showSheetsNo = 1
      state.gameId = ''
      state.playersName.splice(0, 4, ...['', '', '', ''])
    },
    changeSharedMode(state) {
      state.isSharedMode = true
    },
    changePlayersName(state, playersName) {
      state.playersName.splice(0, 4, ...playersName)
    },
    setStore(state, obj) {
      if (obj.gameResults) {
        state.gameResults.splice(0, obj.gameResults.length, ...obj.gameResults)
      }
      if (obj.totalPoints) {
        state.totalPoints.splice(0, obj.totalPoints.length, ...obj.totalPoints)
      }
      state.uma = obj.uma || '5-10'
      state.totalSheetsCount = obj.totalSheetsCount || 1
      state.showSheetsNo = obj.showSheetsNo || 1
      if (obj.playersName) {
        state.playersName.splice(0, obj.playersName.length, ...obj.playersName)
      }
      state.gameId = obj.gameId || ''
    }
  },
  actions: {
    async addGameResults(context, {
      gameCount,
      players
    }) {
      if (!context.getters.isSharedMode) {
        let gameResults = context.getters.getGameResults;
        if (gameResults[gameCount - 1]) {
          gameResults.splice(gameCount - 1, 1, players)
        } else {
          gameResults.push(players)
        }
        const gameResultsForFirestore = {}
        for (let i = 0; i < gameResults.length; i++) {
          gameResultsForFirestore[i] = gameResults[i]
        }
        if (context.getters.getGameId) {
          await gameRef.doc(context.getters.getGameId).update({
            'gameResults': gameResultsForFirestore,
            'uma': context.getters.getUma,
            'totalSheetsCount': context.getters.getTotalSheetsCount,
            'showSheetsNo': context.getters.getShowSheetsNo
          }).then(() => {
            context.commit('setGameResults', gameResults)
          }).catch((e) => {
            console.error('setGameResults error: ' + e);
          })
        } else {
          await gameRef.add({
            'gameResults': gameResultsForFirestore,
            'uma': context.getters.getUma,
            'totalSheetsCount': context.getters.getTotalSheetsCount,
            'showSheetsNo': context.getters.getShowSheetsNo
          }).then((doc) => {
            context.commit('setGameId', doc.id)
            context.commit('setGameResults', gameResults)
          }).catch((e) => {
            console.error('setGameResults error: ' + e);
          })
        }
      }
    },
    async setTotalPoints(context) {
      if (!context.getters.isSharedMode && context.getters.getGameId) {
        let totalPoints = [0, 0, 0, 0]
        const results = context.getters.getGameResults
        for (let result of results) {
          for (let i = 0; i < result.length; i++) {
            totalPoints[i] += result[i].points
          }
        }
        await gameRef.doc(context.getters.getGameId).update({
          totalPoints
        }).then(() => {
          context.commit('setTotalPoints', totalPoints)
        }).catch((e) => {
          console.error('setGameResults error: ' + e);
        })
      }
    },
    async changeUma(context, uma) {
      if (!context.getters.isSharedMode) {
        if (context.getters.getGameId) {
          await gameRef.doc(context.getters.getGameId).update({
            'uma': uma
          }).then(() => {
            context.commit('setUma', uma)
          }).catch((e) => {
            console.error('setUma error: ' + e);
          })
        } else {
          await gameRef.add({
            'uma': uma
          }).then((doc) => {
            context.commit('setGameId', doc.id)
            context.commit('setUma', uma)
          }).catch((e) => {
            console.error('setUma error: ' + e);
          })
        }
      }
    },
    setGameId(context, gameId) {
      context.commit('setGameId', gameId)
    },
    changeShowSheets(context, i) {
      if (context.getters.getTotalSheetsCount >= (context.getters.getShowSheetsNo + i)) {
        context.commit('changeShowSheetsNo', i)
      }
    },
    addSheets(context) {
      if (!context.getters.isSharedMode) {
        context.commit('addTotalSheetsCount')
      }
    },
    resetStore(context) {
      context.commit('resetStore')
    },
    setlocalStorageItem(context, obj) {
      context.commit('setStore', obj)
    },
    changeSharedMode(context) {
      context.commit('changeSharedMode')
    },
    async changePlayersName(context, playersName) {
      if (!context.getters.isSharedMode) {
        if (context.getters.getGameId) {
          await gameRef.doc(context.getters.getGameId).update({
            'playersName': playersName
          }).then(() => {
            context.commit('changePlayersName', playersName)
          }).catch((e) => {
            console.error('changePlayersName error: ' + e);
          })
        } else {
          await gameRef.add({
            'playersName': playersName
          }).then((doc) => {
            context.commit('setGameId', doc.id)
            context.commit('changePlayersName', playersName)
          }).catch((e) => {
            console.error('changePlayersName error: ' + e);
          })
        }
      }
    },
    async setFireStoreItem(context) {
      await gameRef.doc(context.getters.getGameId).get().then((doc) => {
        if (doc.exists) {
          const obj = doc.data()
          // Object=>Array変換
          if (obj.gameResults) {
            obj.gameResults = Object.keys(obj.gameResults).map((key) => {
              return obj.gameResults[key]
            })
          }
          context.commit('setStore', obj)
        } else {
          console.log('doc.data() will be undefined in this case')
        }
      }).catch((e) => {
        console.error('setFireStoreItem error: ' + e);
      })
    }
  }
})
export default store
