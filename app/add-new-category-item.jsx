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

const placeholder =
  "data:image/png;base64,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";
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
  const onClickAdd = async () => {
    setLoading(true);
    const fileName = Date.now();
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
      ToastAndroid.show("New Item Added!!!", ToastAndroid.SHORT);
      console.log(data);
      setLoading(false);
      router.replace({
        pathname: "/category-detail",
        params: {
          categoryId: categoryId,
        },
      });
    }
  };

  return (
    <KeyboardAvoidingView>
      <Stack.Screen
      options={{
        headerShown: true,
        headerTitle: translations.item?.heading
      }}/>
      <ScrollView style={{ padding: 20, backgroundColor: Colors.WHITE }}>
        <TouchableOpacity onPress={onImagePick}>
          <Image
            source={{ uri: previewImage }}
            style={{
              width: 120,
              height: 120,
              borderRadius: 15,
              borderWidth: 1,
              borderColor: Colors.GRAY,
            }}
          />
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
            <Text
              style={{
                textAlign: "center",
                alignItems: "center",
                fontFamily: "poppins-bold",
                fontSize: 15,
                color: "white",
              }}
            >
              {translations.item?.add}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
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
    backgroundColor: Colors.BLACK,
    padding: 15,
    borderRadius: 10,
    borderColor: Colors.GRAY,
    marginTop: 30,
  },
});
