/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var ajax = require('ajax');
var UI = require('ui');
var Vector2 = require('vector2');
var Entity = require('entity');

var entities = {};

var main = new UI.Card({
  title: 'Home Assistant',
  icon: 'images/menu_icon.png',
});

main.show();

ajax(
    {url: 'https://house.hhome.me/api/states',
     type: 'json'},
    function(data) {
        var menu_items = [];
	var top_entities = [];

        for (i=0; i<data.length; ++i) {
            entity = Entity.from_data(data[i], entities);
            entities[entity.entity_id] = entity;
	    top_entities.push(entity.entity_id);
	}

	for (var entity_id in entities) {
	    var entity = entities[entity_id];
	    if (entity.visible()) {
		console.log(entity.entity_id);
		var subentities = entity.subentities();
		for (var d in subentities) {
		    console.log("- " + subentities[d]);
		    var idx = top_entities.indexOf(subentities[d]);
		    if (idx > -1) {
			top_entities.splice(idx, 1);
		    }
		}
	    }
	}

	Entity.set_entities(entities);

	var TopGroup = new Entity.Group({
	    'attributes': {
		'entity_id': top_entities
	    },
	    'entity_id': 'group.toplevel'
	});

	TopGroup.show();
        main.hide();

    }
);
