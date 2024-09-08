const form = document.getElementById('test-form');
const timerElement = document.getElementById('timer');
const timeoutModal = document.getElementById('timeout-modal');
const closeButton = document.querySelector('.close-button');
const questionsContainer = document.getElementById('questions-container');

// Test questions with different answer options
const questions = [
	{
			img: 'img/1.png', 
			answers: ["have a music lesson", "play basketball", "do gymnastics", "go toschool"],
			correct: "have a music lesson"
	},
	{
			img: 'img/2.png', 
			answers: ["no it is", "yes it is", "no it isn't", "yes it isn't"],
			correct: "no it isn't"
	},
	// Add more questions here
];

// Load questions dynamically
questions.forEach((question, index) => {
	const questionDiv = document.createElement('div');
	questionDiv.classList.add('question');

	const img = document.createElement('img');
	img.src = question.img;
	img.alt = `Question ${index + 1}`;

	questionDiv.appendChild(img);

	// Dynamically create radio buttons for each answer option
	question.answers.forEach((answer, i) => {
			const label = document.createElement('label');
			const input = document.createElement('input');
			const inputId = `question${index + 1}_answer${i}`; // Unique ID for each radio button
			input.type = 'radio';
			input.id = inputId;
			input.name = `question${index + 1}`; // Unique name per question
			input.value = answer; // The answer value
			input.required = true; // Mark each question as required

			label.setAttribute('for', inputId); // Associate label with radio button
			label.appendChild(document.createTextNode(answer)); // Display the answer text

			questionDiv.appendChild(input);
			questionDiv.appendChild(label);
	});

	questionsContainer.appendChild(questionDiv);
});

// Calculate score function
function calculateScore() {
	let score = 0;
	questions.forEach((question, index) => {
			const selectedAnswer = document.querySelector(`input[name="question${index + 1}"]:checked`);
			if (selectedAnswer && selectedAnswer.value === question.correct) {
					score++; // Increment score if the answer is correct
			}
	});
	return score;
}

// Countdown timer (20 minutes)
let timeLeft = 20 * 60;

const countdown = setInterval(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerElement.textContent = `Time Left: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    
    timeLeft--;

    if (timeLeft < 0) {
        clearInterval(countdown);
        handleTimeout();
    }
}, 1000);

function handleTimeout() {
    timeoutModal.classList.add('show'); // Show the modal
    form.style.display = 'none'; // Hide the form
    submitFormData();
}

function calculateScore() {
    let score = 0;
    questions.forEach((question, index) => {
        const selectedAnswer = document.querySelector(`input[name="question${index + 1}"]:checked`);
        if (selectedAnswer && selectedAnswer.value === question.correct) {
            score++;
        }
    });
    return score;
}

// function submitFormData() {
// 	const formData = new FormData(form); // Создаем FormData из формы

// 	const fullName = formData.get('fullName');
// 	const phone = formData.get('phone');
// 	const score = calculateScore();
// 	const timeSpent = 20 * 60 - timeLeft;

// 	// Создаем объект данных для отправки
// 	const data = {
// 			fullName,
// 			phone,
// 			score,
// 			timeSpent,
// 			date: new Date().toLocaleString(),
// 			answers: Array.from(formData.entries()).filter(([key]) => key.startsWith('question')),
// 	};

// 	// Отправляем запрос на сервер
// 	fetch('https://script.google.com/macros/s/AKfycbzKhJIryuBZUlYKL45lXlcAd1b8KyXOBEUcLcCmbaL_s-OUcWdg7QVq_62IDTr2NBpzZQ/exec', {
// 			method: 'POST',
// 			headers: {
// 					'Content-Type': 'application/json' // Заголовок для JSON
// 			},
// 			body: JSON.stringify(data) // Преобразуем объект в JSON
// 	})
// 	.then(response => {
// 		if (!response.ok) {
// 				throw new Error('Network response was not ok');
// 		}
// 		return response.json();
// })
// .then(data => {
// 		console.log('Success:', data);
// })
// .catch(error => {
// 		console.error('Error:', error);
// });
// }

function submitFormData() {
  const formData = new FormData(form);
  const fullName = formData.get('fullName');
  const phone = formData.get('phone');
  const score = calculateScore();
  const timeSpent = 20 * 60 - timeLeft;
  const data = {
    fullName,
    phone,
    score,
    timeSpent,
    date: new Date().toLocaleString(),
    answers: Array.from(formData.entries()).filter(([key]) => key.startsWith('question')),
  };

  fetch('https://script.google.com/macros/s/AKfycbzKhJIryuBZUlYKL45lXlcAd1b8KyXOBEUcLcCmbaL_s-OUcWdg7QVq_62IDTr2NBpzZQ/exec', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then(response => response.json())
    .then(result => {
      if (result.type === 'success') {
        // Показать модальное окно об успешной отправке
        const successModal = document.getElementById('success-modal');
        successModal.style.display = 'block';

        // Скрыть модальное окно по нажатию на кнопку закрытия
        const closeButton = successModal.querySelector('.close-button');
        closeButton.addEventListener('click', () => {
          successModal.style.display = 'none';
        });
      } else {
        console.error('Ошибка отправки:', result.errors);
      }
    })
    .catch(error => {
      console.error('Ошибка:', error);
    });
}

window.onclick = function(event) {
  const successModal = document.getElementById('success-modal');
  if (event.target == successModal) {
    successModal.style.display = 'none';
  }
};

// Close the modal when clicking on the close button
closeButton.addEventListener('click', () => {
	timeoutModal.classList.remove('show'); // Hide the modal
});

// Close the modal when clicking outside of the modal content
window.addEventListener('click', (event) => {
if (event.target == timeoutModal) {
	timeoutModal.classList.remove('show'); // Hide the modal
}
});

// Form submit event
form.addEventListener('submit', (event) => {
    event.preventDefault();
    clearInterval(countdown); // Stop timer
    submitFormData();
});
