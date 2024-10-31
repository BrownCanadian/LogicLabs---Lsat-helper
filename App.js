import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Text, View,Image,Linking , Button, TouchableOpacity } from "react-native";
import tw from "twrnc"; // Tailwind import
import Question from "./screens/Question"; // Import the updated questions.js
import SEEN from "./img/seen.svg";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Home">
          {({ navigation }) => (
            <View style={tw`flex-1 justify-center items-center bg-gray-200`}>
              <View
                style={tw`flex flex-col items-center h-3/5 w-5/5`}
              >
                <Text style={tw`text-4xl -ml-42 mt-12 text-gray-900`}>
                  Welcome
                </Text>

                {/* Container for Buttons */}
                <View
                  style={tw` flex flex-row justify-around mt-16 items-center w-5/5 h-2/5`}
                >
                  <TouchableOpacity
                    style={tw`w-2/5 h-5/5 flex justify-around items-center relative overflow-hidden rounded-md bg-gray-300 px-5 py-2.5`}
                    onPress={() =>
                      navigation.navigate("Questions", { type: "seen" })
                    }
                   >
                    <Image style={tw`h-24 w-24 mt-4`} source={require('./img/fresh.png')} />
                    <Text style={tw`text-white text-lg text-gray-900 font-medium  w-full`}>Seen</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={tw`w-2/5 h-5/5 flex justify-around items-center relative overflow-hidden rounded-md bg-gray-300 px-5 py-2.5`}
                    onPress={() =>
                      navigation.navigate("Questions", { type: "fresh" })
                    }
                  >
                    <Image style={tw`h-35 w-35 -mt-4`} source={require('./img/seen.png')} />
                    <Text style={tw`text-white text-lg text-gray-900 font-medium  w-full`}>Fresh</Text>
                  </TouchableOpacity>
                </View>
                <View style={tw`h-1/3 flex flex-col justify-end items-center `}>
                  <Text>Enjoying the free practice?</Text>
                  <Text style={tw`underline`} onPress={() => Linking.openURL('https://buymeacoffee.com/browncanadian')}>Consider buying me a coffee to support my work</Text>
                </View>
              </View>
            </View>
          )}
        </Stack.Screen>

        {/* Use questions.js as the component for the "Questions" route */}
        <Stack.Screen name="Questions" component={Question} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
