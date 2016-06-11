var UI = require('ui');
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
    var menu_items = [];

    var group_items = this.subentities();

    var _subentities = [];
    
    for (var i in group_items) {
	var entity_id = group_items[i];
	console.log(entity_id);
	entity = entities[entity_id];
	console.log(entity);

	console.log(entity.entity_id);

	if (entity) {
	    _subentities.push(entity);

            if (entity.visible()) {
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
    console.log(newstate);
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
