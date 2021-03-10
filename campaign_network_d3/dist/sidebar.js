"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildSidebar = void 0;
var d3 = require("d3");
var icons_1 = require("./icons");
var colors_1 = require("./colors");
var interactivity_1 = require("./interactivity");
var buildSidebar = function () {
    d3.select('#grid').append('div')
        .attr('class', 'sidebar')
        .style('margin', '1em');
    var sidebar = d3.select('.sidebar');
    var button_container = sidebar.append('div')
        .attr('class', 'button-container');
    button_container.append('div')
        .attr('class', 'color-mode')
        .on('click', interactivity_1.changeLightMode)
        .html(icons_1.LIGHTBULB_ICON[colorMode]);
    button_container.append('div')
        .attr('class', 'color-mode')
        .attr('id', 'back_button')
        .style('visibility', 'hidden')
        .on('click', interactivity_1.click_outside)
        .html(icons_1.ARROW_ICON);
    Object.entries(icons_1.ICONS).forEach(function (_a) {
        var key = _a[0], value = _a[1];
        var element = sidebar.append('div')
            .attr('class', "sidebar-element " + key)
            .html(value.toString());
        element.selectChild('svg')
            .attr('class', "icon")
            .attr('fill', colors_1.LEGEND_COLORS[key][colorMode])
            .attr('preserveAspectRatio', 'xMidYMid meet');
        element.append('div')
            .attr('class', 'text')
            .style('color', colors_1.LEGEND_COLORS[key][colorMode])
            .text(key.toLocaleUpperCase());
    });
};
exports.buildSidebar = buildSidebar;
//# sourceMappingURL=sidebar.js.map