(() => {
  const quizRoot = document.querySelector('[data-quiz]');
  if (!quizRoot) return;

  const progressEl = quizRoot.querySelector('[data-quiz-progress]');
  const scoreEl = quizRoot.querySelector('[data-quiz-score]');
  const questionEl = quizRoot.querySelector('[data-quiz-question]');
  const optionsEl = quizRoot.querySelector('[data-quiz-options]');
  const submitButton = quizRoot.querySelector('[data-quiz-submit]');
  const feedbackEl = quizRoot.querySelector('[data-quiz-feedback]');
  const resultPanel = quizRoot.querySelector('[data-quiz-result]');
  const resultText = quizRoot.querySelector('[data-quiz-result-text]');
  const restartButton = quizRoot.querySelector('[data-quiz-restart]');
  const form = quizRoot.querySelector('[data-quiz-form]');

  let questions = [];
  let currentIndex = 0;
  let score = 0;
  let answered = false;

  const DATA_URL = 'assets/data/quiz.json';

  fetch(DATA_URL)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to load quiz data');
      }
      return response.json();
    })
    .then((data) => {
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('Quiz data is empty');
      }
      questions = data;
      currentIndex = 0;
      score = 0;
      resultPanel.hidden = true;
      form.hidden = false;
      renderQuestion();
      updateStatus();
    })
    .catch(() => {
      progressEl.textContent = 'クイズを読み込めませんでした。後でもう一度お試しください。';
      questionEl.textContent = 'データが読み込めませんでした。';
      scoreEl.textContent = '';
      submitButton.disabled = true;
    });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!questions.length) return;

    const selected = form.querySelector('input[name="quiz-option"]:checked');
    if (!selected) return;

    if (!answered) {
      checkAnswer(selected.value);
    } else {
      goToNextStep();
    }
  });

  restartButton.addEventListener('click', () => {
    score = 0;
    currentIndex = 0;
    answered = false;
    resultPanel.hidden = true;
    form.hidden = false;
    renderQuestion();
    updateStatus();
  });

  function renderQuestion() {
    const question = questions[currentIndex];
    questionEl.textContent = question.question;
    optionsEl.innerHTML = '';

    question.options.forEach((option, index) => {
      const optionId = `quiz-option-${currentIndex}-${index}`;
      const wrapper = document.createElement('label');
      wrapper.className = 'quiz-option';

      const input = document.createElement('input');
      input.type = 'radio';
      input.name = 'quiz-option';
      input.value = option.value;
      input.id = optionId;
      input.required = true;

      input.addEventListener('change', () => {
        submitButton.disabled = false;
      });

      const text = document.createElement('span');
      text.textContent = option.label;

      wrapper.append(input, text);
      optionsEl.append(wrapper);
    });

    answered = false;
    submitButton.disabled = true;
    submitButton.textContent = '解答する';
    feedbackEl.textContent = '';
  }

  function checkAnswer(selectedValue) {
    const question = questions[currentIndex];
    const isCorrect = question.answer === selectedValue;

    const inputs = form.querySelectorAll('input[name="quiz-option"]');
    inputs.forEach((input) => {
      input.disabled = true;
      const parent = input.parentElement;
      if (!parent) return;
      parent.classList.remove('quiz-option--correct', 'quiz-option--incorrect');
      parent.classList.add('quiz-option--locked');
      if (input.value === question.answer) {
        parent.classList.add('quiz-option--correct');
      } else if (input.checked) {
        parent.classList.add('quiz-option--incorrect');
      }
    });

    if (isCorrect) {
      score += 1;
      feedbackEl.textContent = '正解です！';
    } else {
      feedbackEl.textContent = `正解は「${getAnswerLabel(question)}」でした。`;
    }

    answered = true;
    submitButton.textContent = currentIndex === questions.length - 1 ? '結果を見る' : '次の問題へ';
    updateStatus();
  }

  function getAnswerLabel(question) {
    const correctOption = question.options.find((option) => option.value === question.answer);
    return correctOption ? correctOption.label : '';
  }

  function goToNextStep() {
    if (currentIndex >= questions.length - 1) {
      showResult();
      return;
    }

    currentIndex += 1;
    renderQuestion();
    updateStatus();
  }

  function showResult() {
    form.hidden = true;
    resultPanel.hidden = false;
    resultText.textContent = `全${questions.length}問中${score}問正解でした！`;
  }

  function updateStatus() {
    if (questions.length) {
      progressEl.textContent = `問題 ${currentIndex + 1} / ${questions.length}`;
      scoreEl.textContent = `スコア: ${score}`;
    }
  }
})();
