import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Button,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import React, { useState } from "react";
import { db } from "../../configs/dbOpen";

export default function Home({ navigation }) {
  const [dataH, setDataH] = useState({
    data: [],
    empty: false,
  });
  const [refr, setRefr] = useState(false);

  const empty = () => {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Image
          style={{ width: 350, height: 350 }}
          source={{
            uri: "https://i.pinimg.com/236x/ae/8a/c2/ae8ac2fa217d23aadcc913989fcc34a2.jpg",
          }}
        />
      </View>
    );
  };

  const fetchAllData = async () => {
    await db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM mhikedb",
        [],
        (tx, result) => {
          let itemArray = [];
          const len = result.rows.length;
          console.log(result);
          if (len > 0) {
            for (let i = 0; i < len; ++i) {
              itemArray.push(result.rows.item(i));
              setDataH({ ...dataH, data: itemArray, empty: false });
            }
          } else {
            setDataH({ ...dataH, empty: true });
          }
          return result;
        },
        (error) => {
          console.log(error);
        }
      );
    });
  };

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchAllData();
    });
    return unsubscribe;
  }, [navigation]);

  console.log(dataH);

  const refreshData = () => {
    setRefr(true, fetchAllData());
    setTimeout(() => {
      setRefr(false);
    }, 1200);
  };

  const uiItem = ({ item, index }) => (
    <View style={styles.wrapperItem}>
      <Text>{item.name}</Text>
      <View style={styles.wrapBtns}>
        <TouchableOpacity
          style={{
            backgroundColor: "#097969",
            padding: 8,
            borderRadius: 5,
            marginRight: 10,
          }}
        >
          <Text style={{ color: "#fff" }}>More</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: "#097969",
            padding: 8,
            borderRadius: 5,
          }}
        >
          <Text style={{ color: "#fff" }}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      {dataH.empty || dataH.data.length < 0 ? (
        empty()
      ) : (
        <FlatList
          data={dataH.data}
          keyExtractor={(i) => i.id.toString()}
          renderItem={uiItem}
          contentContainerStyle={{ marginTop: 40 }}
          refreshControl={
            <RefreshControl
              refreshing={refr}
              onRefresh={refreshData}
              tintColor="green"
            />
          }
          ListHeaderComponent={() => (
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                paddingRight: 9,
                paddingLeft: 11,
                marginBottom: 20,
              }}
            >
              <Text
                style={{
                  textTransform: "uppercase",
                  fontWeight: "bold",
                  fontSize: 17,
                }}
              >
                List Hikes
              </Text>
              <TouchableOpacity
                style={{
                  backgroundColor: "#D10000",
                  padding: 9,
                  borderRadius: 5,
                  width: "30%",
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    textAlign: "center",
                    textTransform: "uppercase",
                    fontWeight: "bold",
                  }}
                >
                  Delete All
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapperItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexDirection: "row",
    paddingRight: 12,
    paddingLeft: 12,
    marginBottom: 15,
  },
  wrapBtns: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    width: "30%",
  },
});
