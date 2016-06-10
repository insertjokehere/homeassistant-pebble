function Entity(data) {
    this._data = data;
    this._attributes = data['attributes'] || {};
    this.display_name = this._attributes['friendly_name'];
    this.entity_id = this._data['entity_id'];
}

Entity.prototype.visible = function () {
    return !this._attributes['hidden'] && this._attributes['friendly_name'];
}

Entity.prototype.state = function () {
    return this._data['state'];
}

module.exports.Entity = Entity;
