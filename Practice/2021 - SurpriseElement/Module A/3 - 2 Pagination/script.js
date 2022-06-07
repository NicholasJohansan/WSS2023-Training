const noOfPageInput = document.querySelector("#input > input");
const prevButton = document.querySelector("#left");
const nextButton = document.querySelector("#right");
let numOfPages = 10;
let currentPage = 1;

const pageIndicators = document.querySelectorAll('.page');

const numPagesChanged = () => {
  numOfPages = noOfPageInput.value;
  currentPage = 1;
  pageChanged();
};

const disableButton = (button) => {
  button.style.setProperty('cursor', 'not-allowed');
}

const enableButton = (button) => {
  button.style.setProperty('cursor', 'pointer');
}

const setInitialPageIndicators = () => {
  pageIndicators[0].innerText = '1';
  pageIndicators[1].innerText = '2';
  pageIndicators[2].innerText = '3';
  pageIndicators[3].innerText = '4';
  pageIndicators[4].innerText = '...';
  pageIndicators[5].innerText = numOfPages;
}

const setFinalPageIndicators = () => {
  pageIndicators[0].innerText = numOfPages-5;
  pageIndicators[1].innerText = numOfPages-4;
  pageIndicators[2].innerText = numOfPages-3;
  pageIndicators[3].innerText = numOfPages-2;
  pageIndicators[4].innerText = numOfPages-1;
  pageIndicators[5].innerText = numOfPages;
}

const setMidPageIndicators = () => {
  pageIndicators[0].innerText = currentPage-2;
  pageIndicators[1].innerText = currentPage-1;
  pageIndicators[2].innerText = currentPage;
  pageIndicators[3].innerText = currentPage+1;
  pageIndicators[4].innerText = '...';
  pageIndicators[5].innerText = numOfPages;
}

const pageChanged = () => {
  // Reset Page Indicators
  Array.from(pageIndicators).forEach(pageIndicator => {
    pageIndicator.classList.remove('active');
    pageIndicators[0].innerText = '1';
    pageIndicators[1].innerText = '2';
    pageIndicators[2].innerText = '3';
    pageIndicators[3].innerText = '4';
    pageIndicators[4].innerText = '...';
    pageIndicators[5].innerText = numOfPages;
  });
  // Change Page Indicators
  if (currentPage <= 3) {
    setInitialPageIndicators();
    pageIndicators[currentPage-1].classList.add('active');
  } else if (currentPage >= numOfPages-3) {
    setFinalPageIndicators();
    pageIndicators[5-(numOfPages-currentPage)].classList.add('active');
  } else {
    setMidPageIndicators();
    pageIndicators[2].classList.add('active');
  }
  // Enable/Disable Buttons
  if (currentPage === 1) {
    disableButton(prevButton);
  } else {
    enableButton(prevButton);
  }
  if (currentPage === Number.parseInt(numOfPages)) {
    disableButton(nextButton);
  } else {
    enableButton(nextButton);
  }
}

nextButton.addEventListener('click', (event) => {
  if (currentPage === Number.parseInt(numOfPages)) return;
  currentPage += 1;
  pageChanged();
});

prevButton.addEventListener('click', (event) => {
  if (currentPage === 1) return;
  currentPage -= 1;
  pageChanged();
});



pageChanged();