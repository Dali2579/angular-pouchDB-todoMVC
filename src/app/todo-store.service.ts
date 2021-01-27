import { EventEmitter, Injectable } from '@angular/core';
import { todo } from './todo';
import PouchDB from "pouchdb";
@Injectable({
	providedIn: 'root'
})
export class TodoStoreService {
	db: any;
	pouchDbListener: EventEmitter<any> = new EventEmitter();
	remoteCouch: string = "https://apikey-v2-xpr4pf78ynije6aecc2fwvtt0ry6j09y3dsstabtk76:2b89ced1c7a482b00660ecb52cdcbce5@eb7da67c-420f-4c17-b8af-e4880f8703b3-bluemix.cloudantnosqldb.appdomain.cloud/angularpouchdbtodomvc";
	todos: Array<todo>;
	constructor() {
		this.db = new PouchDB("angularpouchdbtodomvc");		
	}

	public sync()
	{   let opts = {
        live: true
       
      };
	  this.db.sync(this.remoteCouch,opts,this.syncError)
	/*  .on("change", change=>{
        this.pouchDbListener.emit(change);
      })   
      .on("error", error=>{
        
	  });*/ 
	
	}
	syncError(remoteCouch: string, opts: { live: boolean; }, syncError: any) {
		console.log("sync error");
	}
	
	public onPouchDbChange():any{
		return  this.db.changes({
			 	since: 'now',
				live: true
			 });
	}

	public fetch(): Promise<any> {
		return this.db.allDocs({
			include_docs: true,
			descending: true
		});
	}
	private ChangeEvent() {
		
	}

	public getChangeListener(): EventEmitter<any> {
		return this.pouchDbListener;
	}
	private updateStore() {

	}

	private getWithCompleted(completed: Boolean): todo[] {
		//	return this.todos.filter((todo: Todo) => todo.completed === completed);
		return [];
	}

	allCompleted() {
		//return this.todos.length === this.getCompleted().length;
		return [];
	}

	setAllTo(completed: Boolean) {
		//	this.todos.forEach((t: Todo) => t.completed = completed);
		//	this.updateStore();
	}

	removeCompleted() {
		//this.todos = this.getWithCompleted(false);
		//this.updateStore();
	}

	getRemaining(): todo[] {
		//return this.getWithCompleted(false);
		return [];
	}

	getCompleted(): todo[] {
		//	return this.getWithCompleted(true);
		return [];
	}

	toggleCompletion(todo: todo) {
		//todo.completed = !todo.completed;
		//this.updateStore();

	}

	remove(todo: todo) {
		//this.todos.splice(this.todos.indexOf(todo), 1);
		//this.updateStore();
	}

	add(title: String) {
		let todo = {
			_id: new Date().toISOString(),
			title: title,
			completed: false
		};
		this.db.put(todo, function callback(err, result) {
			if (!err) {
				console.log('Successfully posted a todo!');
			}
		});
	}
}
