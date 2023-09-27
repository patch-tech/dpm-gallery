import {
  Col,
  Card,
  Grid,
  Title,
  Text,
  BarChart,
  DonutChart,
  Tab,
  TabList,
  TabGroup,
  TabPanel,
  TabPanels,
  Table,
  TableHead,
  TableHeaderCell,
  TableRow,
  TableCell,
  TableBody,
} from "@tremor/react";

import { FactsAppEngagement as DataPkg } from "snowflake-demo-package-fast";

const queries = (pkg: any) => ({
  genderSplit: pkg.select(
    pkg.fields.gender,
    pkg.fields.gender.count().as('genderCount'))
    .filter(pkg.fields.gender.isNotNull()),
  ageSplit: pkg.select(
    pkg.fields.age,
    pkg.fields.age.count().as('ageCount'))
    .filter(pkg.fields.age.isNotNull()),
  ethnicitySplit: pkg.select(
    pkg.fields.ethnicity,
    pkg.fields.ethnicity.count().as('ethnicityCount')),
  topSessions: pkg.select(
    pkg.fields.devicemakemodel,
    pkg.fields.appTitle,
    pkg.fields.foregroundduration)
   .orderBy([pkg.fields.foregroundduration, 'DESC']),
  popSummary: pkg.select(
    pkg.fields.ethnicity,
    pkg.fields.age,
    pkg.fields.gender,
    pkg.fields.panelistid
  ).limit(50)
});

export default async function Home() {

  const activePkg = DataPkg;

  const [
    genderData,
    ageData,
    ethnicityData,
    sessionData,
    popData
  ] = await (Promise.all([
    queries(activePkg)
    .genderSplit
    .execute(),
    queries(activePkg)
    .ageSplit
    .execute(),
    queries(activePkg)
    .ethnicitySplit
    .execute(),
    queries(activePkg)
    .topSessions
    .limit(50)
    .execute(),
    queries(activePkg)
    .popSummary
    .execute()
  ]));

  return (
    <main className="p-12">
      <Title>County Demographic Summary</Title>
      <Text>High Level Demographic Summary for All Counties</Text>

      <TabGroup className="mt-6">
        <TabList>
          <Tab>Overview</Tab>
          <Tab>Drilldowns</Tab>
        </TabList>

        <TabPanels>

          <Grid numItems={3} className="mt-6 gap-6">
            <Card>
              <Title>Gender Breakdown</Title>
              <DonutChart
                className="mt-6"
                data={genderData}
                category="genderCount"
                index="gender"
                colors={["rose", "violet"]}
              />
            </Card>

            <Card>
              <Title>Age Breakdown</Title>
              <DonutChart
                className="mt-6"
                data={ageData}
                category="ageCount"
                index="age"
                colors={["rose", "violet", "slate", "indigo", "cyan", "amber"]}
              />
            </Card>

            <Card>
              <Title>Ethnicity Breakdown</Title>
              <DonutChart
                className="mt-6"
                data={ethnicityData}
                category="ethnicityCount"
                index="ethnicity"
                colors={["rose", "violet", "slate", "indigo", "cyan", "amber"]}
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
                    {popData.map((row: any) => (
                      <TableRow key={row.panelistid}>
                        <TableCell>{row.panelistid}</TableCell>
                        <TableCell>
                          <Text>{row.ethnicity}</Text>
                        </TableCell>
                        <TableCell>
                          <Text>{row.age}</Text>
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
