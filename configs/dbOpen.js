import * as SQLite from "expo-sqlite"

const db = SQLite.openDatabase('mhikeapp.db');

export {db}