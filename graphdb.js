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
exports.getCampaigns = exports.getUsers = void 0;
var actor_init_sparql_1 = require("@comunica/actor-init-sparql");
var credentials_1 = require("./credentials");
var sparql = actor_init_sparql_1.newEngine();
var userQuery = "\n  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n  PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n  PREFIX consent: <http://www.semanticweb.org/aneliakurteva/ontologies/2020/4/untitled-ontology-21#>\n  PREFIX consent_sensor: <http://www.semanticweb.org/aneliakurteva/ontologies/2020/4/Consent_Sensor#>\n\n  select ?u ?c where {\n      ?u rdf:type consent:User ;\n        consent_sensor:ParticipatesIn ?c .\n  } limit 100\n";
var campaignQuery = "\n  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n  PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n  PREFIX consent: <http://www.semanticweb.org/aneliakurteva/ontologies/2020/4/untitled-ontology-21#>\n  PREFIX consent_sensor: <http://www.semanticweb.org/aneliakurteva/ontologies/2020/4/Consent_Sensor#>\n\n  select ?c ?d ?cons ?u where {\n      ?c rdf:type consent_sensor:Name .\n      OPTIONAL {\n        ?c consent:RequiresData ?d .\n          ?c consent:hasConsent ?cons .\n          ?c consent:isProvidedBy ?u .\n      }\n  } limit 100\n";
function sendQuery(query) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, sparql.query(userQuery, {
                        sources: [credentials_1.DB_URL],
                        httpAuth: credentials_1.DB_AUTH,
                    })];
                case 1: 
                // npx comunica-sparql https://username:password@graphdb.sti2.at/repositories/ConsentKG/statements 'CONSTRUCT WHERE { ?s ?p ?o }'
                return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function getUsers() {
    return __awaiter(this, void 0, void 0, function () {
        var result, bindings, users;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, sendQuery(userQuery)];
                case 1:
                    result = _a.sent();
                    return [4 /*yield*/, result.bindings()];
                case 2:
                    bindings = _a.sent();
                    users = bindings.map(function (data) { return data.get('?u').value; });
                    console.log(JSON.stringify(users, null, 2));
                    return [2 /*return*/];
            }
        });
    });
}
exports.getUsers = getUsers;
function getCampaigns() {
    return __awaiter(this, void 0, void 0, function () {
        var result, bindings, campaigns;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, sendQuery(campaignQuery)];
                case 1:
                    result = _a.sent();
                    return [4 /*yield*/, result.bindings()];
                case 2:
                    bindings = _a.sent();
                    campaigns = bindings.map(function (data) { return data.get('?c').value; });
                    console.log(JSON.stringify(campaigns, null, 2));
                    return [2 /*return*/];
            }
        });
    });
}
exports.getCampaigns = getCampaigns;
//# sourceMappingURL=graphdb.js.map