import { forwardRef, useImperativeHandle, useState } from "react";

import Choice from "./Choice";

const Box = forwardRef(({ boxName, imagesBaseUrl, onChoiceDragStart, findAndRemoveChoice }, ref) => {

  const [contents, setContents] = useState([]);

  useImperativeHandle(ref, () => {
    return {
      getContents: () => {
        return contents;
      },
      setContents: (content) => {
        setContents(content);
      },
      hasCorrectChoice: () => {
        return contents.length === 1 && contents[0].slice(0, -4).toLowerCase() === boxName.toLowerCase();
      }
    };
  });

  const onDrop = (e) => {
    e.preventDefault();
    if (contents.length === 2) {
      return;
    }
    const choice = e.dataTransfer.getData('choice');
    if (contents.includes(choice)) {
      return;
    }
    findAndRemoveChoice(choice);
    setContents([...contents, choice]);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }

  return (
    <div className='box-area'>
      <span className='label'>{ boxName.toLowerCase() }</span>
      <div
        className={ 'box' + (contents.length === 0 ? '' : ' green-border') }
        onDrop={ onDrop }
        onDragOver={ onDragOver }>
        { contents.map(choice => 
          <Choice
            imagesBaseUrl={ imagesBaseUrl }
            key={ choice }
            className={ contents.length === 1 ? 'single' : 'double' }
            image={ choice }
            onChoiceDragStart={ onChoiceDragStart } />
        ) }
      </div>
    </div>
  );
});

export default Box;