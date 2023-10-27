import { openDatabase } from "expo-sqlite"

const db = openDatabase('mhikedata.db', '1.0', '', 100000);

export {db}