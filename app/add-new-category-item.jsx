//importation of the libraries
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  ToastAndroid,
  ActivityIndicator,
} from "react-native";
import React, { useContext, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";
import Colors from "../utils/Colors";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "../app/lib/supabase-client";
import { decode } from "base64-arraybuffer";
import { TranslationContext } from "../contexts/translationContext";

//image place holder
const placeholder =
  "https://archive.org/download/placeholder-image/placeholder-image.jpg";
export default function AddNewCategoryItems() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(placeholder);
  const { categoryId } = useLocalSearchParams();
  const [previewImage, setPreviewImage] = useState(placeholder);
  const [name, setName] = useState();
  const [url, setUrl] = useState();
  const [cost, setCost] = useState();
  const [note, setNote] = useState();
  const { translations } = useContext(TranslationContext);

  // function to pick image from the device
  const onImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setPreviewImage(result.assets[0].uri);
      setImage(result.assets[0].base64);
    }
  };

  //function that insert data to database
  const onClickAdd = async () => {
    setLoading(true);
    const fileName = Date.now();

    //image upload
    const { data, error } = await supabase.storage
      .from("images")
      .upload(fileName + ".png", decode(image), {
        contentType: "image/png",
      });
    console.log("file upload", data);
    if (data) {
      const fileUrl =
        "https://vnwmfpqiuciievroggyx.supabase.co/storage/v1/object/public/images/" +
        fileName +
        ".png";

      // data insertion
      const { data, error } = await supabase
        .from("CategoryItems")
        .insert([
          {
            name: name,
            cost: cost,
            url: url,
            image: fileUrl,
            note: note,
            category_id: categoryId,
          },
        ])
        .select();
      ToastAndroid.show(translations.item?.added, ToastAndroid.SHORT);
      console.log(data);
      setLoading(false);

      // redirecting to category details page
      router.replace({
        pathname: "/category-detail",
        params: {
          categoryId: categoryId,
        },
      });
    }
  };
  //user interface designed
  return (
    <KeyboardAvoidingView>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: translations.item?.heading,
        }}
      />
      <ScrollView style={{ padding: 20, backgroundColor: Colors.WHITE }}>
        <TouchableOpacity onPress={onImagePick} style={styles.imagePick}>
          <Image source={{ uri: previewImage }} style={styles.images} />
          <Text style={styles.imageText}>{translations.item?.upload}</Text>
        </TouchableOpacity>

        <View style={styles.inputContainer}>
          <Ionicons name="pricetag" size={24} color={Colors.GRAY} />
          <TextInput
            placeholder={translations.item?.name1}
            style={styles.textInput}
            onChangeText={(v) => setName(v)}
          />
        </View>

        <View style={styles.inputContainer}>
          <FontAwesome6 name="naira-sign" size={24} color={Colors.GRAY} />
          <TextInput
            placeholder={translations.item?.cost}
            style={styles.textInput}
            keyboardType={"numeric"}
            onChangeText={(v) => setCost(v)}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="pencil" size={24} color={Colors.GRAY} />
          <TextInput
            placeholder={translations.item?.note}
            style={styles.textInput}
            numberOfLines={3}
            onChangeText={(value) => setNote(value)}
          />
        </View>

        <TouchableOpacity
          style={styles.Tbutton}
          onPress={onClickAdd}
          disabled={!name || !cost || loading}
        >
          {loading ? (
            <ActivityIndicator color={Colors.WHITE} />
          ) : (
            <Text style={styles.addbtn}>{translations.item?.add}</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
//styling
const styles = StyleSheet.create({
  inputContainer: {
    padding: 10,
    borderWidth: 1,
    display: "flex",
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    borderRadius: 10,
    borderColor: Colors.GRAY,
    marginTop: 10,
  },
  textInput: {
    fontFamily: "poppins-medium",
    fontSize: 16,
    width: "100%",
  },
  Tbutton: {
    backgroundColor: Colors.PRIMARY,
    padding: 15,
    borderRadius: 10,
    borderColor: Colors.GRAY,
    marginTop: 30,
  },
  imagePick: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  images: {
    width: 120,
    height: 120,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Colors.GRAY,
  },
  imageText: {
    position: "absolute",
    color: Colors.GRAY_LIGHT,
    top: 10,
    left: 26,
    textAlign: "center",
    justifyContent: "center",
    fontFamily: "poppins-medium",
  },
  addbtn: {
    textAlign: "center",
    alignItems: "center",
    fontFamily: "poppins-bold",
    fontSize: 15,
    color: "white",
  },
});
