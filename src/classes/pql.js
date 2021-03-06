var CONFIG = require('./../config/config');
var MODEL = require('./model');
var PQL_CONFIG = require('./../config/pql_config');
var PQL = require(CONFIG.get('pql_dir') + '/PQL').PQL;

class S2PQL extends PQL {
    static query (database, ...args) {
        var query = this.getSQL.apply(this, args);
        return database.query(query);
    }
    static setupModel (model) {
        let fields = {};

        model.fields.forEach((v, k) => {
            fields[k] = {
                type: v.type.getPQLType(),
            };
        });

        let linkTo = {};
        let linkFrom = {};

        model.relations.forEach((v, k) => {
            if (v.type instanceof MODEL.RELATION_TYPES.ONE_TO_MANY) {
                linkFrom[k] = {
                    table: v.model,
                    pql: v.query,
                }; 
            } else {
                linkTo[k] = {
                    table: v.model,
                    pql: v.query,
                }; 
            }
        });
        this.defaultConfig.DB_MAP[model.name] = {
            name: model.tableName,
            fields: fields,
            linkTo: linkTo,
            linkFrom: linkFrom,
        };
    }
}
module.exports = S2PQL;

PQL_CONFIG.DB_MAP = {};
S2PQL.defaultConfig = PQL_CONFIG;
