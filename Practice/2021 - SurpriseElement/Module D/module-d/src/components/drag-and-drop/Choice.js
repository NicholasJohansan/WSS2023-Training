import { useEffect, useImperativeHandle, useRef, useState } from "react";

const Choice = ({ imagesBaseUrl, image, onChoiceDragStart, className=null }) => {

  const onDragStart = (e) => {
    e.dataTransfer.setData('choice', image);
    e.dataTransfer.dropEffect = 'move';
    onChoiceDragStart();
  };

  return (
    <img
      className={ className }
      onDragStart={ onDragStart }
      draggable="true"
      src={ imagesBaseUrl + image } />
  );
};

export default Choice;