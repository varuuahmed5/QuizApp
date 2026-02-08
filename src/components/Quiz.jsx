import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { QuizData } from '../data/quizData';

const Quiz = () => {

    const [questions , setQuestion] = useState([]);
    const [Currentquestions , setCurrentQuestion] = useState(0);
    const [score , setScore] = useState(0);
    const [showScore , setShowScore ]= useState(false);


    const decodeEntities = (html) =>{
        const textarea =document.createElement("textarea");
        textarea.innerHTML = html;
        return textarea.value;

    }

    useEffect(()=> {
        async function fetchQuestions(){
            try{
                const response = await axios.get(QuizData);
                const formettedQuestions = response.data.results.map((questions)=>({
                    ...questions,
                    questions : decodeEntities(questions.questions),
                    incorrect_answers : questions.incorrect_answers.map(decodeEntities),
                    correct_answers : decodeEntities(questions.correct_answers),
                }))
                setQuestion(formettedQuestions);

            }catch(error){
                console.error("Error fetching data :" , error)
            }
        }
        fetchQuestions(); //call the function
    }, []);
    const handleClick = (answer) => {
        if (answer === questions[Currentquestions].correct_answers){
            setScore (score + 1);
        }

        if (Currentquestions < questions.length - 1){
            setCurrentQuestion(Currentquestions + 1);
        }
        else
        {
            setShowScore(true)
        }
    }
  return (
    <div className='container mx-auto p-4 text-center bg-gradient-to-r from-green-200 to-green-500'>
        <div className='main-h-screen flex flex-col justify-center'>
            <h1 className='text-4xl font-bold mb-4'>Quiz App</h1>
            {questions.length > 0 ? (
                showScore ? (
                    <div >
                        <h2 className='text-xl font-semibold mb-4'>
                            Your score : {score} / {questions.length}</h2>

                        <button className='bg-blue-500 text-white py-2 rounded-md hover:bg-blue-500'
                         onClick={() => window.location.reload()}>
                            Restart Quiz
                        </button>
                    </div>
                ):(
                   <div className='bg-slate-100 mx-52 rounded-md p-5 '>
                        <h2 className='text-xl font-semibold mb-4'>Question {Currentquestions + 1} / {questions.length}</h2>
                        <p className='text-lg  mb-4 font-semibold'> {questions[Currentquestions].question} </p>

                        <div className='grid grid-cols-2 gap-4 mx-44'>
                            {
                                questions[Currentquestions].incorrect_answers.map((Option , index) => (
                                    <button className='bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600' key={index} onClick={() => handleClick(Option)}>
                                        {Option}
                                    </button>
                                ))
                            }
                            <button className='bg-blue-bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600' onClick={() => handleClick(questions[Currentquestions].correct_answers)}>
                                {questions[Currentquestions].correct_answers}
                            </button>
                        </div>
                   </div>
                )
            ) :(
                <p>Loding...</p>
            )}
        </div>
    </div>
  )
}

export default Quiz