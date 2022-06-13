
import '../../styles/dnd-page.css';
import { createRef, useEffect, useRef, useState } from 'react';

import Box from '../drag-and-drop/Box';
import Choice from '../drag-and-drop/Choice';

import { randomize } from '../../utils';

const DragAndDropPage = ({ abortQuiz, questions }) => {

  const [submitDisabled, setSubmitDisabled] = useState(false);
  const [nextDisabled, setNextDisabled] = useState(true);

  const [score, setScore] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [choiceBoxes, setChoiceBoxes] = useState([]);
  const [choiceImages, setChoiceImages] = useState([]);
  const [imagesBaseUrl, setImagesBaseUrl] = useState('');

  const [noticeClass, setNoticeClass] = useState('');

  const choiceBoxRefs = useRef({});
  choiceBoxRefs.current = Object.fromEntries(choiceBoxes.map(choice => [choice, choiceBoxRefs.current[choice] ?? createRef()]));

  const setUpQuestion = () => {
    const question = questions[questionIndex];

    if (question) {
      setChoiceBoxes(randomize([...question['boxes']]));
      setChoiceImages(randomize([...question['images']]));
      setImagesBaseUrl(question['base_url']);
      console.log(choiceImages);

      setNextDisabled(true);
      setSubmitDisabled(false);
    }
  };

  const findAndRemoveChoice = (choice) => {
    Object.values(choiceBoxRefs.current).forEach(ref => {
      ref.current.setContents([...ref.current.getContents()].filter(content => content !== choice));
    });
    setChoiceImages([...choiceImages].filter(choiceImage => choiceImage !== choice));
  };

  const onChoiceDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const onChoiceDropped = (e) => {
    e.preventDefault();
    window.removeEventListener('drop', onChoiceDropped);
    window.removeEventListener('dragover', onChoiceDragOver);

    if (e.toElement.classList.contains('box') || e.toElement.tagName === 'IMG') {
      return;
    }
    const choice = e.dataTransfer.getData('choice');
    findAndRemoveChoice(choice);
    setChoiceImages([choice, ...choiceImages]);
  };

  const onChoiceDragStart = () => {
    window.addEventListener('drop', onChoiceDropped);
    window.addEventListener('dragover', onChoiceDragOver);
  };

  const nextQuestion = () => {
    setQuestionIndex(questionIndex + 1);
  };

  const submitQuestion = () => {
    const isCorrect = Object.values(choiceBoxRefs.current).map(ref => {
      return ref.current.hasCorrectChoice();
    }).every(v => v);

    if (isCorrect) {
      setScore(score + 1);
      setNoticeClass('notice correct');
    } else {
      setNoticeClass('notice wrong');
    }

    setSubmitDisabled(true);
    
    setTimeout(() => {
      setNextDisabled(false);
      setNoticeClass('');
    }, 3000)

  };

  useEffect(() => {
    setUpQuestion();
  }, [questionIndex]);

  return (
    <div id="dnd-page">
      <header onClick={ abortQuiz }>
        The Interactive Studio
      </header>
      <div id='dnd-main'>
        <div className='header'>
          <span className={ noticeClass }></span>
          <span className='score'>Score: { score }/{ questions.length } </span>
        </div>
        <div className='boxes'>
          { choiceBoxes.map(choiceName =>
            <Box 
              key={ choiceName }
              boxName={ choiceName }
              imagesBaseUrl={ imagesBaseUrl }
              ref={ choiceBoxRefs.current[choiceName] }
              onChoiceDragStart={ onChoiceDragStart }
              findAndRemoveChoice={ findAndRemoveChoice } />
          ) }
        </div>
        <div className='choices'>
          { choiceImages.map(image =>
            <Choice
              key={ image }
              imagesBaseUrl={ imagesBaseUrl }
              image={ image }
              onChoiceDragStart={ () => {} } />
          ) } 
        </div>
        <div className='qn-buttons'>
          <button disabled={submitDisabled} onClick={submitQuestion}>Submit</button>
          <button disabled={nextDisabled} onClick={nextQuestion}>Next</button>
        </div>
      </div>
    </div>
  );
};

export default DragAndDropPage;