import firebase from 'firebase'
import 'firebase/firestore'
const config = {
  apiKey: process.env.APIKEY,
  authDomain: process.env.AUTHDOMAIN,
  databaseURL: process.env.DATABASEURL,
  projectId: process.env.PROJECTID,
  storageBucket: process.env.STORAGEBUCKET,
  messagingSenderId: process.env.MESSAGINGSENDERID
}
const firebaseApp = firebase.initializeApp(config, 'exercise-vue')
const settings = {
  timestampsInSnapshots: true
}
const firestore = firebaseApp.firestore()

// firestore.settings(settings)

export default (!firebase.apps.length ? firebase.app() : firestore)
