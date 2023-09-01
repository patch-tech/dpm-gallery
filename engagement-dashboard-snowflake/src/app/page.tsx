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

import { FactsAppEngagement as DataPkg } from "app-engagement";
import { FactsAppEngagement as DataPkgFast } from "snowflake-demo-package-fast";

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
   .orderBy([pkg.fields.foregroundduration, 'DESC'])
});

export default async function Home() {

  const activePkg = DataPkgFast;

  const [
    genderData,
    ageData,
    ethnicityData,
    sessionData
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
    .execute()
  ]));

  return (
    <main className="p-12">
      <Title>Data Packages on Snowflake</Title>
      <Text>Uses Data Packages to embed Snowflake data in a React App. Tremor charts for visualization.</Text>

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
                <Title>Top Sessions By Duration</Title>
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
                      <TableRow key={row.foregroundduration}>
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
