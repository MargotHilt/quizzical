import React from "react"

export default function Answer(props){ 

    //apply styling to the answers after the quiz is validated 
function setStyling(){
        if(props.areAnswersChecked === false){
        {return (props.isSelected ? "selected" : "answer-bubble")}}
        else {
            return (props.isSelected && props.isCorrectAnswer ? "right-answer" :
            props.isSelected ? "wrong-answer" :
            !props.isSelected && props.isCorrectAnswer ? "right-answer":
             "rest-answer")}
        }
    //return answer JSX
        return (<div 
                    onClick={!props.areAnswersChecked ? props.handleAnswerClick : null}
                    className= {setStyling() + " answer"}>{props.answer}
                </div>)
}