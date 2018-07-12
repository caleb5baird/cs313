import { find } from 'lodash';

const CHORES = [{'name':'Bed','id':5,'userid':1}
	,{'name':'Bedroom','id':6,'userid':1}
	,{'name':'Critters','id':9,'userid':1}
	,{'name':'Dishes – Breakfast','id':10,'userid':1}
	,{'name':'Fix Breakfast','id':15,'userid':1}
	,{'name':'Get Self Up','id':19,'userid':1}
	,{'name':'Mudroom & Bathroom','id':22,'userid':1}
];


export function getTasks(choreId){
	var tasks = [{'task':'Clean w/ cleaner toilet','taskid':1,'completed':false}
		,{'task':'Clean w/ cleaner sink','taskid':2,'completed':false}
		,{'task':'Clean w/ cleaner tub','taskid':3,'completed':false}
		,{'task':'Clean w/ cleaner counters','taskid':4,'completed':false}
		,{'task':'Mop','taskid':5,'completed':false}
		,{'task':'Mirrors','taskid':6,'completed':false}
	];
	return tasks;
}

export function getChores(userId, category, callback){
	if(!userId || !category){
		callback(null, [{'name':'Bed','id':5,'userid':1}
			,{'name':'Bedroom','id':6,'userid':1}
			,{'name':'Critters','id':9,'userid':1}
			,{'name':'Dishes – Breakfast','id':10,'userid':1}
			,{'name':'Fix Breakfast','id':15,'userid':1}
			,{'name':'Get Self Up','id':19,'userid':1}
			,{'name':'Mudroom & Bathroom','id':22,'userid':1}
		]);
	} else {
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				callback(null, this.responseText);
			}
		};
		xhttp.open('GET', '/user/'+ userId + '/chores/' + category, true);
		xhttp.send();
	}
}

export function getChore(id) {
}

export function getUser(){
	var user = {
		'id':1,
		'name':'Ammon',
		'isAdmin':false,
		'accountBalance':5.51,
		'streak':2
	};
	return user;
}
