"use strict";
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
exports.hide = exports.show = exports.build_detailed_view = void 0;
var d3 = require("d3");
var icons_1 = require("./icons");
var colors_1 = require("./colors");
var build_detailed_view = function () {
    var overlay_container = d3.select('#grid').append('div')
        .attr('class', 'detail-overlay-container hidden')
        .style('backdrop-filter', 'blur(10px)')
        .style('background-color', colorMode === 'dark' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(200, 200, 200, 0.6)');
    overlay_container.append('span')
        .attr('class', 'detail-overlay-title');
    overlay_container.append('ul')
        .attr('class', 'detail-overlay hidden');
};
exports.build_detailed_view = build_detailed_view;
function show(node_info) {
    return __awaiter(this, void 0, void 0, function () {
        var timeline, listItemContainer, iconContainer, svg, collectedContainer;
        return __generator(this, function (_a) {
            d3.select('.detail-overlay-container')
                .attr('class', 'detail-overlay-container visible');
            d3.select('.detail-overlay-title')
                .html(node_info.Name);
            timeline = d3.select('.detail-overlay')
                .attr('class', 'detail-overlay visible')
                .selectAll('.datapoint')
                .data(node_info.CollectedData)
                .enter().append('li')
                .attr('class', 'datapoint')
                .style('background-color', colorMode === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)');
            listItemContainer = timeline.append('div')
                .style('display', 'flex')
                .style('justify-content', 'space-between');
            iconContainer = listItemContainer.append('div');
            iconContainer.append('span')
                .attr('class', 'icon')
                .html(function (d) { return icons_1.ICONS[d.type.toLowerCase()].toString(); });
            svg = timeline.select('.icon > svg')
                .attr('height', null)
                .attr('width', null);
            svg.selectChild('g')
                .attr('fill', function (d) { return colors_1.LEGEND_COLORS[d.type.toLowerCase()][colorMode]; });
            iconContainer.append('span')
                .attr('class', 'text detail-type')
                .style('color', function (d) { return colors_1.LEGEND_COLORS[d.type.toLowerCase()][colorMode]; })
                .text(function (d) { return d.type + " (retrieved on " + d.retrievedAt + ")"; });
            collectedContainer = listItemContainer.append('div');
            collectedContainer.append('span')
                .attr('class', 'text')
                .style('color', function (d) { return colors_1.LEGEND_COLORS[d.type.toLowerCase()][colorMode]; })
                .text(function (d) { return d.collectedBy; });
            d3.select('.button-container')
                .style('position', 'absolute');
            d3.select('#back_button')
                .style('visibility', 'visible');
            return [2 /*return*/];
        });
    });
}
exports.show = show;
var hide = function () {
    d3.select('.detail-overlay').attr('class', 'detail-overlay hidden');
    d3.select('.detail-overlay-container').attr('class', 'detail-overlay-container hidden');
    d3.selectAll('.datapoint').remove();
    d3.select('.button-container')
        .style('position', 'inherit');
    d3.select('#back_button')
        .style('visibility', 'hidden');
};
exports.hide = hide;
//# sourceMappingURL=detailed_view.js.map