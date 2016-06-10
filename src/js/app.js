/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var ajax = require('ajax');
var UI = require('ui');
var Vector2 = require('vector2');
var Entity = require

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
            entity = new Entity.Entity(data[i]);
            entities[entity.entity_id] = entity;
            if (entity.visible()) {
                menu_items.push({
                    title: entity.display_name,
                    subtitle: entity.state()
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
