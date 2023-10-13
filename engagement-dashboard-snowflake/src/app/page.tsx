import {
  Col, Card,Grid, Title, Text, DonutChart, Tab, TabList, BarChart, LineChart,
  TabGroup, TabPanel, TabPanels, Table, TableHead, TableHeaderCell, TableRow, TableCell, TableBody, ValueFormatter
} from "@tremor/react";

import { FactsAppEngagement as DataPkg } from "snowflake-demo-package-fast";

const queries = (pkg: any) => {

  const { gender, age, ethnicity, devicemakemodel, appTitle, foregroundduration, panelistid, starttimestamp, isp } = pkg.fields;

  return {
    sessionDuration: pkg.select(
      starttimestamp.day.as('dayOfWeek'),
      foregroundduration.avg().as('avgSessionLength'))
      .filter(appTitle.eq('ESPN')),
    appSplit: pkg.select(
      appTitle,
      panelistid.count().as('appCount'))
      .filter(appTitle.isNotNull()),
    deviceSplit: pkg.select(
      devicemakemodel,
      panelistid.count().as('deviceCount'))
      .filter(devicemakemodel.isNotNull()),
    ispSplit: pkg.select(
      isp,
      panelistid.count().as('ispCount'))
      .filter(isp.isNotNull()),
    topSessions: pkg.select(
      panelistid,
      devicemakemodel,
      appTitle,
      foregroundduration)
    .filter(devicemakemodel.isNotNull().and(appTitle.isNotNull()))
    .orderBy([foregroundduration, 'DESC']),
    popSummary: pkg.select(
      appTitle,
      devicemakemodel,
      isp,
      panelistid)
    .limit(50)
  };
};

export default async function Home() {

  const activePkg = DataPkg; 

  const [
    appData,
    deviceData,
    ispData,
    sessionData,
    popData,
    durationData
  ] = await (Promise.all([
    queries(activePkg).appSplit.limit(10).orderBy(["appCount", "desc"]).execute(),
    queries(activePkg).deviceSplit.limit(10).orderBy(["deviceCount", "desc"]).execute(),
    queries(activePkg).ispSplit.limit(10).orderBy(["ispCount","desc"]).execute(),
    queries(activePkg).topSessions.limit(50).execute(),
    queries(activePkg).popSummary.execute(),
    queries(activePkg).sessionDuration.limit(7).execute().then((data) => {
      // let newData = new Object
      data.forEach(element => {
        element.avgSessionLength = parseInt(element.avgSessionLength) / 1000;
        element.dayOfWeek = element.dayOfWeek - 1;    
      });
      console.log(data);
      return data; 
    })
  ]));

  return (
    <main className="p-12">
      <Title>Mobile App Engagement Summary</Title>
      <Text>Understanding how people use various mobile apps</Text>

      <TabGroup className="mt-6">
        <TabList>
          <Tab>Overview</Tab>
          <Tab>Drilldowns</Tab>
        </TabList>

        <TabPanels>
          <Card>
            <Title>Session Duration by Day of Week (seconds)</Title>
            <BarChart 
              className="mt-6"
              data={durationData}
              index="dayOfWeek"
              categories={["avgSessionLength"]}
              colors={["blue"]}
              showLegend={true}
              />
          </Card>
          

          <Grid numItems={3} className="mt-6 gap-6">
            <Card>
              <Title>App Breakdown</Title>
              <DonutChart
                className="mt-6"
                data={appData}
                category="appCount"
                index="appTitle"
                // colors={["rose", "violet"]}

              />
            </Card>

            <Card>
              <Title>Device Breakdown</Title>
              <DonutChart
                className="mt-6"
                data={deviceData}
                category="deviceCount"
                index="devicemakemodel"
                // colors={["rose", "violet", "slate", "indigo", "cyan", "amber"]}
              />
            </Card>

            <Card>
              <Title>ISP Breakdown</Title>
              <DonutChart
                className="mt-6"
                data={ispData}
                category="ispCount" 
                index="isp"
                colors={["rose", "violet", "slate", "indigo", "cyan", "amber", "blue", "green"]}
              />
            </Card>

            <Col numColSpan={3}>
              <Card>
                <Title>Population Sample</Title>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableHeaderCell>Duration</TableHeaderCell>
                      <TableHeaderCell>App</TableHeaderCell>
                      <TableHeaderCell>Device</TableHeaderCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {sessionData.map((row: any) => (
                      <TableRow key={row.panelistid}>
                        <TableCell>{row.foregroundduration}</TableCell>
                        <TableCell>
                          <Text>{row.appTitle}</Text>
                        </TableCell>
                        <TableCell>
                          <Text>{row.devicemakemodel}</Text>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>

                </Table>
              </Card>
            </Col>
          </Grid>

        </TabPanels>
      </TabGroup>
    </main>
  )
};
