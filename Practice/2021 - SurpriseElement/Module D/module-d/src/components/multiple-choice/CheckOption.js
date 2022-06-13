
import { forwardRef, useImperativeHandle, useState } from "react";

const CheckOption = forwardRef(({ index, option, onChecked }, ref) => {

  const [noticeClass, setNoticeClass] = useState('hidden');
  const [disabled, setDisabled] = useState(false);
  const [checked, setChecked] = useState(false);

  useImperativeHandle(ref, () => {
    return {
      showNotice: (correctOption) => {
        setNoticeClass(correctOption.includes(option) ? 'correct' : 'wrong');
        setTimeout(() => {
          setNoticeClass('hidden');
        }, 2000);
      },
      enable: () => {
        setDisabled(false);
      },
      disable: () => {
        setDisabled(true);
      },
      uncheck: () => {
        setChecked(false);
      },
      check: () => {
        setChecked(true);
      }
    };
  })

  return (
    <label htmlFor={ `mcq-choice-${index}` }>
      <input
        type='checkbox'
        id={ `mcq-choice-${index}` }
        name='mcq' value={ option }
        onChange={ onChecked }
        disabled={ disabled }
        checked={ checked }>
      </input>
      { 'abcdefghijklmnopqrstuvwxyz'[index] }) { option }
      <span className={ noticeClass }></span>
    </label>
  );
});

export default CheckOption;