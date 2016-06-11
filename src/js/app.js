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

        for (i=0; i<data.length; ++i) {
            entity = Entity.from_data(data[i]);
            entities[entity.entity_id] = entity;
	    console.log(entity.state());
            if (entity.visible()) {
                menu_items.push({
                    title: entity.display_name,
                    subtitle: entity.state(),
		    icon: entity.icon()
                });
            }
        }

        var menu = new UI.Menu({
            sections: [{
                items: menu_items
            }]
        });

        main.hide();
        menu.show();

    }
);
