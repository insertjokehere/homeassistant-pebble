var UI = require('ui');
var ajax = require('ajax');
var entities;

function startsWith(str, word) {
    return str.lastIndexOf(word, 0) === 0;
}

function Entity(data) {
    this._data = data;
    this._attributes = this._data['attributes'] || {};
    this.display_name = this._attributes['friendly_name'];
    this.entity_id = this._data['entity_id'];
}

Entity.prototype.visible = function () {
    return !this._attributes['hidden'] && this._attributes['friendly_name'];
}

Entity.prototype.state = function () {
    return this._data['state'];
}

Entity.prototype.icon = function () {
}

Entity.prototype.select = function () {
}

Entity.prototype.show = function () {
}

Entity.prototype.subentities = function () {
    return []
}

Entity.prototype.update_state = function (new_state, cb) {
    ajax({
	url: 'https://house.hhome.me/api/states/' + this.entity_id,
	method: 'POST',
	type: "json",
	data: {
	    "state": new_state
	}
    }, cb, function (data, status) {
	console.log("request failed " + status);
	console.log(JSON.stringify(data));
    })
}

Entity.prototype.call_service = function(domain, service, data, cb) {
    ajax({
	url: 'https://house.hhome.me/api/services/' + domain + '/' + service,
	method: 'POST',
	type: "json",
	data: data
    }, cb, function (data, status) {
	console.log("request failed " + status);
	console.log(JSON.stringify(data));
    })
}

module.exports.Entity = Entity;

function Group(data) {
    Entity.call(this, data);
}

Group.prototype = Object.create(Entity.prototype);

Group.prototype.state = function() { return }

Group.prototype.subentities = function() {
    return this._attributes['entity_id'];
}

Group.prototype.select = function () {
    this.show();
}

Group.prototype.show = function() {
    console.log("Showing " + this.entity_id);
    var menu_items = [];

    var group_items = this.subentities();

    var _subentities = [];
    
    for (var i in group_items) {
	var entity_id = group_items[i];
	entity = entities[entity_id];

	if (entity) {
	    console.log(entity.entity_id);

            if (entity.visible()) {
		_subentities.push(entity);
		menu_items.push({
                    title: entity.display_name,
                    subtitle: entity.state(),
		    icon: entity.icon()
		});
            }
	}
    }
    
    var menu = new UI.Menu({
        sections: [{
            items: menu_items
        }]
    });

    var group = this;

    menu.on('select', function(e) {
	_subentities[e.itemIndex].select();
    });

    menu.show();
}

Group.prototype.constructor = Group;

module.exports.Group = Group;

function Switch(data) {
    Entity.call(this, data);
}

Switch.prototype = Object.create(Entity.prototype);
Switch.prototype.constructor = Switch;
Switch.prototype.icon = function () {
    return 'images/menu_icon.png'
}
Switch.prototype.select = function () {
    var newstate = this.state() == 'on' ? 'off': 'on'
    this.call_service('homeassistant', 'turn_' + newstate,
		      { 'entity_id': this.entity_id },
		      function (data) {
			  console.log("Update success");
			  console.log(JSON.stringify(data));
			  this._data['state'] = newstate;
    });
}

function from_data(data) {
    entity_id = data['entity_id'];
    if (startsWith(entity_id, 'group.')) {
	return new Group(data);
    } else if (startsWith(entity_id, 'switch.')) {
	return new Switch(data);
    } else {
	return new Entity(data);
    }
}

module.exports.from_data = from_data;
module.exports.set_entities = function (all_entities) {
    entities = all_entities;
}
