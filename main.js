// select element

let countSpan = document.querySelector(".count span");
let mySpans = document.querySelector(".spans");
let quiz_area = document.querySelector(".quiz_area");
let myAnswers_area = document.querySelector(".answers_area");
let submitButton = document.querySelector("button");
let bullets = document.querySelector(".bullets");
let results = document.querySelector(".quiz-container .result");
let onloadBtn = document.querySelector(".onload");
let countDow = document.querySelector(".count_down");
let currentIndex = 0;
let rightAnswer = 0;
let countDownInterval;

function getDataFromJson() {
  let myRequest = new XMLHttpRequest();

  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let myJsonQuestion = JSON.parse(this.responseText);
      let countQuestion = myJsonQuestion.length;
      count(countQuestion);
      addQuestionData(myJsonQuestion[currentIndex], countQuestion);
      // count down
      countDown(30, countQuestion);
      submitButton.addEventListener("click", () => {
        // get the right answer
        let theRightAnswer = myJsonQuestion[currentIndex].right_answer;
        // incress the current
        currentIndex++;
        // check the answers
        checkAnswers(theRightAnswer, countQuestion);
        quiz_area.innerHTML = "";
        myAnswers_area.innerHTML = "";
        addQuestionData(myJsonQuestion[currentIndex], countQuestion);

        // function Handel class spans

        showBullets();
        // start count down*
        clearInterval(countDownInterval);
        countDown(30, countQuestion);

        // show result function
        showResult(countQuestion);
      });
    }
  };
  myRequest.open("GET", "question.json", true);
  myRequest.send();
}
getDataFromJson();

function count(num) {
  countSpan.innerHTML = num;

  // create spans

  for (let i = 0; i < num; i++) {
    span = document.createElement("span");

    mySpans.appendChild(span);

    if (i === 0) {
      span.className = "active";
    }
  }
}

function addQuestionData(data, count) {
  if (currentIndex < count) {
    // creat h2 title
    let head_2 = document.createElement("h2");
    let head_Question = document.createTextNode(data.question);

    head_2.appendChild(head_Question);
    quiz_area.appendChild(head_2);

    // CREAT ANSWERS
    for (let i = 0; i < 4; i++) {
      // creat Element
      let myDiv = document.createElement("div");
      let myInput = document.createElement("input");
      let myLabel = document.createElement("label");
      let labelContent = document.createTextNode(data[`answer_${i + 1}`]);

      // Label data
      myLabel.appendChild(labelContent);
      myLabel.style.marginLeft = "5px";
      myLabel.htmlFor = "answer_" + `${i + 1}`;

      // input data
      myInput.type = "radio";
      myInput.name = "answer";
      myInput.id = "answer_" + `${i + 1}`;
      myInput.dataset.answer = data[`answer_${i + 1}`];
      myDiv.appendChild(myInput);
      myDiv.className = "answer";

      // append
      myDiv.appendChild(myLabel);
      myAnswers_area.appendChild(myDiv);

      if (i === 0) {
        myInput.checked = true;
      }
    }
  }
}

function checkAnswers(rightAnsw, count) {
  let answers = document.getElementsByName("answer");
  let theChoosenAnswer;

  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theChoosenAnswer = answers[i].dataset.answer;
    }
  }
  console.log(`The right answer ${rightAnsw}`);
  console.log(theChoosenAnswer);
  if (rightAnsw === theChoosenAnswer) {
    rightAnswer++;
    console.log("good");
  }
}

function showBullets() {
  let mySpans = document.querySelectorAll(".spans span");
  let mySpansArray = Array.from(mySpans);
  mySpansArray.forEach((span, index) => {
    if (currentIndex === index) {
      span.className = "active";
    }
  });
}

function showResult(count) {
  let theResult;
  if (currentIndex === count) {
    quiz_area.remove();
    myAnswers_area.remove();
    submitButton.remove();
    bullets.remove();

    if (rightAnswer > count / 2 && rightAnswer < count) {
      theResult = ` <span class="medium">Good</span> You answered ${rightAnswer} from ${count}`;
    } else if (rightAnswer === count) {
      theResult = ` <span class="perfect">Perfect</span> You answered ${rightAnswer} from ${count}`;
    } else {
      theResult = ` <span class="bad">Bad</span> You answered ${rightAnswer} from ${count}`;
    }
    results.innerHTML = theResult;
    results.style.marginBottom = "10px";
  }
}

function countDown(duration, count) {
  if (currentIndex < count) {
    let minute, second;
    countDownInterval = setInterval(function () {
      minute = parseInt(duration / 60);
      second = parseInt(duration % 60);
      minute = minute < 10 ? `0${minute}` : minute;
      second = second < 10 ? `0${second}` : second;
      countDow.innerHTML = `<span>${minute}</span>:<span>${second}</span>`;

      if (--duration < 0) {
        clearInterval(countDownInterval);
        submitButton.click();
      }
    }, 1000);
  }
}

