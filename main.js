Vue.component('addTaskForm', {
	data() {
		return {
			inputValue: ''
		}
	},

	template: `
		<div class="add-task">
			<input
				class="add-task__input"
				type="text"
				placeholder="Add Task"
				v-model="inputValue"
				v-on:keyup.enter="emitTaskInfo()"
			/>
			<button v-on:click="emitTaskInfo()" class="add-task__button">
				<i class="fas fa-plus"></i>
			</button>
		</div>
	`,

	methods: {
		emitTaskInfo() {
			if (this.inputValue) { 
				this.$emit("task-info", {text: this.inputValue})
				this.inputValue= ''
			}
			else alert("You should enter a task first.")
		}
	}
})

Vue.component('taskCard', {
	data() {
		return {}
	},

	props: {
		// taskId: Number,
		// taskText: String,
		// taskState: Boolean,

		taskObject: Object
	},

	template: `
		<div class="task" :class="{ 'task--done': taskObject.done }">
			<div class="task__inner">
				<div v-on:click="triggerDoneEvent()" class="task__doneButton">
					<span class="task__doneButton-filler"></span>
				</div>
				<p class="task__text">{{taskObject.text}}</p>
				<div class="task__deleteButton" v-on:click="triggerDeleteEvent()">
					<i class="fas fa-times-circle"></i>
				</div>
			</div>
		</div>
	`,

	methods: {
		triggerDoneEvent() {
			this.$emit("done-event-triggered", this.taskObject.id)
		},

		triggerDeleteEvent() {
			this.$emit("delete-event-triggered", this.taskObject.id)
		}
	}
})

var toDoApp = new Vue({
	el: "#To-Do-App",
	data: {
		tasksList: [],
		displayCompleted: false,
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
		addTask(taskObject) {
			this.tasksList.push({
				id: this.getNewId(),
				text: taskObject.text,
				done: false
			});

			this.updateStorage();
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
