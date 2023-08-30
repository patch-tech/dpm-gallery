import { Card, Title, LineChart, BarChart } from "@tremor/react";
import { FactsAppEngagement } from "app-engagement";

export default async function Home() {

  const {
    age,
    appTitle
  } = FactsAppEngagement.fields;

  const chartData = await FactsAppEngagement.select(
    age,
    appTitle.countDistinct().as("appCount"))
  .orderBy([age, 'ASC'])
  .filter(age.isNotNull())
  .limit(100000)
  .execute();

  const fmtData = chartData.map((o: any) => ({ age: o.AGE.toString(), appCount: o.appCount.toString() }));

  return (
    <Card>
      <Title>App Count By Age</Title>
      <BarChart
        className="mt-8 h-800px"
        data={fmtData}
        index="age"
        categories={["appCount"]}
        colors={["red"]}
        yAxisWidth={40}
        showLegend={true}
      />
    </Card>
  )
};
