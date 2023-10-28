import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Image,
} from "react-native";
import React, { useState } from "react";
import { db } from "../../configs/dbOpen";

export default function Home({ navigation }) {
  const [dataH, setDataH] = useState({
    data: [],
    empty: true,
  });
  const [refr, setRefr] = useState(false);

  const empty = () => {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>None of any item</Text>
      </View>
    );
  };

  const onOpenDetails = (id) => {
    const findData = dataH.data.find((item) => item.hike_id === id);
    navigation.navigate("DETAIL", {
      idCard: id,
      objData: findData,
      message: "taken id ok!!!",
    });
  };

  const deleteItem = async (id) => {
    await db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM MHikeD  WHERE hike_id=?",
        [id],
        async (txtObj, resultSet) => {
          let newDats = [...dataH.data].filter((d) => d.hike_id !== id);
          setDataH({
            data: newDats,
            empty: newDats.length > 0 ? false : true,
          });
          console.log("Del OK");
          tx.executeSql(
            "DELETE FROM ObserD  WHERE hike_id=?",
            [id],
            async (txtObj, resultSet) => {
              console.log("Del OK obsers of hike");
            },
            (txtObj, error) => {
              console.log("error", error);
            }
          );
        },
        (txtObj, error) => {
          console.log("error", error);
        }
      );
    });
  };

  const openObs = (id) => {
    navigation.navigate("OBSERVATION", {
        idHike: id,
        message: "taken id ok!!!",
      });
  }

  const deleteAllItems = async () => {
    await db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM MHikeD",
        null,
        async (txtObj, result) => {
          console.log("Del ALL OK", result);
          setDataH({
            data: [],
            empty: true,
          });
        },
        (txtObj, error) => {
          console.log("error", error);
        }
      );
    });
    await db.transaction((tx) => {
        tx.executeSql(
          "DELETE FROM ObserD",
          null,
          async (txtObj, result) => {
            console.log("Del ALL OK OBS", result);
          },
          (txtObj, error) => {
            console.log("error", error);
          }
        );
      });
  };

  const fetchAllData = async () => {
    await db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM MHikeD",
        null,
        async (txtObj, resultSet) => {
          let itemArray = [];
          const len = resultSet.rows.length;
          console.log(resultSet);
          if (len > 0) {
            for (let i = 0; i < len; ++i) {
              itemArray.push(resultSet.rows.item(i));
              setDataH({ ...dataH, data: itemArray, empty: false });
            }
          } else {
            setDataH({ ...dataH, empty: true });
          }
          return resultSet;
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
      <TouchableOpacity onPress={() => onOpenDetails(item.hike_id)}>
        <Text>{item.name}</Text>
      </TouchableOpacity>
      <View style={styles.wrapBtns}>
        <TouchableOpacity
          style={{
            backgroundColor: "#097969",
            padding: 8,
            borderRadius: 5,
            marginRight: 10,
          }}
          onPress={() => openObs(item.hike_id)}
        >
          <Text style={{ color: "#fff" }}>More</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: "#097969",
            padding: 8,
            borderRadius: 5,
          }}
          onPress={() => deleteItem(item.hike_id)}
        >
          <Text style={{ color: "#fff" }}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={dataH.data}
        keyExtractor={(i) => i.hike_id.toString()}
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
              onPress={() => deleteAllItems()}
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
        ListEmptyComponent={empty}
      />
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
