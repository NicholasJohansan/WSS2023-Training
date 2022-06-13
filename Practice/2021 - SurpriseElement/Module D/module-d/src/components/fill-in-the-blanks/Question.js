import { forwardRef, useEffect, useImperativeHandle, useState } from "react";

const Question = forwardRef(({ question, number, calculateScore }, ref) => {

  const questionText = question['title'];
  const answer = question['answer'];

  useImperativeHandle(ref, () => {
    return {
      hasCorrectAnswer: () => {
        return inputValue === answer;
      },
      disable: () => {
        setInputDisabled(true);
      }
    };
  });

  const [inputValue, setInputValue] = useState('');
  const [inputDisabled, setInputDisabled] = useState(false);

  const onChange = (e) => {
    setInputValue(e.target.value.toLowerCase());
  };

  useEffect(() => {
    calculateScore();
  }, [inputValue]);

  return (
    <div className="question">
      <label htmlFor={ `qn-${number}` }>
        { number }) { questionText }
        <input
          id={ `qn-${number}` }
          type="text"
          value={ inputValue }
          disabled={ inputDisabled }
          onChange={ onChange } />
      </label>
    </div>
  );
});

export default Question;