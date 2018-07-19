import React, { Component } from 'react';
import logo from './logo.svg';
import './Choreboard.css';
// var services = require('./services.js');
import { getChoreTasks, getAssignmentsByCategory, getUser, addAccomplishment } from './services.js';

/******************************************************************************\
 * Task
\******************************************************************************/
class Task extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			isCompleted: props.isCompleted
		};
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick() {
		const newCompleted = !this.state.isCompleted;
		this.setState({isCompleted: newCompleted});
		this.props.onClick(this.props.task, newCompleted);
	}

	render() {
		return (
			<div className={'task'}>
				{ this.props.isAssigned &&
					<button
						className={this.state.isCompleted ? 'taskButton pressed' : 'taskButton'}
						onClick={()=>this.handleClick()}
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
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
		this.handleTaskClick = this.handleTaskClick.bind(this);
	}

	handleClick(){
		const newCompleted = !this.state.isCompleted;
		this.props.onClick(this.props.chore, newCompleted);
	}

	handleTaskClick(task, taskCompleted){
	}

	render() {
		return (
			<div className='chore'>
				<div className='choreHeader'>
					<span>{this.props.chore.name}</span>
					<button
						className={this.state.isCompleted ?'choreButton pressed':'choreButton'}
						onClick={()=>this.handleClick()}
					>{this.props.isAssigned ? 'Done' : 'Take'}</button>
				</div>
				<hr/>
				{this.state.tasks.map(task=>
					<Task
						task={task}
						key={task.taskid}
						isAssigned={this.props.isAssigned}
						isCompleted={this.props.isCompleted}
						onClick={(task, taskCompleted)=>this.handleTaskClick(task, taskCompleted)}
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
							onClick={()=>{}}
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
				{index:2, name:'Additional Chores:', id:'isAssigned', chores:[],
					isCompleted:false, isAssigned:false}
			]
		};
	}

	componentDidMount() {
		this.state.categories.map(category=>
			getAssignmentsByCategory(this.props.userId, category, (err, data) => {
				const newCategories = this.state.categories.slice();
				newCategories[category.index].chores = data;
				this.setState({categories: newCategories});
			})
		);
	}

	render() {
		return(
			<div className='choreboardBody'>
				{this.state.categories.map(category=>
					<ChoreCategory
						category={category}
						key={category.index}
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
class Choreboard extends React.Component {
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

function getChores(userId, category, callback) {
	getAssignmentsByCategory(userId, category.id, (err, chores)=>{
		if(err){
			callback(err, null);
		}else{
			for (let i=0; i < chores.length; ++i){
				chores[i].isCompleted=category.isCompleted;
				chores[i].isAssigned=category.isAssigned;
				getChoreTasks(chores[i].choreid, (err, tasks)=>{
					if(err){
						callback(err,null);
					}else{
						for (let j=0; j < tasks.length; ++j){
							tasks[i].isCompleted =chores[i].isCompleted;
							tasks[i].isAssigned =chores[i].isAssigned;
						}
						chores[i].tasks=tasks;
						callback(null, chores);
					}
				});
			}
		}
	});
}

export default Choreboard;
