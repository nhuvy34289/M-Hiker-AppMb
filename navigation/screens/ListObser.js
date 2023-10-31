import {
    View,
    StyleSheet,
    Text,
    FlatList,
    TouchableOpacity,
    RefreshControl,
    Alert,
  } from "react-native";
  import React, { useState } from "react";
  import { db } from "../../configs/dbOpen";
import { useNavigation } from "@react-navigation/native"
import Toast from "react-native-toast-message"
  
  export default function ListObser({ idHike }) {
    const [dataOb, setDataOb] = useState({
      data: [],
      empty: true,
    });

    const navigation = useNavigation();

    const [refr, setRefr] = useState(false);
  
    const empty = () => {
      return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text>None of any item</Text>
        </View>
      );
    };
  
    const onOpenDetails = (id) => {
      const findData = dataOb.data.find((item) => item.id_ob === id);
      navigation.navigate("DETAILOB", {
        idOb: id,
        objData: findData,
        message: "taken id ok!!!",
      });
    };

    const actionDelItem = (id) => {
      Alert.alert(
        "Confirmation",
        "Do you want to delete this observation ?",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          {
            text: "Yes",
            onPress: () => deleteItem(id),
          },
        ]
      );
    }

    const showToast = (type, txt) => {
      Toast.show({
        type: type,
        text1: txt,
      });
    };
  
    const deleteItem = async (id) => {
      await db.transaction((tx) => {
        tx.executeSql(
          "DELETE FROM ObserD  WHERE id_ob=?",
          [id],
          async (txtObj, resultSet) => {
            let newDats = [...dataOb.data].filter((d) => d.id_ob !== id);
            setDataOb({
              data: newDats,
              empty: newDats.length > 0 ? false : true,
            });
            showToast('success', 'Delete this observation successfully !')
          },
          (txtObj, error) => {
            showToast('error', 'Delete this observation fail !')
          }
        );
      });
    };
  
    const AddNew = () => {
        navigation.navigate("ADDOB", {
            idHikeA: idHike
        });
    };
  
    const fetchAllData = async () => {
      await db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM ObserD",
          null,
          async (txtObj, resultSet) => {
            let itemArray = [];
            const len = resultSet.rows.length;
            console.log(resultSet);
            if (len > 0) {
              for (let i = 0; i < len; ++i) {
                itemArray.push(resultSet.rows.item(i));
                setDataOb({ ...dataOb, data: [...itemArray.filter(i => i.hike_id == idHike)], empty: false });
              }
            } else {
                setDataOb({ ...dataOb, empty: true });
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
  
    console.log(dataOb);
  
    const refreshData = () => {
      setRefr(true, fetchAllData());
      setTimeout(() => {
        setRefr(false);
      }, 1200);
    };
  
    const uiItem = ({ item, index }) => (
      <View style={styles.wrapperItem}>
        <TouchableOpacity>
          <Text>{item.observation}</Text>
        </TouchableOpacity>
        <View style={styles.wrapBtns}>
        <TouchableOpacity
            style={{
              backgroundColor: "#097969",
              padding: 8,
              borderRadius: 5,
            }}
            onPress={() => onOpenDetails(item.id_ob)}
          >
            <Text style={{ color: "#fff" }}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: "#097969",
              padding: 8,
              borderRadius: 5,
            }}
            onPress={() => actionDelItem(item.id_ob)}
          >
            <Text style={{ color: "#fff" }}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          data={dataOb.data}
          keyExtractor={(i) => i.id_ob.toString()}
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
                List Observations
              </Text>
              <TouchableOpacity
                style={{
                  backgroundColor: "#D10000",
                  padding: 10,
                  borderRadius: 5,
                  width: "30%",
                }}
                onPress={() => AddNew()}
              >
                <Text
                  style={{
                    color: "#fff",
                    textAlign: "center",
                    textTransform: "uppercase",
                    fontWeight: "bold",
                  }}
                >
                  ADD NEW
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
  