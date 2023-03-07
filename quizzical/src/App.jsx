import { useState, useEffect } from 'react'
import {nanoid} from "nanoid"
import React from "react"
import Answer from "./Answer"
import './App.css'

function App() {
  const [gameState, setGameState] = useState(false)
    const [resultsArr, setResultsArr] = useState([])
    const [areAnswersChecked, setAreAnswersChecked] = useState(false)
    const [count, setCount] = useState(0)
    
  //decode HTML symbols
function decodeHtml(html) {
  var txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}
    
  //fetches API when app loads
    useEffect(()=>{
        fetchApi()
    }, [])
    
  //fetches API and returns object for each question
    function fetchApi(){  
       fetch("https://opentdb.com/api.php?amount=5")
        .then(res => res.json())
        .then(data => {
            setResultsArr(data.results.map(question => {
                
        const questionDecoded = decodeHtml(question.question)
  //adds and shuffles incorrect with correct answers
        let shuffledAnswers = [
            ...question.incorrect_answers,
            question.correct_answer].sort(() => Math.random() - 0.5)
  //creates object for each answer
        shuffledAnswers = shuffledAnswers.map(answer => {
                return {answer: decodeHtml(answer), 
                        id: nanoid(),
                        isSelected: false,
                        isCorrectAnswer: (answer==question.correct_answer)
                        }
            }) 
        return {...question, question: questionDecoded, id: nanoid(), answers: shuffledAnswers}
            }))
        })
    } 

  // reinitialize the game when clicked

     function playAgain(){
        setResultsArr([])
        setAreAnswersChecked(false)
        setCount(0)
        fetchApi()
    }
   
    //flip the boolean isSelected of the clicked answer 

    function handleAnswerClick(questId, id){ 
        setResultsArr(prevResultsArr => prevResultsArr.map(question => {
             const chosenAnswer = question.answers.map(answer => {
                return answer.id === id ?
                    {...answer, isSelected: !answer.isSelected} : 
                    {...answer, isSelected: false}
              })       
             return question.id === questId ? 
                    {...question, answers: chosenAnswer} : 
                    question
        }))
    }

  //check if answer is selected is the right one, and add to count if true

    function checkAnswers(){
        resultsArr.forEach(question => {
            question.answers.forEach(answer => {
                if(answer.isSelected && answer.isCorrectAnswer){
                    setCount(prevCount => prevCount + 1)
                }
            })
        })
        setAreAnswersChecked(true)
    }
    
    // creates answer component and places it with its question in a quiz-item div
    const quizElement = resultsArr.map((question) => {    
        
       const answerElement = question.answers.map((answer) =>
            {return (
            <Answer 
            id={answer.id}
            key={answer.id}
            answer={answer.answer}
            isSelected={answer.isSelected} 
            isCorrectAnswer={answer.isCorrectAnswer}
            areAnswersChecked={areAnswersChecked}
            handleAnswerClick = {() => handleAnswerClick(question.id, answer.id)}/>
            )}) 
            
        return (
            <div className="quiz-item" key={question.id}>
                <h3 className="question">{question.question}</h3>
                <div className="answer-div">{answerElement}</div>
            </div>)           
    })
            
      //JSX elements of the quiz
    return (
        !gameState ? 
        <div className="start-screen">
            <h1>Quizzical</h1>
            <p>Let's have fun!</p>
            <button onClick={() => setGameState(true)}>Start quiz</button>
        </div> :
        
        <div className="quiz">
            {quizElement}
            {!areAnswersChecked ? 
            <button className="answer-btn" onClick={checkAnswers}>Check Answers</button> :
            <div className="results-div">
                <p>You scored {count}/5 correct answers</p>
                <button onClick={playAgain}>Play Again</button>
            </div>}
        </div>  
    )
}

export default App
