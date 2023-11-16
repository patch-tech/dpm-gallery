"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FactsAppEngagement = void 0;
const field_1 = require("../field");
const table_1 = require("../table");
class FactsAppEngagement {
    // Fields.
    static fields = {
        panelistid: new field_1.StringField("PANELISTID"),
        age: new field_1.Field("AGE"),
        gender: new field_1.StringField("GENDER"),
        ethnicity: new field_1.StringField("ETHNICITY"),
        factid: new field_1.StringField("FACTID"),
        devicemakemodel: new field_1.StringField("DEVICEMAKEMODEL"),
        operator: new field_1.StringField("OPERATOR"),
        startmarket: new field_1.StringField("STARTMARKET"),
        startinbuilding: new field_1.StringField("STARTINBUILDING"),
        startzipcode: new field_1.StringField("STARTZIPCODE"),
        starttimestamp: new field_1.DateTimeField("STARTTIMESTAMP"),
        startlongitude: new field_1.Field("STARTLONGITUDE"),
        startlatitude: new field_1.Field("STARTLATITUDE"),
        appname: new field_1.StringField("APPNAME"),
        appTitle: new field_1.StringField("APP_TITLE"),
        foregroundduration: new field_1.Field("FOREGROUNDDURATION"),
        foregroundendtime: new field_1.DateTimeField("FOREGROUNDENDTIME"),
        foregroundstarttime: new field_1.DateTimeField("FOREGROUNDSTARTTIME"),
        screenofftime: new field_1.DateTimeField("SCREENOFFTIME"),
        screenonduration: new field_1.Field("SCREENONDURATION"),
        screenontime: new field_1.DateTimeField("SCREENONTIME"),
        visibleduration: new field_1.Field("VISIBLEDURATION"),
        visibleendtime: new field_1.DateTimeField("VISIBLEENDTIME"),
        visiblestarttime: new field_1.DateTimeField("VISIBLESTARTTIME"),
        isp: new field_1.StringField("ISP"),
        startDataconntech: new field_1.StringField("START_DATACONNTECH"),
        year: new field_1.Field("YEAR"),
        month: new field_1.Field("MONTH"),
        day: new field_1.Field("DAY")
    };
    table_;
    // Singleton.
    static instance;
    constructor() {
        this.table_ = new table_1.Table({
            packageId: "1481fe92-b193-4eac-b0de-f59e86a9e833",
            datasetName: "snowflake-demo-package-fast",
            datasetVersion: "0.1.0",
            name: "FACTS_APP_ENGAGEMENT",
            source: "https://example.snowflakecomputing.com",
            fields: Object.values(FactsAppEngagement.fields)
        });
    }
    static get() {
        if (!FactsAppEngagement.instance) {
            FactsAppEngagement.instance = new FactsAppEngagement();
        }
        return FactsAppEngagement.instance;
    }
    static table() {
        return this.get().table_;
    }
    static select(...selection) {
        return this.table().select(...selection);
    }
}
exports.FactsAppEngagement = FactsAppEngagement;
;
