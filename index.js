"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./style.css");
require("bootstrap/dist/css/bootstrap.css");
var d3 = require("d3");
var import_svg_1 = require("./import_svg");
var interactive = require("./interactivity");
var detail_overlay = require("./detailed_view");
var sidebar = require("./sidebar");
var colors_1 = require("./colors");
interactive.setColorMode(colorMode);
fetch('SampleCampaign.json')
    .then(function (res) { return res.json(); })
    .then(function (data) { return __awaiter(void 0, void 0, void 0, function () {
    var svg;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('load data.');
                console.log(data);
                return [4 /*yield*/, build_network(data)
                    // construct the overlay for more detailed info
                ];
            case 1:
                svg = _a.sent();
                // construct the overlay for more detailed info
                detail_overlay.build_detailed_view();
                sidebar.buildSidebar();
                return [2 /*return*/];
        }
    });
}); });
var build_network = function (data) { return __awaiter(void 0, void 0, void 0, function () {
    function showParticleAnimation() {
        particleGroup.selectAll('circle').remove();
        line_links.each(function (line_link, j) {
            var elem = d3.select(this);
            var dataCollection = line_link.target.CollectedData;
            var dataCollectionLength = dataCollection.length;
            var _loop_1 = function (i) {
                var particleType = dataCollection[i].type.toLowerCase();
                particleGroup.append('circle').attr('class', 'particle')
                    .attr('cx', 250)
                    .attr('cy', 150)
                    .attr('r', 3)
                    .data([particleType])
                    .attr('fill', colors_1.LEGEND_COLORS[particleType][colorMode])
                    .transition()
                    .delay(i * 750)
                    .duration(3000)
                    .tween('pathTween', function () { return translate(elem); })
                    .on('end', function () {
                    var xDirection = this.cx.baseVal.value <= 250 ? -1 : +1;
                    var yDirection = this.cy.baseVal.value <= 150 ? -1 : +1;
                    var cx = this.cx.baseVal.value + xDirection * (((dataCollectionLength - i) * 13));
                    var cy = this.cy.baseVal.value + yDirection * 2;
                    d3.select(this)
                        .transition()
                        .attr('cx', cx)
                        .attr('cy', cy)
                        .duration(1000);
                });
            };
            for (var i = 0; i < dataCollectionLength; i++) {
                _loop_1(i);
            }
        });
    }
    function translate(path) {
        var length = path.node().getTotalLength();
        var interpolation = d3.interpolate(0, length);
        return function (t) {
            var point = path.node().getPointAtLength(interpolation(t));
            d3.select(this)
                .attr('cx', point.x)
                .attr('cy', point.y);
        };
    }
    var width, height, timespan, radius, nodes, circle_fraction, fraction_offset, user_node, links, container, outer, svg, line_links, node, particleGroup;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                width = 500;
                height = 280;
                timespan = 10000;
                radius = 100;
                nodes = data.Campaigns;
                circle_fraction = Math.PI * 2 / nodes.length;
                fraction_offset = (nodes.length % 2) == 0 ? 2 : 3;
                user_node = { Name: '', id: 'user', x: 250, y: 150 };
                nodes.forEach(function (item, i) {
                    var angle = circle_fraction * i + circle_fraction / fraction_offset;
                    item.x = distributed_on_circumference_x(user_node, radius, angle);
                    item.y = distributed_on_circumference_y(user_node, radius, angle);
                    // determine whether node below or above center
                    item.orientation = Math.PI > angle ? 1 : -1;
                });
                links = nodes.map(function (node, i) {
                    var link = { id: i, source: __assign({}, user_node), target: node, angle: 0 };
                    link.angle = circle_fraction * i + circle_fraction / fraction_offset;
                    link.source.x = distributed_on_circumference_x(user_node, 33, link.angle);
                    link.source.y = distributed_on_circumference_y(user_node, 33, link.angle);
                    return link;
                });
                container = d3.select('#network-graph');
                outer = d3.select('#network-container');
                svg = container
                    .append('svg')
                    .attr('width', outer.style('width'))
                    .attr('height', outer.style('height'))
                    .attr('preserveAspectRatio', 'xMidYMid meet')
                    .attr('viewBox', [0, 0, width, height].join(','));
                window.onresize = function () {
                    svg
                        .attr('width', outer.style('width'))
                        .attr('height', window.innerHeight + 'px')
                        .attr('preserveAspectRatio', 'xMidYMid meet');
                };
                line_links = svg.append('g')
                    .selectAll('line')
                    .data(links)
                    .join('line')
                    .attr('class', 'link')
                    .attr('x1', function (d) { return d.source.x; })
                    .attr('y1', function (d) { return d.source.y; })
                    .attr('x2', function (d) { return d.target.x; })
                    .attr('y2', function (d) { return d.target.y; })
                    .attr('stroke-width', 1)
                    .attr('stroke', '#999')
                    .attr('stroke-opacity', 0.6);
                //-- invisible hover links
                svg.append('g')
                    .selectAll('line')
                    .data(links)
                    .join('line')
                    .attr('class', 'boundary')
                    .attr('x1', function (d) { return d.source.x; })
                    .attr('y1', function (d) { return d.source.y; })
                    .attr('x2', function (d) { return d.target.x; })
                    .attr('y2', function (d) { return d.target.y; })
                    .attr('stroke-width', 4)
                    .attr('stroke-opacity', 0)
                    .on('mouseover', function (d, i) { return interactive.mouseover_campaign_node; })
                    .on('mouseout', function (d, i) { return interactive.mouseout_campaign_node; })
                    .on('click', function (d, i) { return interactive.click_campaign_node; });
                node = svg.append('g')
                    .selectAll('.node')
                    .data(nodes)
                    .enter().append('g')
                    .attr('class', 'node')
                    .on('mouseover', function (d, i) { return interactive.mouseover_campaign_node; })
                    .on('mouseout', function (d, i) { return interactive.mouseout_campaign_node; })
                    .on('click', interactive.click_campaign_node);
                //-- campaign text
                //-- campaign textfield
                node.append('rect')
                    .attr('class', 'text_field')
                    .attr('rx', 12)
                    .attr('ry', 12)
                    .attr('width', 100)
                    .attr('height', 23)
                    .attr('x', function (d) { return d.x - 50; })
                    .attr('y', function (d) { return d.orientation > 0 ? d.y + 13 : d.y - 31; })
                    .attr('fill', colors_1.COLORS.campaign_banner[colorMode])
                    .attr('stroke-width', 0);
                //-- invisible hover field
                node.append('rect')
                    .attr('class', 'hover_field')
                    .attr('width', 100)
                    .attr('height', 35)
                    .attr('x', function (d) { return d.x - 50; })
                    .attr('y', function (d) { return d.orientation > 0 ? d.y - 4 : d.y - 31; })
                    .attr('fill', 'none')
                    .attr('stroke-width', 0);
                // TODO: Make sizes dependent on word length and center
                node.append('text')
                    .attr('dx', function (d) { return d.x - 40; })
                    .attr('dy', function (d) { return d.orientation > 0 ? d.y + 29 : d.y - 15; })
                    .attr('font-family', 'sans-serif')
                    .attr('font-size', '12.5px')
                    .attr('fill', 'black')
                    .attr('stroke-width', 0)
                    .text(function (d) { return d.Name; });
                particleGroup = svg.append('g').attr('class', 'particles');
                return [4 /*yield*/, add_car_button(svg)];
            case 1:
                _a.sent();
                showParticleAnimation();
                setInterval(showParticleAnimation, timespan);
                return [2 /*return*/, svg.node()];
        }
    });
}); };
// functions to compute position of nodes on circle circumference
var distributed_on_circumference_x = function (center_node, radius, angle) {
    var x_circ = radius * Math.cos(angle) + center_node.x;
    return x_circ;
};
var distributed_on_circumference_y = function (center_node, radius, angle) {
    var y_circ = radius * Math.sin(angle) + center_node.y;
    return y_circ;
};
var add_car_button = function (outer_svg) { return __awaiter(void 0, void 0, void 0, function () {
    var svg_node_element, documentFragment, sub_svg;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                svg_node_element = outer_svg.node();
                return [4 /*yield*/, import_svg_1.getSVG('car_button.svg')];
            case 1:
                documentFragment = _a.sent();
                sub_svg = documentFragment.documentElement
                    .querySelector('#car_button');
                svg_node_element.append(sub_svg);
                outer_svg.select('#car_button')
                    .attr('transform', 'translate(-123,-42) scale(0.4)');
                return [2 /*return*/];
        }
    });
}); };
//# sourceMappingURL=index.js.map