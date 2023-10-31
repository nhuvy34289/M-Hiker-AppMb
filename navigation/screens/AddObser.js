import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Keyboard,
    TouchableOpacity,
    Alert,
  } from "react-native";
  import React, { useCallback, useState } from "react";
  import { Formik } from "formik";
  import * as Yup from "yup";
  import DateTimePicker from "@react-native-community/datetimepicker";
  import moment from "moment";
  import KeyBoardAvoidViewWrapper from "../../components/KeyBoardAdvoidView/KeyBoardAdvoidView";
  import { db } from "../../configs/dbOpen";
import { useRoute } from "@react-navigation/native"
import Toast from "react-native-toast-message"
  
  const FormSchema = Yup.object().shape({
    name: Yup.string().min(7).max(30).required("Please enter name of hike!"),
    time: Yup.string().required("Please enter your date !"),
  });
  
  export default function AddObser() {
    const [showDate, setShowDate] = useState(false);
    const route = useRoute();
    const {idHikeA} = route.params;

    const initialValues = {
      name: "",
      time: "",
      comments: "",
      hike_id: idHikeA
    };
    const onPressDate = () => {
      setShowDate(true);
    };

    const showToast = (type, txt) => {
      Toast.show({
        type: type,
        text1: txt,
      });
    }
  
    const createOb = ( val )=> {
      const {
          name,
          time,
          comments,
          hike_id
        } = val;
       db.transaction((tx)=>{
          tx.executeSql(
              `INSERT OR IGNORE INTO ObserD
              (observation,time, comments, hike_id)
              VALUES (?,?,?,?)
              `,
              [name, time, comments, hike_id],
              async (txtObj,resultSet)=>{
                  if(resultSet.rowsAffected<1){
                      // Alert.alert('The hike is duplicated !', [
                      //     {text: 'OK', onPress: () => console.log('OK Pressed')},
                      // ]);
                      showToast('error', 'Created fail with the existed record !');
                    }else{
                      // Alert.alert('The hike is created successsfully !', [
                      //     {text: 'OK', onPress: () => console.log('OK Pressed')},
                      // ]);
                      showToast('success', 'Created successfully !');
                    }
              },
              (error)=>{
                  console.log('Error', error)
              }
           )
       })
    }
  
    const submit = useCallback((v, { resetForm }) => {
      Alert.alert(
        "Confirmation",
        `Are you sure what you typed ? \n
       New hike will be added:
       Name: ${v.name}
       Time: ${v.time}
       Comment: ${v.comments ? v.comments : "None"}
      `,
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          {
            text: "Yes",
            onPress: () => {
              resetForm({ values: initialValues });
              console.log(v);
              createOb(v);
            },
          },
        ]
      );
    }, []);
  
    return (
      <KeyBoardAvoidViewWrapper>
        <Formik
          initialValues={initialValues}
          validationSchema={FormSchema}
          onSubmit={submit}
        >
          {({
            handleChange,
            values,
            handleBlur,
            setFieldTouched,
            errors,
            touched,
            handleSubmit,
            setFieldValue,
          }) => (
            <View style={styles.wrapForm}>
              <View style={styles.wrapBoxInput}>
                <Text style={styles.lable}>
                  Observation <Text style={{ color: "#FF0000" }}>*</Text>
                </Text>
                <View
                  style={[
                    styles.inputWrapper,
                    styles.pInput,
                    {
                      borderColor:
                        touched.name && errors.name ? "#ff0000" : "#818182",
                    },
                  ]}
                >
                  <TextInput
                    name="name"
                    placeholder="Hiker"
                    value={values.name}
                    onChangeText={handleChange("name")}
                    style={styles.input}
                    onBlur={() => setFieldTouched("name")}
                  />
                </View>
                {touched.name && errors.name && (
                  <Text style={styles.errorMess}>{errors.name}</Text>
                )}
              </View>
              <View style={{ width: 0, height: 0, opacity: 0 }}>
                {showDate && (
                  <DateTimePicker
                    mode="date"
                    minimumDate={new Date()}
                    value={new Date()}
                    onTouchCancel={() => setFieldValue("time", "")}
                    style={{ flex: 1 }}
                    dateFormat="day month year"
                    display="calendar"
                    onChange={(e, date) => {
                      setShowDate(false);
                      if (e.type == "set") {
                        setFieldValue(
                          "time",
                          moment(date).format("DD/MM/YYYY")
                        );
                      }
                    }}
                  />
                )}
              </View>
  
              <View style={styles.wrapBoxInput}>
                <Text style={styles.lable}>
                  Date of the hike <Text style={{ color: "#FF0000" }}>*</Text>
                </Text>
                <TouchableOpacity onPress={onPressDate}>
                  <View
                    style={[
                      styles.inputWrapper,
                      styles.pInput,
                      {
                        borderColor:
                          touched.time && errors.time
                            ? "#ff0000"
                            : "#818182",
                      },
                    ]}
                  >
                    <View pointerEvents="none">
                      <TextInput
                        name="time"
                        placeholder="Select date here"
                        value={values.time}
                        style={styles.input}
                        selectTextOnFocus={false}
                        returnKeyType={"done"}
                        autoCapitalize="none"
                        onKeyPress={() => Keyboard.dismiss()}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
  
                {touched.time && errors.time && (
                  <Text style={styles.errorMess}>{errors.time}</Text>
                )}
              </View>
              <View style={styles.wrapBoxInput}>
                <Text style={styles.lable}>Description</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    styles.pInput,
                    { height: 120, paddingTop: 6 },
                  ]}
                >
                  <TextInput
                    name="comments"
                    placeholder="Son Dong"
                    value={values.comments}
                    onChangeText={handleChange("comments")}
                    style={[styles.input]}
                    onBlur={() => setFieldTouched("comments")}
                    multiline={true}
                    numberOfLines={10}
                    textAlignVertical="top"
                  />
                </View>
              </View>
              <TouchableOpacity onPress={handleSubmit} style={styles.btnSubm}>
                <Text style={styles.txtBtnSubm}>Submit</Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </KeyBoardAvoidViewWrapper>
    );
  }
  
  const styles = StyleSheet.create({
    wrapForm: {
      paddingLeft: 30,
      paddingRight: 30,
    },
    inputWrapper: {
      borderWidth: 1,
      borderColor: "#818182",
      borderRadius: 7,
      height: 40,
      display: "flex",
      justifyContent: "center",
    },
    errorMess: {
      marginTop: 5,
      fontSize: 12,
      marginLeft: 4,
      lineHeight: 19,
      color: "#FF0000",
    },
    input: {
      width: "100%",
    },
    lable: {
      marginTop: 7,
      marginBottom: 6,
      fontSize: 16,
      fontWeight: "300",
    },
    wrapBoxInput: {
      marginBottom: 10,
    },
    wrapBoxInputInline: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    pInput: {
      paddingLeft: 10,
      paddingRight: 10,
    },
    boxInputInline: {
      marginTop: 10,
    },
    wrapCheckBox: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    btnSubm: {
      width:"100%",
      padding: 15,
      backgroundColor: "#0047AB",
      borderRadius: 7,
      textAlign: "center",
      marginTop: 10,
      marginBottom: 10,
    },
    txtBtnSubm: {
      textAlign: "center",
      fontSize: 17,
      fontWeight: 'bold',
      textTransform: "uppercase",
      color: "#FFFFFF",
    }
  });
  
  const pickerStyles = StyleSheet.create({
    inputAndroid: {
      paddingLeft: 10,
    },
  });
  