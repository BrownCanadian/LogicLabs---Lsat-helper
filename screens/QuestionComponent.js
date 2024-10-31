import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const QuestionComponent = ({ questionText, type }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.typeText}>{type === 'seen' ? 'Seen Questions' : 'Fresh Questions'}</Text>
      <Text style={styles.questionText}>{questionText}</Text> {/* Render the string directly */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  typeText: {
    fontSize: 20,
    marginBottom: 20,
  },
  questionText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginHorizontal: 20,
  },
});

export default QuestionComponent;
