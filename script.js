
const topicSelect = document.getElementById("topic");
const levelSelect = document.getElementById("level");

const generateBtn = document.getElementById("generateBtn");
const answerForm = document.getElementById("answerForm");
const answerInput = document.getElementById("answer");

const taskTitle = document.getElementById("taskTitle");
const problemText = document.getElementById("problem");
const levelBadge = document.getElementById("levelBadge");

const taskPanel = document.getElementById("taskPanel");
const feedbackBox = document.getElementById("feedback");
const hintBox = document.getElementById("hintBox");
const solutionBox = document.getElementById("solutionBox");

const hintBtn = document.getElementById("hintBtn");
const solutionBtn = document.getElementById("solutionBtn");

function showMessage(element, message) {
  element.textContent = message;
  element.hidden = false;
}
const tasks = {
  area: [
    {
      title: "Rectangle area",
      problem: "A rectangle has length 12 cm and width 5 cm. Find its area.",
      answer: "60",
      hint: "Multiply the length by the width.",
      solution: "Area = length × width = 12 × 5 = 60 cm²."
    },
    {
      title: "Triangle area",
      problem: "A triangle has a base of 10 cm and a height of 7 cm. Find its area.",
      answer: "35",
      hint: "Use A = (base × height) / 2.",
      solution: "Area = (10 × 7) / 2 = 35 cm²."
    },
    {
      title: "Circle area",
      problem: "Find the area of a circle with radius 3 cm. Use π ≈ 3.14.",
      answer: "28.26",
      hint: "Use A = πr².",
      solution: "Area = 3.14 × 3² = 3.14 × 9 = 28.26 cm²."
    }
  ],
  volume: [
    {
      title: "Rectangular prism volume",
      problem: "A box is 4 cm long, 3 cm wide and 5 cm high. Find its volume.",
      answer: "60",
      hint: "Multiply length × width × height.",
      solution: "Volume = 4 × 3 × 5 = 60 cm³."
    },
    {
      title: "Cube volume",
      problem: "A cube has an edge of 6 cm. Find its volume.",
      answer: "216",
      hint: "Use V = a³.",
      solution: "Volume = 6 × 6 × 6 = 216 cm³."
    },
    {
      title: "Cylinder volume",
      problem: "A cylinder has radius 2 cm and height 5 cm. Find its volume using π ≈ 3.14.",
      answer: "62.8",
      hint: "Use V = πr²h.",
      solution: "Volume = 3.14 × 2² × 5 = 62.8 cm³."
    }
  ],
  mixed: [
    {
      title: "Garden area",
      problem: "A square garden has a side of 9 m. Find its area.",
      answer: "81",
      hint: "For a square, area = side × side.",
      solution: "Area = 9 × 9 = 81 m²."
    },
    {
      title: "Fish tank volume",
      problem: "A fish tank is 8 dm long, 3 dm wide and 4 dm high. Find its volume.",
      answer: "96",
      hint: "Multiply all three dimensions.",
      solution: "Volume = 8 × 3 × 4 = 96 dm³."
    },
    {
      title: "Triangle challenge",
      problem: "A triangle has a base of 14 cm and a height of 9 cm. Find its area.",
      answer: "63",
      hint: "Multiply the base by the height, then divide by 2.",
      solution: "Area = (14 × 9) / 2 = 63 cm²."
    }
  ]
};

let currentTask = null;


function setBusy(isBusy) {
  generateBtn.disabled = isBusy;
  hintBtn.disabled = isBusy;
  solutionBtn.disabled = isBusy;
}

function setStatus(message) {
  const statusElement = document.querySelector(
    "#statusMessage, #status, .status-message"
  );

  if (statusElement) {
    statusElement.textContent = message;
  }
}

function getTaskList() {
  const topic = topicSelect.value.toLowerCase();

  if (topic.includes("area")) return tasks.area;
  if (topic.includes("volume")) return tasks.volume;
  return tasks.mixed;
}

function showTask(task) {
  currentTask = task;
  taskTitle.textContent = task.title;
  problemText.textContent = task.problem;
  levelBadge.textContent =
    levelSelect.options[levelSelect.selectedIndex].text;

  taskPanel.hidden = false;
  feedbackBox.hidden = true;
  hintBox.hidden = true;
  solutionBox.hidden = true;
  answerInput.value = "";

  setStatus("Your task is ready. Take your time!");
  taskPanel.scrollIntoView({ behavior: "smooth", block: "start" });
}

generateBtn.addEventListener("click", () => {
  setBusy(true);
  generateBtn.textContent = "Generating...";
  setStatus("Choosing a geometry task...");

  const list = getTaskList();
  const task = list[Math.floor(Math.random() * list.length)];

  showTask(task);

  setBusy(false);
  generateBtn.textContent = "Generate a task ✨";
});

answerForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!currentTask) {
    showMessage(feedbackBox, "Please generate a task first.");
    return;
  }

  const userAnswer = Number(answerInput.value.trim());

  if (answerInput.value.trim() === "" || !Number.isFinite(userAnswer)) {
    showMessage(feedbackBox, "Please enter a valid number.");
    return;
  }

  const correctAnswer = Number(currentTask.answer);

  if (Math.abs(userAnswer - correctAnswer) < 0.02) {
    showMessage(feedbackBox, "Correct! Great job! 🎉");
  } else {
    showMessage(feedbackBox, "Not quite. Try again or ask for a hint.");
  }
});

hintBtn.addEventListener("click", () => {
  if (!currentTask) {
    showMessage(hintBox, "Please generate a task first.");
    return;
  }

  showMessage(hintBox, currentTask.hint);
});

solutionBtn.addEventListener("click", () => {
  if (!currentTask) {
    showMessage(solutionBox, "Please generate a task first.");
    return;
  }

  showMessage(solutionBox, currentTask.solution);
});
