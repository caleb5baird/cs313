import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
// var services = require('./services.js');
import { getTasks, getChores, getUser } from './services.js';

class Tasks extends React.Component {
	constructor(props) {
		super(props);
		this.tasks = getTasks(this.props.choreId);
	}

	renderTask(task) {
		return(
			<li>
				<input type='checkbox' />
				<span>{task.task}</span>
			</li>
		);
	}

	render() {
		let allTasks = [];

		for (let i = 0; i < this.tasks.length; i++) {
			allTasks.push(this.renderTask(this.tasks[i]));
		}

		return (
			<ul class='tasks'>
				{ allTasks }
			</ul>
		);
	}
}

class Chores extends React.Component {
	state = { chores: [] }

	constructor(props) {
		super(props);
		if (!this.state.chores.length) {
			getChores(this.props.userId, this.props.category, (err, chores) => this.setState({ chores }))
		}
	}

	renderChore(chore) {
		return(
			<li>
				<span> {chore.name}<a class='button done'>{'Done'}</a> </span>
				<hr/>
				<Tasks choreId = {chore.id} />
			</li>
		);
	}

	render() {
		let allChores = [];

		// console.log('AllChores: ', allChores)
		// console.log('state: ', this.state.chores)

		for (let chore of this.state.chores) allChores.push(this.renderChore(chore));

		return (
			<ul class='chores'>
				{ allChores }
			</ul>
		);
	}
}

class ChoreBoardBody extends React.Component {
	renderChoreCategory(category) {
		return(
			<div class='choreCategory'>
				<h3>{category.name}</h3>
				<Chores userId = {this.props.userId} category = {category.id} />
			</div>
		);
	}

	render() {
		return(
			<div class='choreboardBody'>
				{this.renderChoreCategory({ name: 'To Do:', id: 'to-do' })}
				{this.renderChoreCategory({ name: 'Done:', id: 'done' })}
				{this.renderChoreCategory({ name: 'Additional Chores:', id: 'unassigned' })}
			</div>
		);
	}
}

class ChoreBoardHeader extends React.Component {
	render() {
		return (
			<div class='choreboardHeader'>
				<button class='balance' onClick={ () => this.props.onClick() /* TODO finish this */} >
					{'Account Balance = $' + this.props.user.accountBalance}
				</button>
				<span class='streak'>{'Streak = ' + this.props.user.streak}</span>
				<div>
					<div class='name'>{this.props.user.name}</div>
					<div class='dropdown-content'>
						<button onClick={''/* logout()TODO Finish this*/ } >{'Log Out'}</button>
					</div>
				</div>
			</div>
		);
	}
}

class ChoreBoard extends React.Component {
	constructor(props) {
		super(props);
		this.user = getUser();
	}

	render() {
		return (
			<div class="choreboard">
				<ChoreBoardHeader user = {this.user} />
				<ChoreBoardBody userId = {this.user.id} />
			</div>
		);
	}
}

export default ChoreBoard;
