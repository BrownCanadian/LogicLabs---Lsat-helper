import React, { useState, useRef, useEffect } from 'react';
import { TouchableOpacity, Alert, FlatList, View, Text, Dimensions, StyleSheet, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import questionData from '../lsat_formal_logic.json'; // Adjust path as needed
import tw from "twrnc"; // Tailwind import
const SCREEN_HEIGHT = Dimensions.get('window').height;
const BATCH_SIZE = 8; // Number of questions to load at a time

const QuestionScreen = ({ route }) => {
  const { type } = route.params; // 'seen' or 'fresh'
  const flatListRef = useRef(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const loadQuestions = async () => {
      const seenQuestions = await AsyncStorage.getItem('seenQuestions');
      let seenSet = new Set();

      if (seenQuestions) {
        try {
          seenSet = new Set(JSON.parse(seenQuestions)); // Parse the stored seen questions
        } catch (error) {
          console.error('Error parsing seen questions from AsyncStorage', error);
        }
      }

      let filteredQuestions;
      if (type === 'fresh') {
        // Show only fresh questions (not in seenSet)
        filteredQuestions = questionData.filter(q => !seenSet.has(q.question));
      } else if (type === 'seen') {
        // Show only seen questions (in seenSet)
        filteredQuestions = questionData.filter(q => seenSet.has(q.question));
      }

      // Load the first batch of filtered questions
      setQuestions(filteredQuestions.slice(0, BATCH_SIZE));
      setCurrentIndex(BATCH_SIZE);
    };

    loadQuestions();
  }, [type]);

  const handleSnap = async (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    let index = Math.round(offsetY / SCREEN_HEIGHT);

    if (index >= questions.length - 1 && currentIndex < questionData.length) {
      // Load more questions in batches
      setQuestions(prevQuestions => [
        ...prevQuestions,
        ...questions.slice(currentIndex, currentIndex + BATCH_SIZE)
      ]);
      setCurrentIndex(prevIndex => prevIndex + BATCH_SIZE);
    }

    if (index >= questions.length) {
      index = 0;
      if (flatListRef.current) {
        flatListRef.current.scrollToOffset({ offset: 0, animated: true });
        return;
      }
    }

    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({ index, animated: true });
    }

    // Mark question as seen only if it's in fresh mode
    if (type === 'fresh') {
      const seenQuestions = await AsyncStorage.getItem('seenQuestions');
      let seenSet = new Set();

      if (seenQuestions) {
        try {
          seenSet = new Set(JSON.parse(seenQuestions));
        } catch (error) {
          console.error('Error parsing seen questions from AsyncStorage', error);
        }
      }

      // Add question to seenSet
      if (!seenSet.has(questions[index].question)) {
        seenSet.add(questions[index].question);
        await AsyncStorage.setItem('seenQuestions', JSON.stringify([...seenSet]));
      }
    }
  };

  const renderItem = ({ item }) => (
    <View style={{ backgroundColor:'rgb(229, 231, 235)' ,height: SCREEN_HEIGHT, justifyContent: 'center', alignItems: 'center' }}>
      {/* <Text style={styles.typeText}>
        {type === 'seen' ? 'Seen Questions' : 'Fresh Questions'}
      </Text> */}
      <View style={tw`h-3/5 w-4/5 flex flex-col justify-center items-center`}>
      <Text style={tw`mb-8 text-2xl font-medium text-center`}>{item.question}</Text>
      <Text style={tw`mb-8 text-sm font-thin text-center`}>{item.level}</Text>
      <TouchableOpacity
        style={tw` mt-16`} // Apply your custom Tailwind styles here
        onPress={() => Alert.alert('Answer', item.answer)}
      >
         <Text style={tw`text-gray-600 underline text-lg font-light`}>Show Answer</Text>
         </TouchableOpacity>
         
      </View>
    </View>
  );

  return (
    <FlatList
      style={{ backgroundColor: 'rgb(229, 231, 235)' }}
      ref={flatListRef}
      data={questions}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderItem}
      onMomentumScrollEnd={handleSnap}
      showsVerticalScrollIndicator={false}
      decelerationRate="fast"
      snapToAlignment="start"
      snapToInterval={SCREEN_HEIGHT}
      pagingEnabled
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  typeText: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  questionText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginHorizontal: 20,
  },
});

export default QuestionScreen;
