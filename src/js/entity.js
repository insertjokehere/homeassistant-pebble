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

module.exports.Entity = Entity;

function Group(data) {
    Entity.call(this, data);
}

Group.prototype = Object.create(Entity.prototype);

Group.prototype.state = function() { return }

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
    console.log(entity_id);
    if (startsWith(entity_id, 'group.')) {
	return new Group(data);
    } else if (startsWith(entity_id, 'switch.')) {
	return new Switch(data);
    } else {
	return new Entity(data);
    }
}

module.exports.from_data = from_data;
