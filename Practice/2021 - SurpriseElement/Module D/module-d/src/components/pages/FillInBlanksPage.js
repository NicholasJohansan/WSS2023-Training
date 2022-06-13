import { createRef, useEffect, useState, useRef } from 'react';
import '../../styles/fib-page.css'
import Question from '../fill-in-the-blanks/Question';

const FillInBlanksPage = ({ abortQuiz, questions }) => {

  const [seconds, setSeconds] = useState(60);
  const [score, setScore] = useState(0);

  const questionRefs = useRef([]);
  questionRefs.current = questions.map((qn, index) => questionRefs.current[index] ?? createRef());

  useEffect(() => {
    const tickingInterval = setInterval(() => {
      if (seconds === 0) {
        clearInterval(tickingInterval);
        questionRefs.current.forEach(ref => {
          ref.current.disable();
        });
      } else {
        setSeconds(seconds - 1);
      }
    }, 1000);
    return () => clearInterval(tickingInterval);
  });

  const calculateScore = () => {
    setScore(questionRefs.current.map(ref => ref.current.hasCorrectAnswer()).filter(correct => correct).length);
  }

  return (
    <div id="fib-page">
      <header onClick={ abortQuiz }>
        The Interactive Studio
      </header>
      <div id="fib-main">
        <div className="qn-header">
          <span>Time left: { seconds } seconds</span>
          <span>Score: { score }/{ questions.length }</span>
        </div>
        <div className="questions">
          { questions.map((question, index) => {
            return (
              <Question
                question={ question }
                number={ index+1 }
                ref={ questionRefs.current[index] }
                calculateScore={ calculateScore } />
            );
          }) }
        </div>
      </div>
    </div>
  );
};

export default FillInBlanksPage;