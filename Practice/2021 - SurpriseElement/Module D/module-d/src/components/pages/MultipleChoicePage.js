import { useEffect, useState, useRef, createRef } from 'react';
import '../../styles/mcq-page.css'

import RadioOption from '../multiple-choice/RadioOption';
import CheckOption from '../multiple-choice/CheckOption';

import { randomize } from '../../utils';

const MultipleChoicePage = ({ abortQuiz, questions }) => {

  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [nextDisabled, setNextDisabled] = useState(true);

  const [chosenOption, setChosenOption] = useState(null);
  const [score, setScore] = useState(0);

  const [questionType, setQuestionType] = useState('mcq');
  const [questionNumber, setQuestionNumber] = useState(1);
  const [questionText, setQuestionText] = useState(null);
  const [options, setOptions] = useState([]);
  const [correctOption, setCorrectOption] = useState(null);

  const optionRefs = useRef({});
  optionRefs.current = Object.fromEntries(options.map(option => [option, optionRefs.current[option] ?? createRef()]));

  const onOptionChecked = (e) => {
    const option = e.target.value;
    if (questionType === 'mcq') {
      setChosenOption(option);
      Object.values(optionRefs.current).forEach(ref => {
        ref.current.uncheck();
      })
      optionRefs.current[option].current.check();
    } else if (questionType === 'msq') {
      const checked = e.target.checked;
      if (checked) {
        optionRefs.current[option].current.check();
        setChosenOption([...chosenOption, option]);
      } else {
        optionRefs.current[option].current.uncheck();
        setChosenOption([...chosenOption].filter(opt => opt !== option));
      }
    }
  };

  const setUpQuestion = () => {
    const question = questions[questionNumber-1];
    console.info('qn', question);

    if (question) {

      let answer = question['answer'];
      const options = question['options'];

      if (answer instanceof Array) {
        setQuestionType('msq');
        setChosenOption([]);
        answer = answer.map(index => options[Number.parseInt(index)-1]);
      } else {
        setQuestionType('mcq');
        setChosenOption('');
        answer = options[Number.parseInt(answer)-1];
      }
      
      // console.info('options', question);
      setOptions(randomize([...options]));
      // console.log(options);
      
      setQuestionText(question['title']);
      setCorrectOption(answer);
  
      Object.values(optionRefs.current).forEach((optionRef) => {
        optionRef.current.enable();
        optionRef.current.uncheck();
      })
  
      setSubmitDisabled(false);
      setNextDisabled(true);
    }
  };

  const submitQuestion = () => {
    if (questionType === 'mcq') {
      if (chosenOption !== '') {      
        optionRefs.current[chosenOption].current.showNotice(correctOption);
      }

      if (chosenOption === correctOption) {
        setScore(score + 1);
      }
    } else if (questionType === 'msq') {
      const optionsWithNoticeShown = [];

      if (chosenOption.length > 0) {
        chosenOption.forEach(option => {
          optionsWithNoticeShown.push(option);
          optionRefs.current[option].current.showNotice(correctOption);
        });
      }

      correctOption.filter(option => !(optionsWithNoticeShown.includes(option))).forEach(option => {
        // Force notice to say wrong because these options are correct but were not selected
        optionRefs.current[option].current.showNotice([]);
      });
      console.info(chosenOption, correctOption);

      if (chosenOption.length !== 0 &&
          chosenOption.length === correctOption.length &&
          chosenOption.map(option => correctOption.includes(option)).every(v => v)) {
        setScore(score + 1);
      }
    }

    Object.values(optionRefs.current).forEach((optionRef) => {
      optionRef.current.disable();
    })

    setSubmitDisabled(true);
    setTimeout(() => {
      if (questionNumber < questions.length) {
        setNextDisabled(false);
      }
    }, 2000);
  }

  const nextQuestion = () => {
    setQuestionNumber(questionNumber + 1);
  };

  useEffect(() => {
    setUpQuestion();

  }, [questionNumber]);

  return (
    <div id="mcq-page">
      <header onClick={ abortQuiz }>
        The Interactive Studio
      </header>
      <div id='mcq-main'>
        <div className='qn-header'>
          <span>{ questionNumber }. { questionText }</span>
          <span>Score: { score }/{ questions.length }</span>
        </div>
        <div className='qn-choices'>
          { options.map((option, index) => {
            return (
              questionType === 'mcq'
              ? <RadioOption
                index={index}
                onChecked={onOptionChecked}
                option={option}
                key={option}
                ref={optionRefs.current[option]} />
              : <CheckOption
                index={index}
                onChecked={onOptionChecked}
                option={option}
                key={option}
                ref={optionRefs.current[option]} />
            );
          }) }
        </div>
        <div className='qn-buttons'>
          <button disabled={submitDisabled} onClick={submitQuestion}>Submit</button>
          <button disabled={nextDisabled} onClick={nextQuestion}>Next</button>
        </div>
      </div>
    </div>
  );
};

export default MultipleChoicePage;