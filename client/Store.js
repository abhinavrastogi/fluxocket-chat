import { EventEmitter } from 'events';
import assign from 'object-assign';

let _store = [];

let Store = assign({}, EventEmitter.prototype, {
	get: function(id) {
		return id ? _store[id] : _store;
	},
	add: function(player) {
		return _store.push(player);
	},
	remove: function(id) {
		return _store.splice(id, 1);
	},
	emitChange: function() {
		this.emit('change');
	},
	subscribe: function(callback) {
		this.on('change', callback);
	},
	unsubscribe: function(callback) {
		this.removeListener('change', callback);
	}
});

export default Store;
