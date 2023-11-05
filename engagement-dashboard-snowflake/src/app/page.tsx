import {
  Col, Card,Grid, Title, Text, DonutChart, Tab, TabList, BarChart, LineChart,
  TabGroup, TabPanel, TabPanels, Table, TableHead, TableHeaderCell, TableRow, TableCell, TableBody, ValueFormatter, Button, Select, SelectItem
} from "@tremor/react";
import Link from "next/link";
import { FactsAppEngagement as DataPkg } from "snowflake-demo-package-fast";

export default async function Home({
  searchParams: { app },
}: {
  searchParams: { app: string };
}) {
  const queries = (pkg: any) => {

    const { devicemakemodel, appTitle, foregroundduration, panelistid, starttimestamp, isp } = pkg.fields;
    const appName = app ? app.split('+')[0] : 'ESPN'; 
    return {
      sessionDuration: pkg.select(
        starttimestamp.day.as('dayOfWeek'),
        foregroundduration.avg().as('avgSessionLength'))
        .filter(appTitle.like(appName))
        .limit(7),
      appSplit: pkg.select(
        appTitle,
        panelistid.count().as('appCount'))
        .filter(appTitle.eq(appName))
        .orderBy(["appCount", "desc"])
        .limit(10),
      deviceSplit: pkg.select(
        devicemakemodel,
        panelistid.count().as('deviceCount'))
        .filter(devicemakemodel.isNotNull().and(appTitle.eq(appName)))
        .orderBy(["deviceCount", "desc"])
        .limit(10),
      ispSplit: pkg.select(
        isp,
        panelistid.count().as('ispCount'))
        .filter(isp.isNotNull().and(appTitle.eq(appName)))
        .orderBy(["ispCount","desc"])
        .limit(10),
      topSessions: pkg.select(
        panelistid,
        devicemakemodel,
        appTitle,
        foregroundduration)
      .filter(devicemakemodel.isNotNull().and(appTitle.eq(appName)))
      .orderBy([foregroundduration, 'DESC'])
      .limit(50),
      popSummary: pkg.select(
        appTitle,
        devicemakemodel,
        isp,
        panelistid)
      .limit(50)
    };
  };

  const activePkg = DataPkg; 

  const [
    appData,
    deviceData,
    ispData,
    sessionData,
    popData,
    durationData
  ] = await (Promise.all([
    queries(activePkg).appSplit.execute(),
    queries(activePkg).deviceSplit.execute(),
    queries(activePkg).ispSplit.execute(),
    queries(activePkg).topSessions.execute(),
    queries(activePkg).popSummary.execute(),
    queries(activePkg).sessionDuration.execute().then((data: any[]) => {
      data.forEach(element => {
        element.avgSessionLength = parseInt(element.avgSessionLength) / 1000;
        element.dayOfWeek = element.dayOfWeek - 1;    
      });
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
            <Select>
              <SelectItem value="ESPN">
                <Link
                  href={{
                    pathname: '/',
                    query:{ app: 'ESPN' }
                  }}
                >ESPN</Link></SelectItem>
                <SelectItem value="Walmart">
                <Link
                  href={{
                    pathname: '/',
                    query:{ app: 'Walmart' }
                  }}
                >Walmart</Link></SelectItem>
               <SelectItem value="TikTok">
                <Link
                  href={{
                    pathname: '/',
                    query:{ app: 'Tik Tok' }
                  }}
                >Tik Tok</Link></SelectItem>
                 <SelectItem value="CashApp">
                <Link
                  href={{
                    pathname: '/',
                    query:{ app: 'Cash App' }
                  }}
                >Cash App</Link></SelectItem>
            </Select>
          
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
