import React, { Component } from 'react';
import logo from './logo.svg';
import './Choreboard.css';
// var services = require('./services.js');
import { getChoreTasks, getAssignmentsByCategory, getUser, addAssignment, addAccomplishment, removeAccomplishment } from './services.js';

/******************************************************************************\
 * Task
\******************************************************************************/
class Task extends React.Component {
	render() {
		return (
			<div className={'task'}>
				{ this.props.isAssigned &&
					<button
						className={this.props.task.iscompleted ? 'taskButton pressed' : 'taskButton'}
						onClick={()=>this.props.onClick()}
					></button>
				}
				<span>{this.props.task.description}</span>
			</div>
		);
	}
}

/******************************************************************************\
 * Chore
\******************************************************************************/
class Chore extends React.Component {
	render() {
		return (
			<div className='chore'>
				<div className='choreHeader'>
					<span>{this.props.chore.name}</span>
					<button
						className={this.props.chore.isCompleted ?'choreButton pressed':'choreButton'}
						onClick={()=>this.props.onClick()}
					>{this.props.isAssigned ? 'Done' : 'Take'}</button>
				</div>
				<hr/>
				{this.props.chore.tasks.map(task=>
					<Task
						task={task}
						key={task.taskid}
						isAssigned={this.props.isAssigned}
						iscompleted={this.props.iscompleted}
						onClick={()=>this.props.onTaskClick(task)}
					/>
				)}
			</div>
		);
	}
}

/******************************************************************************\
 * ChoreCategory
\******************************************************************************/
class ChoreCategory extends React.Component {
	render() {
		return (
			<div className={'choreCategory'}>
				<h3>{this.props.category.name}</h3>
				<div className={'chores'}>
					{this.props.category && this.props.category.chores.map(chore=>
						<Chore
							chore={chore}
							isCompleted={this.props.category.isCompleted}
							isAssigned={this.props.category.isAssigned}
							key={chore.choreid}
							onClick={()=>{this.props.onChoreClick(chore);}}
							onTaskClick={(task)=>{this.props.onTaskClick(chore, task);}}
						/>
					)}
				</div>
			</div>
		);
	}
}

/******************************************************************************\
 * ChoreboardBody
\******************************************************************************/
class ChoreboardBody extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			categories: [
				{index:0, name:'To Do:', id:'to-do', chores: [],
					isCompleted:false, isAssigned:true},
				{index:1, name:'Done:', id:'done', chores:[],
					isCompleted:true, isAssigned:true},
				{index:2, name:'Additional Chores:', id:'unassigned', chores:[],
					isCompleted:false, isAssigned:false}
			]
		};
	}

	handleChoreClick(category, chore){
		const categories = this.state.categories;
		const chores = category.chores;
		const tasks = chore.tasks;
		if(category.id != 'unassigned'){
			const newCatI = chore.isCompleted ? 0 : 1;
			const newCategory = categories[newCatI];
			const newCategoryChores = newCategory.chores;
			for(let i =0; i < tasks.length; ++i){
				if (chore.isCompleted && tasks[i].iscompleted){
					removeAccomplishment(chore.assignmentid, tasks[i].taskid, ()=>{});
				}else if (!chore.isCompleted && !tasks[i].iscompleted) {
					addAccomplishment(chore.assignmentid, tasks[i].taskid, ()=>{});
				}
				tasks[i].iscompleted = !tasks[i].iscompleted;
			}
			chore.tasks = tasks;
			chore.isCompleted = !chore.isCompleted;
			for(let i =0; i < chores.length; ++i){
				if(chores[i].choreid == chore.choreid){
					chores.splice(i, 1);
				}
			}
			category.chores =chores;
			newCategory.chores=newCategoryChores.concat(chore);
			categories[category.index]=category;
			categories[newCategory.index]=newCategory;
			this.setState({categories: categories});
		} else {
			for(let i =0; i < chores.length; ++i){
				if(chores[i].choreid == chore.choreid){
					chores.splice(i, 1);
				}
			}
			category.chores=chores;
			categories[category.index]=category;
			const newCategory = categories[0];
			const newCategoryChores = newCategory.chores;
			addAssignment(this.props.userId, chore.choreid)
				.then((assignment)=>{
					chore.assignmentid = assignment.id;
					for(let i =0; i < tasks.length; ++i){
						tasks[i].iscompleted = false;
						tasks[i].isAssigned = false;
					}
					chore.isAssigned = false;
					newCategory.chores=newCategoryChores.concat(chore);
					categories[newCategory.index]=newCategory;
					this.setState({categories: categories});
				});
		}
	}

	handleTaskClick(category, chore, task){
		const categories = this.state.categories.slice(0);
		if(category.id == 'done'){
			removeAccomplishment(chore.assignmentid, task.taskid, ()=>{});
			if (task.iscompleted != true) throw new Error('Something is wrong you are assuming that the assisiated chore is in done so the task is completed');
			let choreIndex = categories[1].chores.indexOf(chore);
			let taskIndex = categories[1].chores[choreIndex].tasks.indexOf(task);
			categories[1].chores[choreIndex].tasks[taskIndex].iscompleted = !task.iscompleted;
			//move to to-do
			moveTo(categories[0], chore);
			moveOut(categories[1], chore);

		} else {
			//add or remove an accomplishment
			if (task.iscompleted){
				removeAccomplishment(chore.assignmentid, task.taskid, ()=>{});
			}else {
				addAccomplishment(chore.assignmentid, task.taskid, ()=>{});
			}
			let choreIndex = categories[0].chores.indexOf(chore);
			let taskIndex = categories[0].chores[choreIndex].tasks.indexOf(task);
			console.log('choreIndex: ', choreIndex);
			console.log('taskIndex: ', taskIndex);
			categories[0].chores[choreIndex].tasks[taskIndex].iscompleted = !task.iscompleted;

			//check to see if they are now all done
			let allDone = true;
			for (let t of chore.tasks) if (!t.iscompleted) allDone = false;
			if (allDone) {
				categories[0].chores[choreIndex].isCompleted = true;
				moveTo(categories[1], chore);
				moveOut(categories[0], chore);
			}
		}
		this.setState({categories: categories});
	}

	componentDidMount() {
		this.state.categories.map(category =>
			getAssignmentsByCategory(this.props.userId, category)
				.then((chores) => {
					console.log('hi folks');
					const newCategories = this.state.categories.slice();
					newCategories[category.index].chores = chores;
					this.setState({categories: newCategories});
				})
				.catch(console.log)
		);
	}

	render() {
		return(
			<div className='choreboardBody'>
				{this.state.categories.map(category=>
					<ChoreCategory
						category={category}
						key={category.index}
						onTaskClick={(chore, task)=>this.handleTaskClick(category, chore, task)}
						// onTaskClick={(chore, task)=>{}}
						onChoreClick={(chore)=>this.handleChoreClick(category, chore)}
					/>
				)}
			</div>
		);
	}
}

/******************************************************************************\
 * ChoreboardHeader
\******************************************************************************/
class ChoreboardHeader extends React.Component {
	render() {
		return (
			<div className='choreboardHeader'>
				<button className='balance' onClick={ () => this.props.onClick() /* TODO finish this */} >
					{'Account Balance = $' + this.props.user.accountbalance}
				</button>
				<span className='streak'>{'Streak = ' + this.props.user.streak}</span>
				<div>
					<div className='name'>{this.props.user.name}</div>
					<div className='dropdown-content'>
						<button onClick={()=>{}} >{'Log Out'}</button>
					</div>
				</div>
			</div>
		);
	}
}

/******************************************************************************\
 * Choreboard
\******************************************************************************/
class Dashboard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			user: null
		};
	}

	componentDidMount() {
		getUser((err, data) => { this.setState({ user: data });});
	}

	render() {
		return (
			this.state.user && (
				<div className="choreboard">
					<ChoreboardHeader user={this.state.user} />
					<ChoreboardBody userId={this.state.user.id} />
				</div>
			)
		);
	}
}

class AccountHistory extends React.Component {
	render(){
		return(
			<div className='container'>
				<div className='heading'>
					<button onClick={()=>{}}>{ 'Back to Choreboard' }</button>
					<span>{ '$name\'s Account' }</span>
					<span>{ '$balance' }</span>
				</div>
				<div className='table'>
					<div className='tableHead row'>
						<span className='date'>Date</span>
						<span className='type'></span>
						<span className='description'>Description</span>
						<span className='amount'>Amount</span>
					</div>
					<div className='row dark'>
						<div className='row light'>
							<span className='date'>{ '$date' }</span>
							<span className='type'>{ '$type' }</span>
							<span className='description'>{ '$description' }</span>
							<span className='amount'>
								<span>{ '$$amount' }</span>
								<span>{ '$$newBalance' }</span>
							</span>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

class Login extends React.Component {
	render() {
		return (
			<form action="/login" method="POST">
				<div className="container">
					<label for="uname">
						<b>{'Name'}</b>
						<span id="loginFailed">{'Incorrect Name or Password: try again'}</span>
					</label>
					<input type="text" placeholder="Enter Name" name="name" required />
					<label for="psw"><b>{'Password'}</b></label>
					<input type="password" placeholder="Enter Password" name="password" required />
					<div className="buttons">
						<button type="submit">{'Login'}</button>
						<a href="sign-up-page.php" id="sign-up">{'Sing Up'}</a>
					</div>
				</div>
			</form>
		);
	}
}

class Choreboard extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			loginIsDisplayed: false,
			dashboardIsDisplayed: true,
			accountHistoryIsDisplayed: false
		};
	}

	render(){
		return (
			this.state.loginIsDisplayed && <Login /> ||
			this.state.dashboardIsDisplayed && <Dashboard /> ||
			this.state.accountHistoryIsDisplayed && <AccountHistory />
		);
	}
}

function moveTo(category, chore) {
	category.chores.push(chore);
}

function moveOut(category, chore) {
	let index = category.chores.indexOf(chore);
	category.chores.splice(index, 1);
}

export default Choreboard;
