var toDoApp = new Vue({
	el: "#To-Do-App",
	data: {
		tasksList: [],
		displayCompleted: false,
		input: ""
	},

	computed: {
		shownTasks: function() {
			if (this.displayCompleted) return this.tasksList.filter(task => task.done)
			else return this.tasksList.filter(task => !task.done)
		},

		tasksLeft: function() {
			let counter = 0;
			this.tasksList.forEach(task => {
				if (!task.done) counter = counter + 1;
			})
			return counter;
		}
	},

	beforeMount() {
		if (localStorage.getItem("tasksList")) {
			JSON.parse(localStorage.getItem("tasksList")).forEach(task => {
				this.tasksList.push(task);
			});
		}
	},

	methods: {
		addTask() {
			if (this.input == "") alert("You should enter a task first.");
			else {
				this.tasksList.push({
					id: this.getNewId(),
					text: this.input,
					done: false
				});

				this.input = "";
				this.updateStorage();
			}
		},

		deleteTask(id) {
			if (confirm("Are you sure you want to delete this task?"))
			this.tasksList.splice(this.getPosition(id), 1)
			this.updateStorage()
		},

		toggleDone(id) {
			this.tasksList[this.getPosition(id)].done = 
			!this.tasksList[this.getPosition(id)].done
			this.updateStorage()
		},

		changeDisplay(state) {
			this.displayCompleted = state
		},

		getNewId() {
			let currentId = localStorage.getItem("nextId")
				? parseInt(localStorage.getItem("nextId"))
				: 0

			localStorage.setItem("nextId", currentId + 1)
			return currentId
		},

		getPosition(id) {
			for (let i = 0; i < this.tasksList.length; i++) {
				if (this.tasksList[i].id === id) return i
			}
		},

		updateStorage() {
			localStorage.setItem("tasksList", JSON.stringify(this.tasksList));
		}
	}
});
