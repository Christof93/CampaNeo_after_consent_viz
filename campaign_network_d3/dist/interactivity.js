"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.click_outside = exports.click_link = exports.click_campaign_node = exports.mouseout_link = exports.mouseover_link = exports.mouseout_campaign_node = exports.mouseover_campaign_node = exports.changeLightMode = exports.setColorMode = void 0;
var d3 = require("d3");
var colors_1 = require("./colors");
var icons_1 = require("./icons");
var detail_overlay = require("./detailed_view");
function setColorMode(mode) {
    console.log("Color mode: " + colorMode);
    d3.select('body')
        .style('background-color', colors_1.COLORS.background[colorMode]);
    d3.select('#car_button > ellipse').attr('fill', colors_1.COLORS.center_out[colorMode]);
    d3.select('#car_button > g > path').attr('fill', colors_1.COLORS.center_in[colorMode]);
    d3.select('#network-container > ul').style('background-color', colorMode === 'dark' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(200, 200, 200, 0.6)');
    d3.selectAll('circle.particle').attr('fill', function (d) { return colors_1.LEGEND_COLORS[d][colorMode]; });
    d3.select('.color-mode').html(icons_1.LIGHTBULB_ICON[colorMode]);
    Object.entries(icons_1.ICONS).forEach(function (_a) {
        var key = _a[0], value = _a[1];
        d3.select("." + key + " .icon")
            .attr('fill', colors_1.LEGEND_COLORS[key][colorMode]);
        d3.select("." + key + " .text")
            .style('color', colors_1.LEGEND_COLORS[key][colorMode]);
    });
}
exports.setColorMode = setColorMode;
function changeLightMode() {
    colorMode = (colorMode === 'dark' ? 'light' : 'dark');
    setColorMode(colorMode);
}
exports.changeLightMode = changeLightMode;
var mouseover_campaign_node = function (event, node) {
    console.log('mouse over campaign node!');
};
exports.mouseover_campaign_node = mouseover_campaign_node;
var mouseout_campaign_node = function (event, node) {
    console.log('mouse out campaign node!');
};
exports.mouseout_campaign_node = mouseout_campaign_node;
var mouseover_link = function (event, node) {
    console.log('mouse over link!');
};
exports.mouseover_link = mouseover_link;
var mouseout_link = function (event, node) {
    console.log('mouse out link!');
};
exports.mouseout_link = mouseout_link;
var click_campaign_node = function (event, node) {
    console.log('mouse over link!');
    console.log(event);
    console.log(node);
    d3.select('canvas').style('visibility', 'hidden');
    detail_overlay.show(node);
};
exports.click_campaign_node = click_campaign_node;
var click_link = function (event, node) {
    exports.click_campaign_node(event, node);
};
exports.click_link = click_link;
var click_outside = function (event, node) {
    console.log('hide detailed view');
    d3.select('#grid').on('click', null);
    d3.select('canvas').style('visibility', 'visible');
    detail_overlay.hide();
};
exports.click_outside = click_outside;
//# sourceMappingURL=interactivity.js.map