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
import RNPickerSelect from "react-native-picker-select";
import * as Yup from "yup";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import Icon from "react-native-vector-icons/Ionicons";
import KeyBoardAvoidViewWrapper from "../../components/KeyBoardAdvoidView/KeyBoardAdvoidView";
import CheckBox from "react-native-check-box";
import { db } from "../../configs/dbOpen"

const FormSchema = Yup.object().shape({
  name: Yup.string().min(7).max(30).required("Please enter name of hike!"),
  location: Yup.string().min(4).required("Please enter your location !"),
  dateHike: Yup.string().required("Please enter your date !"),
  level: Yup.string().required("Please enter your level !"),
  length: Yup.number().required("Please enter your length !"),
  parkingAvailable: Yup.string().required("Please check parking available !"),
});

export default function Add() {
  const [showDate, setShowDate] = useState(false);
  const [checkConf, setCheckConf] = useState({
    y: false,
    n: false,
  });

  const initialValues = {
    name: "",
    location: "",
    description: "",
    dateHike: "",
    level: null,
    length: "",
    parkingAvailable: "",
  };
  const onPressDate = () => {
    setShowDate(true);
  };

  const createHike = ( val )=> {
    const {
        name,
        location,
        description,
        dateHike,
        level,
        length,
        parkingAvailable,
      } = val;
      const parseNum = parseFloat(length);
     db.transaction((tx)=>{
        tx.executeSql(
            `INSERT OR IGNORE INTO MHikeD
            (name,location,dateHike,length,level,parkingAvailable,description)
            VALUES (?,?,?,?,?,?,?)
            `,
            [name, location, dateHike, parseNum, level, parkingAvailable, description],
            async (txtObj,resultSet)=>{
                if(resultSet.rowsAffected<1){
                    // Alert.alert('The hike is duplicated !', [
                    //     {text: 'OK', onPress: () => console.log('OK Pressed')},
                    // ]);
                    console.log('duplicate error')
                }else{
                    // Alert.alert('The hike is created successsfully !', [
                    //     {text: 'OK', onPress: () => console.log('OK Pressed')},
                    // ]);
                    console.log('success')
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
     Location: ${v.location}
     Date of the hike: ${v.dateHike}
     Parking Available: ${v.parkingAvailable}
     Length of the hike: ${v.length}
     Difficulty level: ${v.level}
     Description: ${v.description ? v.description : "None"}
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
            setCheckConf({
              y: false,
              n: false,
            });
            console.log(v);
            createHike(v);
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
                Name of the hike <Text style={{ color: "#FF0000" }}>*</Text>
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
            <View style={styles.wrapBoxInput}>
              <Text style={styles.lable}>
                Location <Text style={{ color: "#FF0000" }}>*</Text>
              </Text>
              <View
                style={[
                  styles.inputWrapper,
                  styles.pInput,
                  {
                    borderColor:
                      touched.location && errors.location
                        ? "#ff0000"
                        : "#818182",
                  },
                ]}
              >
                <TextInput
                  name="location"
                  placeholder="Quang Binh"
                  value={values.location}
                  onChangeText={handleChange("location")}
                  style={styles.input}
                  onBlur={() => setFieldTouched("location")}
                />
              </View>
              {touched.location && errors.location && (
                <Text style={styles.errorMess}>{errors.location}</Text>
              )}
            </View>
            <View style={{ width: 0, height: 0, opacity: 0 }}>
              {showDate && (
                <DateTimePicker
                  mode="date"
                  minimumDate={new Date()}
                  value={new Date()}
                  onTouchCancel={() => setFieldValue("dateHike", "")}
                  style={{ flex: 1 }}
                  dateFormat="day month year"
                  display="calendar"
                  onChange={(e, date) => {
                    setShowDate(false);
                    if (e.type == "set") {
                      setFieldValue(
                        "dateHike",
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
                        touched.dateHike && errors.dateHike
                          ? "#ff0000"
                          : "#818182",
                    },
                  ]}
                >
                  <View pointerEvents="none">
                    <TextInput
                      name="dateHike"
                      placeholder="Select date here"
                      value={values.dateHike}
                      style={styles.input}
                      selectTextOnFocus={false}
                      returnKeyType={"done"}
                      autoCapitalize="none"
                      onKeyPress={() => Keyboard.dismiss()}
                    />
                  </View>
                </View>
              </TouchableOpacity>

              {touched.dateHike && errors.dateHike && (
                <Text style={styles.errorMess}>{errors.dateHike}</Text>
              )}
            </View>
            <View style={styles.boxInputInline}>
              <View style={styles.wrapBoxInputInline}>
                <Text style={styles.lable}>
                  Parking Available
                  <Text style={{ color: "#FF0000", width: "25%" }}>*</Text>
                </Text>
                <View
                  style={[
                    styles.pInput,
                    {
                      width: "50%",
                      height: 40,
                      paddingTop: 7,
                    },
                  ]}
                >
                  <TextInput
                    name="parkingAvailable"
                    value={values.parkingAvailable}
                    style={[styles.input, { width: 0, height: 0, opacity: 0 }]}
                    selectTextOnFocus={false}
                    editable={false}
                    returnKeyType={"done"}
                    autoCapitalize="none"
                    onKeyPress={() => Keyboard.dismiss()}
                  />
                  <View style={styles.wrapCheckBox}>
                    <View style={{ display: "flex", flexDirection: "row" }}>
                      <CheckBox
                        isChecked={checkConf.y}
                        onClick={() => {
                          setCheckConf({
                            y: true,
                            n: false,
                          });
                          setFieldValue("parkingAvailable", "Yes");
                        }}
                        checkedCheckBoxColor="green"
                        uncheckedCheckBoxColor="black"
                      />
                      <Text
                        style={{
                          marginLeft: 5,
                          fontSize: 16,
                          color: checkConf.y ? "green" : "black",
                        }}
                      >
                        Yes
                      </Text>
                    </View>
                    <View style={{ display: "flex", flexDirection: "row" }}>
                      <CheckBox
                        isChecked={checkConf.n}
                        onClick={() => {
                          setCheckConf({
                            y: false,
                            n: true,
                          });
                          setFieldValue("parkingAvailable", "No");
                        }}
                        checkedCheckBoxColor="green"
                        uncheckedCheckBoxColor="black"
                      />
                      <Text
                        style={{
                          marginLeft: 5,
                          fontSize: 16,
                          color: checkConf.n ? "green" : "black",
                        }}
                      >
                        No
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              {touched.parkingAvailable && errors.parkingAvailable && (
                <Text style={styles.errorMess}>{errors.parkingAvailable}</Text>
              )}
            </View>
            <View style={styles.boxInputInline}>
              <View style={styles.wrapBoxInputInline}>
                <Text style={styles.lable}>
                  Length of the hike
                  <Text style={{ color: "#FF0000", width: "25%" }}>*</Text>
                </Text>
                <View
                  style={[
                    styles.inputWrapper,
                    styles.pInput,
                    {
                      borderColor:
                        touched.length && errors.length ? "#ff0000" : "#818182",
                      width: "50%",
                    },
                  ]}
                >
                  <TextInput
                    name="length"
                    placeholder="100"
                    value={values.length}
                    onChangeText={handleChange("length")}
                    style={styles.input}
                    keyboardType="numeric"
                    onBlur={() => setFieldTouched("length")}
                  />
                </View>
              </View>
              {touched.length && errors.length && (
                <Text style={styles.errorMess}>{errors.length}</Text>
              )}
            </View>
            <View style={[styles.boxInputInline, { marginTop: 18 }]}>
              <View style={styles.wrapBoxInputInline}>
                <Text style={styles.lable}>
                  Difficulty level
                  <Text style={{ color: "#FF0000", width: "25%" }}>*</Text>
                </Text>
                <View
                  style={[
                    styles.inputWrapper,
                    {
                      borderColor:
                        touched.level && errors.level ? "#ff0000" : "#818182",
                      width: "50%",
                    },
                  ]}
                >
                  <RNPickerSelect
                    useNativeAndroidPickerStyle={false}
                    style={pickerStyles}
                    onValueChange={(v) => {
                      if (v !== -1) {
                        setFieldValue("level", v);
                      }
                    }}
                    value={values.level}
                    pickerProps={{
                      onBlur: () => setFieldTouched("level"),
                    }}
                    items={[
                      {
                        label: "LOW",
                        value: "LOW",
                      },
                      {
                        label: "MEDIUM",
                        value: "MEDIUM",
                      },
                      {
                        label: "HIGH",
                        value: "HIGH",
                      },
                    ]}
                    Icon={() => (
                      <Icon
                        style={{
                          marginRight: 6,
                          marginTop: 2,
                          color: "#555",
                        }}
                        name="chevron-down-outline"
                        size={24}
                        color="black"
                      />
                    )}
                  />
                </View>
              </View>
              {touched.level && errors.level && (
                <Text style={styles.errorMess}>{errors.level}</Text>
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
                  name="description"
                  placeholder="Son Dong"
                  value={values.description}
                  onChangeText={handleChange("description")}
                  style={[styles.input]}
                  onBlur={() => setFieldTouched("description")}
                  multiline={true}
                  numberOfLines={10}
                  textAlignVertical="top"
                />
              </View>
            </View>
            <TouchableOpacity onPress={handleSubmit}>
              <Text>Submit</Text>
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
});

const pickerStyles = StyleSheet.create({
  inputAndroid: {
    paddingLeft: 10,
  },
});
