import React, {useEffect, useState} from 'react';
import type {Node} from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {CLEAR, colors, ENTER} from './src/constants';
import Keyboard from './src/components/Keyboard';

const NUMBER_OF_TRIES = 6;
const copyArray = arr => {
  return [...arr.map(rows => [...rows])];
};
const App: () => Node = () => {
  const word = 'hello';
  const letters = word.split('');

  const [rows, setRows] = useState(
    new Array(NUMBER_OF_TRIES).fill(new Array(letters.length).fill('')),
  );

  const [curRow, setCurRow] = useState(0);
  const [curCol, setCurCol] = useState(0);
  const [gameState, setGameState] = useState('playing'); // won ,lost ,playing

  const checkGameState = () => {
    if (checkIfWon()) {
      Alert.alert('Hurray', 'You won!');
      setGameState('won');
    } else if (checkIfLost()) {
      Alert.alert('Meh', 'Try again tomorrow');
      setGameState('lost');
    }
  };

  const checkIfWon = () => {
    if (curRow !== 0) {
      const row = rows[curRow - 1];
      return row.every((letter, index) => letter === letters[index]);
    }
  };

  const checkIfLost = () => {
    return curRow === rows.length;
  };

  useEffect(() => {
    checkGameState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curRow]);

  const onKeyPressed = key => {
    if (gameState !== 'playing') {
      return;
    }

    const updatedRows = copyArray(rows);

    if (key === CLEAR) {
      const prevCol = curCol - 1;
      if (prevCol >= 0) {
        updatedRows[curRow][prevCol] = '';
        setRows(updatedRows);
        setCurCol(prevCol);
      }
      return;
    }

    if (key === ENTER) {
      if (curCol === rows[0].length) {
        setCurRow(curRow + 1);
        setCurCol(0);
      }
      return;
    }

    if (curCol < rows[0].length) {
      updatedRows[curRow][curCol] = key;
      setRows(updatedRows);
      setCurCol(curCol + 1);
    }
  };

  const getCellBGColor = (row, col) => {
    const letter = rows[row][col];
    if (row >= curRow) {
      return colors.black;
    }
    if (letter === letters[col]) {
      return colors.primary;
    }
    if (letters.includes(letter)) {
      return colors.secondary;
    }
    return colors.darkgrey;
  };

  const getAllLettersWithColors = color => {
    return rows.flatMap((row, indexRow) =>
      row.filter(
        (cell, indexCell) => getCellBGColor(indexRow, indexCell) === color,
      ),
    );
  };
  const greenCaps = getAllLettersWithColors(colors.primary);
  const yellowCaps = getAllLettersWithColors(colors.secondary);
  const greyCaps = getAllLettersWithColors(colors.darkgrey);

  const isCellActive = (row, col) => {
    return row === curRow && col === curCol;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <Text style={styles.title}>WORDLE</Text>

      <ScrollView style={styles.map}>
        {rows.map((row, indexRow) => (
          <View key={`row_${indexRow}`} style={styles.row}>
            {row.map((letter, indexCell) => (
              <View
                key={`cell_${indexCell}`}
                style={[
                  styles.cell,
                  {
                    borderColor: isCellActive(indexRow, indexCell)
                      ? colors.lightgrey
                      : colors.darkgrey,

                    backgroundColor: getCellBGColor(indexRow, indexCell),
                  },
                ]}>
                <Text style={styles.cellText}>{letter.toUpperCase()}</Text>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>

      <Keyboard
        onKeyPressed={onKeyPressed}
        greenCaps={greenCaps}
        yellowCaps={yellowCaps}
        greyCaps={greyCaps}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    alignItems: 'center',
  },
  title: {
    color: colors.lightgrey,
    fontSize: 32,
    fontWeight: 'bold',
    letterSpacing: 7,
  },
  map: {
    marginVertical: 20,
    alignSelf: 'stretch',
    height: 100,
  },
  row: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  cell: {
    flex: 1,
    borderWidth: 2,
    borderColor: colors.darkgrey,
    aspectRatio: 1,
    maxWidth: 70,
    margin: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellText: {
    color: colors.lightgrey,
    fontWeight: 'bold',
    fontSize: 28,
  },
});

export default App;
