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
			completed: props.completed
		};
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick() {
		const newCompleted = !this.state.completed;
		this.setState({completed: newCompleted});
		this.props.onClick(this.props.task, newCompleted);
	}

	render() {
		return (
			<div className={'task'}>
				{ this.props.assigned &&
					<button
						className={this.state.completed ? 'taskButton pressed' : 'taskButton'}
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
		this.state = {
			tasks: [],
			completed: props.completed
		};
		this.handleClick = this.handleClick.bind(this);
		this.handleTaskClick = this.handleTaskClick.bind(this);
	}

	componentDidMount() {
		if (this.props.chore.choreid){
			getChoreTasks(this.props.chore.choreid, (err, data)=>{this.setState({tasks: data});});
		}
	}

	handleClick(){
		const newCompleted = !this.state.completed;
		this.setState({completed: newCompleted});
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
						className={this.state.completed ?'choreButton pressed':'choreButton'}
						onClick={() => this.handleClick()}
					>{this.props.assigned ? 'Done' : 'Take'}</button>
				</div>
				<hr/>
				{this.state.tasks.map(task=>
					<Task
						task={task}
						key={task.taskid}
						assigned={this.props.assigned}
						completed={this.props.completed}
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
					{this.props.category.chores.map(chore=>
						<Chore
							chore={chore}
							completed={this.props.category.completed}
							assigned={this.props.category.assigned}
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
					completed:false, assigned:true},
				{index:1, name:'Done:', id:'done', chores:[],
					completed:true, assigned:true},
				{index:2, name:'Additional Chores:', id:'unassigned', chores:[],
					completed:false, assigned:false}
			]
		};
	}

	componentDidMount() {
		this.state.categories.map(category=>
			getAssignmentsByCategory(this.props.userId, category.id, (err, data) => {
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

export default Choreboard;
