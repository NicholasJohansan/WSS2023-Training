import './styles/App.css';

import MainMenu from './components/pages/MainMenu';
import MultipleChoicePage from './components/pages/MultipleChoicePage';

import { useEffect, useState } from 'react';
import DragAndDropPage from './components/pages/DragAndDropPage';
import FillInBlanksPage from './components/pages/FillInBlanksPage';

import { select5Random, getQuestionsByCategory } from './utils';

function App() {
  const [appState, setAppState] = useState('/');
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    (async () => {
      const response = await fetch('https://filehost.netlify.app/data/sample_data.json');
      const json = await response.json();
      setQuestions(json);
    })();
  }, []);

  const abortQuiz = () => {
    const wantsExit = window.confirm('Do you want to exit the quiz?');
    if (wantsExit) {
      setAppState('/');
    }
  };

  const multipleChoiceQuestions = getQuestionsByCategory(questions, 'Multiple Choice Questions');
  const dragAndDropQuestions = getQuestionsByCategory(questions, 'Drag & Drop Questions');
  const fillInBlanksQuestions = getQuestionsByCategory(questions, 'Fill-in-the-blanks Questions');

  return (
    <div className="app">
      { appState === '/' && <MainMenu setAppState={setAppState} /> }
      { appState === '/mcq' && <MultipleChoicePage abortQuiz={ abortQuiz } questions={ select5Random([...multipleChoiceQuestions]) } /> }
      { appState === '/dnd' && <DragAndDropPage abortQuiz={ abortQuiz } questions={ select5Random([...dragAndDropQuestions]) } /> }
      { appState === '/fib' && <FillInBlanksPage abortQuiz={ abortQuiz } questions={ select5Random([...fillInBlanksQuestions]) } />}
    </div>
  );
}

export default App;
