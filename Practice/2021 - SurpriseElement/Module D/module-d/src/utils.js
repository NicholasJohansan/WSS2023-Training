
export const select5Random = (questions) => {
  const randomQuestions = [];
  for (let i = 0; i < 5; i++) {
    let randomIndex = Math.floor(Math.random() * questions.length);
    randomQuestions.push(questions.splice(randomIndex, 1)[0]);
  }
  return [...randomQuestions];
};

export const getQuestionsByCategory = (questions, category) => {
  return questions.length !== 0 ? questions.filter(questions => {
    return questions['category_title'] === category;
  })[0]['questions'] : [];
};

export const randomize = (array) => {
  const newArray = [];
  while (array.length > 0) {
    newArray.push(array.splice(Math.floor(Math.random() * array.length), 1)[0]);
  }
  console.log(newArray);
  return newArray;
};