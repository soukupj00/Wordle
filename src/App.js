import './App.css';
import {createContext, useEffect, useState} from "react";
import {boardDefault, generateWordSet} from "./Words";
import Board from "./components/Board";
import GameOver from "./components/GameOver";
import Keyboard from "./components/Keyboard";

export const AppContext = createContext({});

const App = () => {
    const [board, setBoard] = useState(boardDefault);
    const [currAttempt, setCurrAttempt] = useState({attempt: 0, letter: 0});
    const [wordSet, setWordSet] = useState(new Set());
    const [correctWord, setCorrectWord] = useState("");
    const [disabledLetters, setDisabledLetters] = useState([]);
    const [gameOver, setGameOver] = useState({gameOver: false, guessedWord: false})

    useEffect(() => {
        generateWordSet().then((words) => {
            setWordSet(words.wordSet);
            setCorrectWord(words.todaysWord);
        });
    }, []);

    const onEnter = () => {
        if (currAttempt.letter !== 5) return;

        let currWord = "";
        for (let i = 0; i < 5; ++i) {

            currWord += board[currAttempt.attempt][i];
        }

        let lowerCurrWord = currWord.toLowerCase();
        console.log(lowerCurrWord + " / Lower");

        if (wordSet.has(lowerCurrWord)) {
            setCurrAttempt({attempt: currAttempt.attempt + 1, letter: 0});
        } else {
            alert("Word not found.");
        }
        console.log(correctWord);
        setCurrAttempt({attempt: currAttempt.attempt + 1, letter: 0});

        if (lowerCurrWord === correctWord) {
            console.log("Game over - you won")
            setGameOver({gameOver: true, guessedWord: true});
            return;
        }
        console.log(currAttempt);
        if (currAttempt.attempt === 5) {
            setGameOver({gameOver: true, guessedWord: false})
        }
    };

    const onDelete = () => {
        if (currAttempt.letter === 0) return;
        const newBoard = [...board];
        newBoard[currAttempt.attempt][currAttempt.letter - 1] = "";
        setBoard(newBoard);
        setCurrAttempt({...currAttempt, letter: currAttempt.letter - 1});
    }

    const onSelectLetter = (key) => {
        if (currAttempt.letter > 4) return;
        const newBoard = [...board];
        newBoard[currAttempt.attempt][currAttempt.letter] = key;
        setBoard(newBoard);
        setCurrAttempt({attempt: currAttempt.attempt, letter: currAttempt.letter + 1});
    }

    return (
        <div className="App">
            <nav>
                <h1>WORDLE</h1>
            </nav>
            <AppContext.Provider
                value={{
                    board,
                    setBoard,
                    currAttempt,
                    setCurrAttempt,
                    correctWord,
                    disabledLetters,
                    setDisabledLetters,
                    gameOver,
                    onEnter,
                    onDelete,
                    onSelectLetter
                }}
            >
                <div className="game">
                    <Board/>
                    {gameOver.gameOver ? <GameOver/> : <Keyboard/>}
                </div>
            </AppContext.Provider>
        </div>
    );
}

export default App;