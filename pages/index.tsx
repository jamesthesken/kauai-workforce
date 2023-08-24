import { useEffect, useState } from "react";
import Head from "next/head";
import NavBar from "@/components/NavBar";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Colors,
} from "chart.js";
import { Doughnut, Line } from "react-chartjs-2";
import Table from "@/components/Table";

import { Card, Title, LineChart, Subtitle } from "@tremor/react";

import { testData, truckData, finalData } from "./api/data.js";
import Dropdown from "@/components/Dropdown";
import Contact from "../components/Contact";
import { InferGetStaticPropsType } from "next";
import { useQuery } from "@tanstack/react-query";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Colors
);

interface TransformationResult {
  transformation: string;
  dates: string[];
  values: string[];
}

interface ChartDataEntry {
  date: string;
  [transformation: string]: number | string;
}

export const data = {
  labels: [
    "Nat. Resources",
    "Retail",
    "Transportation",
    "Financial Activities",
    "Prof. Services",
    "Food/Drink Services",
    "Government",
    "Health care",
    "Accomodation",
  ],
  datasets: [
    {
      label: "# Employed",
      data: [2300, 3800, 1600, 900, 2800, 4400, 4900, 2700, 4000],
      fontColor: "rgb(156 163 175)",
      backgroundColor: [
        "rgba(255, 99, 132, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(255, 206, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(153, 102, 255, 0.2)",
        "rgba(255, 159, 64, 0.2)",
      ],
      borderColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
        "rgba(255, 159, 64, 1)",
      ],
      borderWidth: 1,
    },
  ],
};

// Line Chart
const labels = ["January", "February", "March", "April", "May", "June", "July"];

export const lineData = {
  labels: ["Jun", "Jul", "Aug"],
  datasets: [
    {
      label: "Dataset 1",
      data: {
        id: 1,
        label: "",
        data: [5, 6, 7, 8, 8, 8, 8],
      },
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
  ],
};

function transformData(
  apiData: {
    transformationResults: TransformationResult[];
  },
  lvlOverride?: string
): ChartDataEntry[] {
  const transformedData: ChartDataEntry[] = [];

  const pc1Data = apiData.transformationResults.find(
    (result) => result.transformation === "pc1"
  );
  const ytdData = apiData.transformationResults.find(
    (result) => result.transformation === "ytd"
  );
  const lvlData = apiData.transformationResults.find(
    (result) => result.transformation === "lvl"
  );

  if (pc1Data && ytdData && lvlData) {
    for (let i = 0; i < pc1Data.dates.length; i++) {
      const date = pc1Data.dates[i];
      const entry: ChartDataEntry = { date };

      entry.pc1 = parseFloat(pc1Data.values[i]);
      entry.ytd = parseFloat(ytdData.values[i]);

      if (lvlOverride) {
        entry[lvlOverride] = parseFloat(
          lvlData.values[lvlData.dates.indexOf(date)]
        );
      } else if (!lvlOverride) {
        entry.lvl = parseFloat(lvlData.values[lvlData.dates.indexOf(date)]);
      }

      transformedData.push(entry);
    }
  }

  return transformedData;
}

function fetchUheroData(id: number, start?: string) {
  const requestHeaders: HeadersInit = new Headers();

  requestHeaders.set("Content-Type", "application/json");
  requestHeaders.set("Authorization", `Bearer ${process.env.UHERO_KEY}`);
  return fetch(`/api/uhero/${id}&${start}`);
}

export async function getStaticProps() {
  const requestHeaders: HeadersInit = new Headers();

  requestHeaders.set("Content-Type", "application/json");
  requestHeaders.set("Authorization", `Bearer ${process.env.UHERO_KEY}`);

  const [populationRes, laborForceRes, uiRes] = await Promise.all([
    fetch(`${process.env.API_URL}&id=151308`, {
      headers: requestHeaders,
    }),
    fetch(`${process.env.API_URL}&id=149154`, {
      headers: requestHeaders,
    }),
    fetch(`${process.env.API_URL}&id=153621`, {
      headers: requestHeaders,
    }),
  ]);

  const [population, civilianLabor, unemployment] = await Promise.all([
    populationRes.json(),
    laborForceRes.json(),
    uiRes.json(),
  ]);

  const currentPop =
    population.data.observations.transformationResults
      .filter((t) => t.transformation === "lvl")[0]
      .values.slice(-1)[0] * 1000;

  const currentLaborForce =
    civilianLabor.data.observations.transformationResults
      .filter((t) => t.transformation === "lvl")[0]
      .values.slice(-1)[0] * 1000;

  const unemploymentRate = unemployment.data.observations.transformationResults
    .filter((t) => t.transformation === "lvl")[0]
    .values.slice(-1)[0];

  return {
    props: { currentPop, currentLaborForce, unemploymentRate },
  };
}

export default function Home({
  currentPop,
  currentLaborForce,
  unemploymentRate,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [industry, setIndustry] = useState<keyof typeof finalData>("trucking");

  const { data: unemploymentData, isLoading } = useQuery({
    queryKey: ["uiData"],
    queryFn: () => fetchUheroData(153621).then((res) => res.json()),
  });

  const { data: visitorArrivals, isLoading: loadingVisitorStats } = useQuery({
    queryKey: ["visitorArrivals"],
    queryFn: () =>
      fetchUheroData(154687, "2019-01-01").then((res) => res.json()),
  });

  const { data: dailyRoomRate, isLoading: loadingRoomRate } = useQuery({
    queryKey: ["dailyRoomRate"],
    queryFn: () => fetchUheroData(146809).then((res) => res.json()),
  });

  const dataFormatter = (number: number) =>
    `${Intl.NumberFormat("us").format(number).toString()}%`;

  const formatVisitorData = (number: number) =>
    `${Intl.NumberFormat("us")
      .format(number * 1000)
      .toLocaleString()}`;

  const formatRateData = (number: number) =>
    `$${Intl.NumberFormat("us").format(number).toString()}`;

  console.log(unemploymentData);

  return (
    <>
      <Head>
        <title>Kauai Workforce Dashboard</title>
        <meta name="description" content="Kauai County Economic Dashboard" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 min-h-screen">
        <NavBar />
        <section id="hero">
          <div
            className="container flex flex-col-reverse items-center
          px-6 mx-auto mt-10 md:flex-row"
          >
            {/* Left Item */}
            <div className="flex flex-col space-y-12 items-center md:items-start">
              <h1 className="text-4xl text-gray-100 font-bold text-center md:text-5xl md:text-left">
                Kauai County Data Dashboard
              </h1>
              <p className="max-w-sm text-center text-gray-300 md:text-left">
                Welcome! This site displays workforce statistics for the County
                of Kauai. Data is collected from the Bureau of Labor Statistics
                and the State of Hawaii. If you are interested in more data or
                visualizations, please contact us.
              </p>
              <div className="border border-gray-600 w-full"></div>
            </div>
            {/* Right Item */}
          </div>
        </section>
        <section id="dashboard">
          <div className="container items-center px-6 mx-auto mt-10 ">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-300">
                Quick facts
              </h3>
              <a
                href="https://dbedt.hawaii.gov/economic/datawarehouse/"
                className="text-sm font-medium leading-6 text-gray-500"
              >
                Source: U.S. Bureau of Labor Statistics and Hawaii State Dep. of
                Business, Economic Development <span>&#38;</span> Tourism
              </a>
              <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div className="overflow-hidden rounded-lg bg-gray-800 px-4 py-5 shadow sm:p-6">
                  <dt className="truncate text-sm font-medium text-gray-400">
                    Resident Population
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-100">
                    {currentPop.toLocaleString()}
                  </dd>
                </div>
                <div className="overflow-hidden rounded-lg bg-gray-800 px-4 py-5 shadow sm:p-6">
                  <dt className="truncate text-sm font-medium text-gray-400">
                    Total Employed
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-100">
                    {currentLaborForce.toLocaleString()}
                  </dd>
                </div>
                <div className="overflow-hidden rounded-lg bg-gray-800 px-4 py-5 shadow sm:p-6">
                  <dt className="truncate text-sm font-medium text-gray-400">
                    Unemployment Rate
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-100">
                    {unemploymentRate} %
                  </dd>
                </div>
              </dl>
            </div>
            <div className="mt-20 grid grid-cols-1 items-end  gap-5 sm:grid-cols-3">
              <div className="sm:col-span-3">
                <Card>
                  <Title>Unemployment Rate (Monthly)</Title>
                  <Subtitle>
                    Source: {unemploymentData?.data.series.sourceDescription}
                  </Subtitle>
                  {isLoading ? (
                    <>
                      <p className="text-sm text-gray-300">Loading data...</p>
                      <div
                        className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] text-gray-300"
                        role="status"
                        id="spinner"
                      ></div>
                    </>
                  ) : (
                    <LineChart
                      title="Kauai County Unemployment Rate (Monthly)"
                      showAnimation={false}
                      className="mt-6"
                      data={transformData(
                        unemploymentData?.data.observations,
                        "% Unemployed"
                      )}
                      valueFormatter={dataFormatter}
                      index="date"
                      categories={["% Unemployed"]}
                      colors={["emerald", "gray"]}
                      yAxisWidth={40}
                    />
                  )}
                </Card>
              </div>
            </div>
            <div className="border border-gray-600 mt-20 w-full"></div>
            <div className="mt-20 grid grid-cols-1 items-end  gap-5 sm:grid-cols-3">
              <div className="sm:col-span-3">
                <Card>
                  <Title>Total Visitor Arrivals (Monthly)</Title>
                  <Subtitle>
                    Source: {visitorArrivals?.data.series.sourceDescription}
                  </Subtitle>

                  {loadingVisitorStats ? (
                    <>
                      <p className="text-sm text-gray-300">Loading data...</p>
                      <div
                        className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] text-gray-300"
                        role="status"
                        id="spinner"
                      ></div>
                    </>
                  ) : (
                    <LineChart
                      title="Total Visitor Arrivals (Monthly)"
                      showAnimation={false}
                      className="mt-6"
                      data={transformData(
                        visitorArrivals?.data.observations,
                        "Total Visitor Arrivals"
                      )}
                      valueFormatter={formatVisitorData}
                      index="date"
                      categories={["Total Visitor Arrivals"]}
                      colors={["orange", "gray"]}
                      yAxisWidth={40}
                    />
                  )}
                </Card>
              </div>
            </div>
            <div className="mt-20 grid grid-cols-1 items-end  gap-5 sm:grid-cols-3">
              <div className="sm:col-span-3">
                <Card>
                  <Title>Average Daily Hotel Room Rate (Quarterly)</Title>
                  <Subtitle>
                    Source: {dailyRoomRate?.data.series.sourceDescription}
                  </Subtitle>
                  {loadingRoomRate ? (
                    <>
                      <p className="text-sm text-gray-300">Loading data...</p>
                      <div
                        className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] text-gray-300"
                        role="status"
                        id="spinner"
                      ></div>
                    </>
                  ) : (
                    <LineChart
                      title="Average Daily Hotel Room Rate ($)"
                      showAnimation={false}
                      className="mt-6"
                      data={transformData(
                        dailyRoomRate?.data.observations,
                        "Avg. Daily Room Rate ($)"
                      )}
                      valueFormatter={formatRateData}
                      index="date"
                      categories={["Avg. Daily Room Rate ($)"]}
                      colors={["violet"]}
                      yAxisWidth={40}
                    />
                  )}
                </Card>
              </div>
            </div>
            <div className="border border-gray-600 mt-20 w-full"></div>
            <div className="mt-20 grid grid-cols-1 gap-5 items-end md:grid-cols-3">
              <div className="md:col-span-1">
                <h1 className="text-2xl pb-5 text-gray-100 font-bold text-center md:text-3xl md:text-left">
                  Wages by Industry
                </h1>
                <div className="border-gray-200 h-96 rounded-lg  px-4 py-5 bg-gray-800 sm:px-6">
                  <p className="flex max-w-sm overflow-hidden leading-8 justify-center text-gray-300 md:text-left">
                    The Quarterly Census of Employment and Wages (QCEW) is a
                    quarterly count of employment and wages released by the BLS
                    Response rates are typically high, as the primary source of
                    data is administrative data from employer Quarterly
                    Contributions Reports under the UI law for each state.
                  </p>
                  <a
                    href="https://www.bls.gov/cew/"
                    className="max-w-sm leading-8 text-center justify-center text-gray-500 md:text-left pt-10"
                  >
                    Read more
                  </a>
                </div>
              </div>
              <div className="sm:col-span-2 row-end">
                <div className="border-gray-200 h-96 rounded-lg bg-gray-800 px-4 py-5 sm:px-6">
                  <div className="place-items-end">
                    <Dropdown value={industry} onChange={setIndustry} />
                  </div>

                  <div className="h-full pb-10">
                    <Line
                      data={finalData[industry]}
                      options={{
                        plugins: {
                          title: {
                            display: true,
                            text: finalData[industry].title,
                            color: "rgb(156 163 175)",
                          },
                        },
                        maintainAspectRatio: false,
                        color: "rgb(156 163 175)",
                        elements: {
                          point: {
                            radius: 2,
                          },
                        },
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-20 pb-20 grid grid-cols-1 gap-5">
              <Table />
            </div>
          </div>
        </section>
        <section id="contact">
          <Contact />
        </section>
        <footer>
          <a href="https://kauaitechgroup.com">
            <p className="mt-10 pb-5 text-center text-xs leading-5 text-gray-500">
              &copy; 2023 Kauai Technology Group LLC, All rights reserved.
            </p>
          </a>
        </footer>
      </div>
    </>
  );
}
