import { Component, OnInit } from '@angular/core';
import { todo } from './todo';
import { TodoStoreService } from './todo-store.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'angular-pouchDB-todoMVC';
  todos:todo[]=[];
  todoStore: TodoStoreService;
	newTodoText = '';

	constructor(todoStore: TodoStoreService) {
		this.todoStore = todoStore;
		
	}
	ngOnInit(): void {
		
		this.todoStore.sync();
		this.todoStore.onPouchDbChange().on("change", change=>{
			this.showNewChange(change);
		  });		
		this.showTodos();
		
		
	}
	showNewChange(data:any): any {

		this.showTodos();
	
		return null;
	}

	showTodos()
	{
		this.todoStore.fetch().then(response => {
			this.todos = [];
			for (let row of response.rows) {     
				let doc=row.doc;
			  let todoItem:todo=new todo(doc.title);
			  todoItem._id=doc._id;
			  todoItem.completed=doc.completed;
			  todoItem.editing=doc.editing;
			  this.todos.push(todoItem);            
			}
		}, error => {
			console.error(error);
		});
	}

	stopEditing(todo: todo, editedTitle: string) {
		todo.title = editedTitle;
		todo.editing = false;
	}

	cancelEditingTodo(todo: todo) {
		todo.editing = false;
	}

	updateEditingTodo(todo: todo, editedTitle: string) {
		editedTitle = editedTitle.trim();
		todo.editing = false;

		if (editedTitle.length === 0) {
			return this.todoStore.remove(todo);
		}

		todo.title = editedTitle;
	}

	editTodo(todo: todo) {
		todo.editing = true;
	}

	removeCompleted() {
		this.todoStore.removeCompleted();
	}

	toggleCompletion(todo: todo) {
		this.todoStore.toggleCompletion(todo);
	}

	remove(todo: todo){
		this.todoStore.remove(todo);
	}

	addTodo() {
		if (this.newTodoText.trim().length) {
			this.todoStore.add(this.newTodoText);
			this.newTodoText = '';
		}
	}
}
