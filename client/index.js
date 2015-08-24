import React from 'react';
import Dispatcher from 'fluxocket';
import Store from './Store.js';

Dispatcher.register(function(payload) {
	switch(payload.action) {
		case 'add_msg':
			Store.add(payload.data);
			Store.emitChange();
			break;
	}
});

let Chat = React.createClass({
	getInitialState() {
		return {
			messages: [],
			userName: ''
		}
	},
	componentWillMount() {
		Store.subscribe(this.change);
		let socket = io();
		Dispatcher.setSocket(socket);
	},
	componentDidMount() {
		var username = '';

		do {
			username = prompt('Enter name:');
		} while (!username.length);

		this.setState({
			userName: username
		});
	},
	change() {
		this.setState({
			messages: Store.get()
		});
	},
	sendMessage(e) {
		e.preventDefault();
		let from = this.state.userName;
		let text = this.refs['msg'].getDOMNode().value;
		let timestamp = Date.now();

		if(!from.length || !text.length) {
			alert('Name and message is required');
			return;
		}

		Dispatcher.dispatch({
			action: 'add_msg',
			data: { from, text, timestamp }
		});

		this.refs['form'].getDOMNode().reset();
	},
	render() {
		return <div>
			<ul className="messages" ref='messages'>
				{this.state.messages.map((msg, k) => {
					return <li key={k}><span className='msgSender'>{msg.from}:</span> {msg.text}</li>
				})}
			</ul>
			<form className='form' ref='form'>
				<input autoComplete="off" className='msg' placeholder='message' ref='msg' />
				<button onClick={this.sendMessage}>Send</button>
			</form>
		</div>;
	}
});

React.render(<Chat />, document.getElementById('container'));
