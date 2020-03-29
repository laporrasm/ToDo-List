let incompleteTasks = document.querySelector(".incomplete-tasks");
let completedTasks = document.querySelector(".completed-tasks");

function readTasks() {
	// fetch("http://localhost:3000/tasks")
	// 	.then(response => response.json())
	// 	.then(tasks =>
	// 		tasks.forEach(taskObject => {
	// 			let task = createCard(taskObject);

	// 			if (taskObject.done) completedTasks.appendChild(task);
	// 			else incompleteTasks.appendChild(task);
	// 		})
	// 	);

	completedTasks.innerHTML = "";
	incompleteTasks.innerHTML = "";

	if (localStorage.getItem("tasksArray")) {
		JSON.parse(localStorage.getItem("tasksArray")).forEach(taskObject => {
			let task = createCard(taskObject);

			if (taskObject.done) completedTasks.appendChild(task);
			else incompleteTasks.appendChild(task);
		});
	}

	else {
		localStorage.setItem("tasksArray", JSON.stringify([]));
	}
}

function createCard(taskObject) {
	//Creates HTML element
	let task = document.createElement("div");
	//Adds the "task" class for CSS styling
	task.classList.add("task");

	//Adds child elements
	task.innerHTML = `
		<div class="task__inner">
			<div class="task__doneButton">
				<span class="task__doneButton-filler"></span>
			</div>
			<p class="task__text">${taskObject.text}</p>
			<div class="task__deleteButton">
				<i class="fas fa-times-circle"></i>
			</div>
		</div>
	`;

	// Adds the done event
	task
		.querySelector(".task__doneButton")
		.addEventListener("click", function(event) {
			editTask(taskObject)
		});

	// Adds the delete event
	task
		.querySelector(".task__deleteButton")
		.addEventListener("click", function(event) {
			if (confirm("Are you sure you want to delete this task?"))
				deleteTask(taskObject);
		});

	return task;
}

function editTask(taskObject) {
	// fetch(`http://localhost:3000/tasks/${taskObject.id}`, {
	// 	method: "PATCH",
	// 	body: JSON.stringify({
	// 		done: !taskObject.done
	// 	}),
	// 	headers: {
	// 		"Content-type": "application/json; charset=UTF-8"
	// 	}
	// })
	// 	.then(response => response.json())
	// 	.then(editedTask => console.log(editedTask));

	let tasksArray = JSON.parse(localStorage.getItem("tasksArray"));

	console.log(taskObject.id)

	tasksArray[getPosition(taskObject.id)].done = !taskObject.done;

	localStorage.setItem("tasksArray", JSON.stringify(tasksArray));

	readTasks();
}

function deleteTask(taskObject) {
	// fetch(`http://localhost:3000/tasks/${taskObject.id}`, {
	// 	method: "DELETE"
	// });

	let tasksArray = JSON.parse(localStorage.getItem("tasksArray"));

	console.log(tasksArray.splice(getPosition(taskObject.id), 1));

	localStorage.setItem("tasksArray", JSON.stringify(tasksArray));

	readTasks();
}

function addTask(inputValue) {
	// fetch("http://localhost:3000/tasks", {
	// 	method: "POST",
	// 	body: JSON.stringify({
	// 		text: inputValue,
	// 		done: false
	// 	}),
	// 	headers: {
	// 		"Content-type": "application/json; charset=UTF-8"
	// 	}
	// })
	// 	.then(response => response.json())
	// 	.then(addedTask => console.log(addedTask));

	let tasksArray = JSON.parse(localStorage.getItem("tasksArray"));
	tasksArray.push({
		id: getId(),
		text: inputValue,
		done: false
	});

	localStorage.setItem("tasksArray", JSON.stringify(tasksArray));

	readTasks();
}

function getId() {
	let currentId = parseInt(localStorage.getItem("nextId"));

	if (!currentId) currentId = 0;
	
	localStorage.setItem("nextId", currentId + 1);
	return currentId;
}

function getPosition(id) {
	let tasksArray = JSON.parse(localStorage.getItem("tasksArray"));
	for (let i = 0; i < tasksArray.length; i++) {
		if (tasksArray[i].id === id) return i;
	}
}

function addEvents() {
	let addTaskButton = document.querySelector(".add-task__button");
	let showIncomplete = document.querySelector(".show__incomplete");
	let showCompleted = document.querySelector(".show__completed");
	let input = document.querySelector(".add-task__input");

	addTaskButton.addEventListener("click", event => {
		if (input.value == "") {
			alert("You should enter a task first.");
			return;
		}
		
		addTask(input.value);
		input.value = "";
	});

	input.addEventListener("keyup", event => {
		if (event.keyCode === 13) addTaskButton.click();
	});

	showIncomplete.addEventListener("click", function(event) {
		incompleteTasks.classList.remove("inactive");
		completedTasks.classList.add("inactive");
	});

	showCompleted.addEventListener("click", function(event) {
		incompleteTasks.classList.add("inactive");
		completedTasks.classList.remove("inactive");
	});
}

addEvents();
readTasks();
