function Entity(data) {
    this._data = data;
    this._attributes = data['attributes'] || {}
}

Entity.prototype.visible = function () {
    return !this._attributes['hidden'] && this._attributes['friendly_name'];
}

Entity.prototype.display_name = function () {
    return this._attributes['friendly_name'] || this._data['entity_id'];
}

Entity.prototype.state = function () {
    return this._data['state'];
}

exports.Entity = Entity;
