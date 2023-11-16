

import { DateTimeField, Field, StringField } from "../field";
import { FieldExpr } from "../field_expr";
import { Table } from "../table";


export class FactsAppEngagement {
    // Fields.
    public static fields = {
        panelistid: new StringField("PANELISTID"),
	age: new Field<number>("AGE"),
	gender: new StringField("GENDER"),
	ethnicity: new StringField("ETHNICITY"),
	factid: new StringField("FACTID"),
	devicemakemodel: new StringField("DEVICEMAKEMODEL"),
	operator: new StringField("OPERATOR"),
	startmarket: new StringField("STARTMARKET"),
	startinbuilding: new StringField("STARTINBUILDING"),
	startzipcode: new StringField("STARTZIPCODE"),
	starttimestamp: new DateTimeField("STARTTIMESTAMP"),
	startlongitude: new Field<number>("STARTLONGITUDE"),
	startlatitude: new Field<number>("STARTLATITUDE"),
	appname: new StringField("APPNAME"),
	appTitle: new StringField("APP_TITLE"),
	foregroundduration: new Field<number>("FOREGROUNDDURATION"),
	foregroundendtime: new DateTimeField("FOREGROUNDENDTIME"),
	foregroundstarttime: new DateTimeField("FOREGROUNDSTARTTIME"),
	screenofftime: new DateTimeField("SCREENOFFTIME"),
	screenonduration: new Field<number>("SCREENONDURATION"),
	screenontime: new DateTimeField("SCREENONTIME"),
	visibleduration: new Field<number>("VISIBLEDURATION"),
	visibleendtime: new DateTimeField("VISIBLEENDTIME"),
	visiblestarttime: new DateTimeField("VISIBLESTARTTIME"),
	isp: new StringField("ISP"),
	startDataconntech: new StringField("START_DATACONNTECH"),
	year: new Field<number>("YEAR"),
	month: new Field<number>("MONTH"),
	day: new Field<number>("DAY")
    };

    private table_: Table;

    // Singleton.
    private static instance: FactsAppEngagement;

    private constructor() {
      this.table_ = new Table({
        packageId: "1481fe92-b193-4eac-b0de-f59e86a9e833",
        datasetName: "snowflake-demo-package-fast",
        datasetVersion: "0.1.0",
        name: "FACTS_APP_ENGAGEMENT",
        source: "https://example.snowflakecomputing.com",
        fields: Object.values(FactsAppEngagement.fields)
      });
    }

    private static get(): FactsAppEngagement {
      if (!FactsAppEngagement.instance) {
        FactsAppEngagement.instance = new FactsAppEngagement();
      }
      return FactsAppEngagement.instance;
    }

    public static table(): Table {
      return this.get().table_;
    }

    public static select(...selection: ("PANELISTID" | "AGE" | "GENDER" | "ETHNICITY" | "FACTID" | "DEVICEMAKEMODEL" | "OPERATOR" | "STARTMARKET" | "STARTINBUILDING" | "STARTZIPCODE" | "STARTTIMESTAMP" | "STARTLONGITUDE" | "STARTLATITUDE" | "APPNAME" | "APP_TITLE" | "FOREGROUNDDURATION" | "FOREGROUNDENDTIME" | "FOREGROUNDSTARTTIME" | "SCREENOFFTIME" | "SCREENONDURATION" | "SCREENONTIME" | "VISIBLEDURATION" | "VISIBLEENDTIME" | "VISIBLESTARTTIME" | "ISP" | "START_DATACONNTECH" | "YEAR" | "MONTH" | "DAY" | FieldExpr)[]): Table {
      return this.table().select(...selection);
    }
    // Rest of the stuff.
};
