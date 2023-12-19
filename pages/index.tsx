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
  BarElement,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import Table from "@/components/Table";

import {
  Card,
  Title,
  LineChart,
  Subtitle,
  DonutChart,
  Legend as TremorLegend,
  BarChart,
  TabGroup,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Flex,
  Text,
  BadgeDelta,
  Metric,
} from "@tremor/react";

import { testData, truckData, finalData } from "./api/data.js";
import Contact from "../components/Contact";
import { InferGetStaticPropsType } from "next";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import { jobsData, certificationData } from "../data/job_openings.js";
import classNames from "classnames";
import Badge from "../components/Badge";

export type JobsData = {
  Area: string;
  "Time Period": string;
  Occupation: string;
  "Occupation Code": string;
  "Job Openings": string;
  "New Job Postings": string;
  null?: string[];
}[];

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
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

  const pc1Data = apiData?.transformationResults.find(
    (result) => result.transformation === "pc1"
  );
  const ytdData = apiData?.transformationResults.find(
    (result) => result.transformation === "ytd"
  );
  const lvlData = apiData?.transformationResults.find(
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
  return fetch(`/api/uhero/${id}`);
}

async function jobsByIndustry() {
  const requestHeaders: HeadersInit = new Headers();

  requestHeaders.set("Content-Type", "application/json");
  requestHeaders.set("Authorization", `Bearer ${process.env.UHERO_KEY}`);

  const categoryData = [
    { name: "Construction", url: `${process.env.API_URL}&id=159410` },
    { name: "Retail", url: `${process.env.API_URL}&id=159472` },
    { name: "Transportation", url: `${process.env.API_URL}&id=150350` },
    { name: "Food Services", url: `${process.env.API_URL}&id=159738` },
    { name: "Accommodation", url: `${process.env.API_URL}&id=159732` },
    { name: "Government", url: `${process.env.API_URL}&id=159430` },
    { name: "Healthcare", url: `${process.env.API_URL}&id=159433` },
    { name: "Arts and Entertainment", url: `${process.env.API_URL}&id=159405` },
  ];

  const responses = await Promise.all(
    categoryData.map((category) =>
      fetch(category.url, { headers: requestHeaders }).then((res) => res.json())
    )
  );

  const transformedData = responses.map((res, index) => {
    const lvlData =
      res.data.observations.transformationResults
        .filter((t: any) => t.transformation === "lvl")[0]
        .values.slice(-1)[0] * 1000;

    return {
      category: categoryData[index].name,
      lvlData: lvlData,
    };
  });

  return transformedData;
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
      .filter((t: any) => t.transformation === "lvl")[0]
      .values.slice(-1)[0] * 1000;

  const currentPopObservationDate = population.data.observations.observationEnd;

  const currentLaborForce =
    civilianLabor.data.observations.transformationResults
      .filter((t: any) => t.transformation === "lvl")[0]
      .values.slice(-1)[0] * 1000;

  const currentLaborForceDate = civilianLabor.data.observations.observationEnd;
  console.log(currentLaborForceDate);

  const unemploymentRate = unemployment.data.observations.transformationResults
    .filter((t: any) => t.transformation === "lvl")[0]
    .values.slice(-1)[0];

  // calculate unemployment rate delta from previous month
  const previousUnemploymentRate =
    unemployment.data.observations.transformationResults
      .filter((t: any) => t.transformation === "lvl")[0]
      .values.slice(-2)[0];

  const unemploymentRateDelta = Number(
    (unemploymentRate - previousUnemploymentRate).toFixed(2)
  );

  // calculate labor force delta from previous month
  const previousLaborForce =
    civilianLabor.data.observations.transformationResults
      .filter((t: any) => t.transformation === "lvl")[0]
      .values.slice(-2)[0] * 1000;

  const laborForceDelta = Number(
    (
      ((currentLaborForce - previousLaborForce) / previousLaborForce) *
      100
    ).toFixed(2)
  );

  // calculate population delta from previous month
  const previousPop =
    population.data.observations.transformationResults
      .filter((t: any) => t.transformation === "lvl")[0]
      .values.slice(-2)[0] * 1000;

  console.log(previousPop);

  const populationDelta = Number((currentPop - previousPop).toFixed(2));

  const unemploymentRateDate = unemployment.data.observations.observationEnd;

  const laborPieChart = await jobsByIndustry();

  return {
    props: {
      unemploymentRateDate,
      currentLaborForceDate,
      currentPopObservationDate,
      currentPop,
      currentLaborForce,
      laborForceDelta,
      unemploymentRate,
      unemploymentRateDelta,
      populationDelta,
      laborPieChart,
    },
  };
}

export default function Home({
  currentPop,
  currentPopObservationDate,
  currentLaborForceDate,
  unemploymentRateDate,
  currentLaborForce,
  unemploymentRate,
  unemploymentRateDelta,
  populationDelta,
  laborForceDelta,
  laborPieChart,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const [industry, setIndustry] = useState<keyof typeof finalData>("trucking");

  // convert date of format 2021-06-01 to June 2021
  function formatDate(observationEnd: string | number): string {
    const date = new Date(observationEnd);
    const month = date.getUTCMonth() + 1; // get the month and adjust it by 1
    const year = date.getUTCFullYear(); // get the year
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return `${monthNames[month - 1]} ${year}`; // return the formatted date
  }

  const { data: unemploymentData, isLoading } = useQuery({
    queryKey: ["uiData"],
    queryFn: () => fetchUheroData(153621).then((res) => res.json()),
  });

  console.log(unemploymentData);

  const { data: visitorArrivals, isLoading: loadingVisitorStats } = useQuery({
    queryKey: ["visitorArrivals"],
    queryFn: () => fetchUheroData(154687).then((res) => res.json()),
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

  const formatJobData = (number: number) =>
    `${Intl.NumberFormat("us").format(number).toString()}`;

  const jobOpenings = {
    labels: [
      "Architecture and Engineering Occupations",
      "Arts; Design; Entertainment; Sports; and Media Occ",
      "Building and Grounds Cleaning and Maintenance Occu",
      "Business and Financial Operations Occupations",
      "Community and Social Service Occupations",
      "Computer and Mathematical Occupations",
      "Construction and Extraction Occupations",
      "Educational Instruction and Library Occupations",
      "Farming; Fishing; and Forestry Occupations",
      "Food Preparation and Serving Related Occupations",
      "Healthcare Practitioners and Technical Occupations",
      "Healthcare Support Occupations",
      "Installation; Maintenance; and Repair Occupations",
      "Legal Occupations",
      "Life; Physical; and Social Science Occupations",
      "Management Occupations",
      "Military Specific Occupations",
      "Office and Administrative Support Occupations",
      "Personal Care and Service Occupations",
      "Production Occupations",
      "Protective Service Occupations",
      "Sales and Related Occupations",
      "Transportation and Material Moving Occupations",
    ],
    datasets: [
      {
        label: "Kauai County",
        data: [
          72, 31, 90, 53, 24, 73, 25, 22, 2, 197, 299, 88, 77, 1, 19, 133, 0,
          140, 80, 24, 51, 167, 149,
        ],
        backgroundColor: "#b91c1c",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
      {
        label: "State of Hawaii",
        data: [
          875, 449, 848, 924, 543, 928, 311, 474, 43, 2, 4, 900, 899, 112, 345,
          2, 52, 2, 770, 485, 679, 2, 1,
        ],
        backgroundColor: "#1d4ed8",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      title: {
        display: true,
        text: "Job Openings by Industry",
      },
      legend: {
        display: true,
        labels: {
          color: "rgb(107 114 128)",
        },
      },
    },
    responsive: true,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },

    scales: {
      x: {
        stacked: true,
        ticks: {
          color: "rgb(107 114 128)",
          font: {
            size: 12,
          },
        },
      },
      y: {
        stacked: true,
        ticks: {
          color: "rgb(107 114 128)",
          font: {
            size: 12,
          },
        },
      },
    },
  };

  return (
    <>
      <Head>
        <title>Kauai Workforce Dashboard</title>
        <meta name="description" content="Kauai County Economic Dashboard" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="dark:bg-gradient-to-b dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 bg-gray-100 min-h-screen">
        <div className="absolute inset-x-0 top-0 z-50">
          {" "}
          <NavBar />
        </div>

        <section id="hero">
          <div className="relative isolate px-6 pt-14 lg:px-8">
            <div className="mx-auto max-w-2xl pt-20">
              <div
                className="absolute inset-x-0 -top-80 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
                aria-hidden="true"
              >
                <div
                  className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-r from-purple-200 to-purple-500 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                  style={{
                    clipPath:
                      "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                  }}
                />
              </div>
              <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tight dark:text-gray-100 text-gray-800 sm:text-6xl">
                  Kauai Workforce Dashboard
                </h1>
                <p className="mt-6 text-lg leading-8 dark:text-gray-300 text-gray-600 ">
                  Welcome! This site displays workforce statistics for the
                  County of Kauai. Data is collected from the Bureau of Labor
                  Statistics and the State of Hawaii. If you are interested in
                  more data or visualizations, please contact us.
                </p>
              </div>
            </div>
            <div
              className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
              aria-hidden="true"
            >
              <div
                className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-r from-purple-200 to-purple-500 opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
                style={{
                  clipPath:
                    "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                }}
              />
            </div>
          </div>
        </section>
        <section id="dashboard">
          <div className="container items-center px-6 mx-auto mt-10 ">
            <div>
              <h3 className="text-lg font-medium leading-6 dark:text-gray-300 text-gray-700">
                Quick facts
              </h3>
              <div className="flex align-middle">
                <a
                  href="https://dbedt.hawaii.gov/economic/datawarehouse/"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-sm font-medium leading-6 text-gray-500 hover:underline hover:underline-offset-4 align-middle pr-2"
                >
                  Source: U.S. Bureau of Labor Statistics and Hawaii State Dep.
                  of Business, Economic Development <span>&#38;</span> Tourism{" "}
                </a>
                <span>
                  <ArrowUpRightIcon className="w-4 h-4" />
                </span>
              </div>
              <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
                {/* <div className="overflow-hidden rounded-lg dark:bg-gray-800 bg-white px-4 py-5 shadow sm:p-6">
                  <dt className="truncate text-sm font-medium dark:text-gray-400 text-gray-500">
                    Resident Population
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold tracking-tight dark:text-gray-100 text-gray-800">
                    {currentPop.toLocaleString()}
                  </dd>
                  <dd>
                    <span className="text-xs text-gray-500">
                      {formatDate(currentPopObservationDate)}
                    </span>
                  </dd>
                </div> */}
                <Card className="max-w-sm">
                  <Flex justifyContent="between" alignItems="center">
                    <Text>Resident Population</Text>
                  </Flex>
                  <Metric> {currentPop.toLocaleString()}</Metric>
                  <Flex alignItems="baseline" className="space-x-2 mt-4">
                    <Text>{formatDate(currentPopObservationDate)}</Text>
                  </Flex>
                </Card>
                <Card className="max-w-sm">
                  <Flex justifyContent="between" alignItems="center">
                    <Text>Total Employed</Text>
                    <BadgeDelta
                      deltaType="moderateIncrease"
                      isIncreasePositive={true}
                      size="xs"
                    >
                      {laborForceDelta.toLocaleString()}%
                    </BadgeDelta>
                  </Flex>
                  <Metric>{currentLaborForce.toLocaleString()}</Metric>
                  <Flex alignItems="baseline" className="space-x-2 mt-4">
                    <Text>{formatDate(currentLaborForceDate)}</Text>
                  </Flex>
                </Card>
                <Card className="max-w-sm">
                  <Flex justifyContent="between" alignItems="center">
                    <Text>Unemployment Rate</Text>
                    <BadgeDelta
                      deltaType={
                        unemploymentRateDelta > 0
                          ? "moderateIncrease"
                          : "moderateDecrease"
                      }
                      isIncreasePositive={false}
                      size="xs"
                    >
                      {unemploymentRateDelta}%
                    </BadgeDelta>
                  </Flex>
                  <Metric>{unemploymentRate}%</Metric>
                  <Flex alignItems="baseline" className="space-x-2 mt-4">
                    <Text>{formatDate(unemploymentRateDate)}</Text>
                  </Flex>
                </Card>
                {/* <div className="overflow-hidden rounded-lg dark:bg-gray-800 bg-white  px-4 py-5 shadow sm:p-6">
                  <dt className="truncate text-sm font-medium dark:text-gray-400 text-gray-500">
                    Total Employed
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold tracking-tight dark:text-gray-100 text-gray-800">
                    {currentLaborForce.toLocaleString()}
                  </dd>
                  <dd>
                    <span className="text-xs text-gray-500">
                      {formatDate(currentLaborForceDate)}
                    </span>
                  </dd>
                </div>
                <div className="overflow-hidden rounded-lg dark:bg-gray-800 bg-white px-4 py-5 shadow sm:p-6">
                  <dt className="truncate text-sm font-medium dark:text-gray-400 text-gray-500">
                    Unemployment Rate
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold tracking-tight dark:text-gray-100 text-gray-800">
                    {unemploymentRate} %
                  </dd>
                  <dd>
                    <span className="text-xs text-gray-500">
                      {formatDate(unemploymentRateDate)}
                    </span>
                  </dd>
                </div> */}
              </dl>
            </div>
            <div className="mt-20 grid grid-cols-1 items-end  gap-5 ">
              <Card>
                <Title>Top In-Demand Certifications (Kauai County)</Title>
                <Subtitle>
                  <a
                    href="https://www.hirenethawaii.com/vosnet/lmi/default.aspx?plang=E&qlink=1"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="hover:underline underline-offset-1"
                  >
                    Hawaii Workforce Infonet, Oct. 2023
                  </a>
                </Subtitle>
                <div className="mt-8 flex flex-col">
                  <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                      <div className="overflow-hidden dark:shadow dark:ring-1 dark:ring-black dark:ring-opacity-5 md:rounded-lg">
                        <table className="min-w-full divide-y dark:divide-gray-800 divide-gray-300">
                          <thead className="dark:bg-gray-900">
                            <tr>
                              <th
                                scope="col"
                                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold dark:text-gray-50 text-gray-900 sm:pl-6"
                              >
                                Type
                              </th>
                              <th
                                scope="col"
                                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold dark:text-gray-50 text-gray-900 sm:pl-6"
                              >
                                Certification
                              </th>

                              <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-sm font-semibold dark:text-gray-50 text-gray-900"
                              >
                                Job Openings
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y dark:divide-gray-600 divide-gray-200">
                            {certificationData.map((cert) => (
                              <tr key={cert.Rank}>
                                <td className="whitespace-nowrap px-3 py-4 text-sm dark:text-gray-300 text-gray-900">
                                  {/* <span
                                    className={classNames( `inline-flex items-center rounded-md bg-$-400/10 px-2 py-1 text-xs font-medium text-${cert["Color Code"]}-400 ring-1 ring-inset ring-${cert["Color Code"]}-400/20`)}
                                  >
                                    {
                                      cert[
                                        "Advertised Certification Sub-Category"
                                      ]
                                    }
                                  </span> */}
                                  <Badge
                                    text={
                                      cert[
                                        "Advertised Certification Sub-Category"
                                      ]
                                    }
                                    color={cert["Color Code"]}
                                  />
                                </td>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium dark:text-gray-300 text-gray-900 sm:pl-6">
                                  {cert["Advertised Certification Group"]}
                                </td>

                                <td className="whitespace-nowrap px-3 py-4 text-sm dark:text-gray-300 text-gray-900">
                                  {cert["Job Opening Match Count"]}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            <TabGroup>
              <TabList className="mt-8">
                <Tab>Chart</Tab>
                <Tab>Table</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <div className="grid grid-cols-1 items-end  gap-5 ">
                    <Card>
                      <Title>Job Openings by Industry</Title>
                      <Subtitle>
                        <a
                          href="https://www.hirenethawaii.com/vosnet/lmi/default.aspx?plang=E&qlink=1"
                          target="_blank"
                          rel="noreferrer noopener"
                          className="hover:underline underline-offset-1"
                        >
                          Hawaii Workforce Infonet, Oct. 2023
                        </a>
                      </Subtitle>
                      <Bar options={options} data={jobOpenings} />
                    </Card>
                  </div>
                </TabPanel>
                <TabPanel>
                  <div className="grid grid-cols-1 items-end  gap-5 ">
                    <Card>
                      <Title>Job Openings by Industry</Title>
                      <Subtitle>
                        <a
                          href="https://www.hirenethawaii.com/vosnet/lmi/default.aspx?plang=E&qlink=1"
                          target="_blank"
                          rel="noreferrer noopener"
                          className="hover:underline underline-offset-1"
                        >
                          Hawaii Workforce Infonet, Oct. 2023
                        </a>
                      </Subtitle>
                      <div className="mt-8 flex flex-col">
                        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                            <div className="overflow-hidden dark:shadow dark:ring-1 dark:ring-black dark:ring-opacity-5 md:rounded-lg">
                              <table className="min-w-full divide-y dark:divide-gray-800 divide-gray-300">
                                <thead className="dark:bg-gray-900">
                                  <tr>
                                    <th
                                      scope="col"
                                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold dark:text-gray-50 text-gray-900 sm:pl-6"
                                    >
                                      Area
                                    </th>
                                    <th
                                      scope="col"
                                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold dark:text-gray-50 text-gray-900 sm:pl-6"
                                    >
                                      Occupation
                                    </th>
                                    <th
                                      scope="col"
                                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold dark:text-gray-50 text-gray-900 sm:pl-6"
                                    >
                                      Job Openings
                                    </th>
                                    <th
                                      scope="col"
                                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold dark:text-gray-50 text-gray-900 sm:pl-6"
                                    >
                                      New Openings
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y dark:divide-gray-600 divide-gray-200">
                                  {jobsData.map((job) => (
                                    <tr key={job.id}>
                                      <td className="whitespace-nowrap px-3 py-4 text-sm dark:text-gray-300 text-gray-900">
                                        {job.Area}
                                      </td>
                                      <td className="whitespace-nowrap px-3 py-4 text-sm dark:text-gray-300 text-gray-900">
                                        {job.Occupation}
                                      </td>
                                      <td className="whitespace-nowrap px-3 py-4 text-sm dark:text-gray-300 text-gray-900">
                                        {job["Job Openings"]}
                                      </td>
                                      <td className="whitespace-nowrap px-3 py-4 text-sm dark:text-gray-300 text-gray-900">
                                        {job["New Job Postings"]}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </TabPanel>
              </TabPanels>
            </TabGroup>
            <div className="border dark:border-gray-600 border-gray-200 mt-20 w-full"></div>
            <div className="mt-20 grid grid-cols-1 items-end  gap-5 sm:grid-cols-3">
              <div className="sm:col-span-3">
                <Card>
                  <Title>Unemployment Rate (Monthly)</Title>
                  <Subtitle>
                    {unemploymentData?.data?.series?.sourceDescription}
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
                        unemploymentData?.data?.observations,
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
            <div className="border dark:border-gray-600 border-gray-200 mt-20 w-full"></div>
            <div className="mt-20 grid grid-cols-1 items-end  gap-5 sm:grid-cols-3">
              <h3 className="text-lg font-medium leading-6 dark:text-gray-300 text-gray-700">
                Other cool datasets 👀
              </h3>
              <div className="sm:col-span-3">
                <Card>
                  <Title>Total Visitor Arrivals (Monthly)</Title>
                  <Subtitle>
                    {visitorArrivals?.data?.series?.sourceDescription}
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
                        visitorArrivals?.data?.observations,
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
                    {dailyRoomRate?.data?.series?.sourceDescription}
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
                        dailyRoomRate?.data?.observations,
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
            <div className="border dark:border-gray-600 border-gray-200 mt-20 w-full"></div>
            {/* <div className="mt-20 grid grid-cols-1 gap-5 items-end md:grid-cols-3">
              <div className="md:col-span-1">
                <h1 className="text-2xl pb-5 dark:text-gray-100 text-gray-800 font-bold text-center md:text-3xl md:text-left">
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
            </div> */}
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
