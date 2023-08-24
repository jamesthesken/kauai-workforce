const industries = [
  {
    industry: "(10) Total, all industries",
    qtlyEstablishments: "2,792",
    aprEmplyoment: "25,169",
    mayEmplyoment: "25,335",
    juneEmplyoment: "25,148",
    totalWages: "$312,497,710",
    avgWages: "$953",
  },
  {
    industry: "(23822) Plumbing and HVAC Contractors",
    qtlyEstablishments: "29",
    aprEmplyoment: "215",
    mayEmplyoment: "213",
    juneEmplyoment: "219",
    totalWages: "$3,309,937",
    avgWages: "$1,181",
  },
  {
    industry: "(8111) Automotive Repair and Maintenance",
    qtlyEstablishments: "31",
    aprEmplyoment: "144",
    mayEmplyoment: "148",
    juneEmplyoment: "138",
    totalWages: "$1,730500",
    avgWages: "$929",
  },
  {
    industry: "(56173) Landscaping Services",
    qtlyEstablishments: "71",
    aprEmplyoment: "382",
    mayEmplyoment: "377",
    juneEmplyoment: "381",
    totalWages: "$3,735,005",
    avgWages: "$756",
  },
  {
    industry: "(484) Truck Transportation",
    qtlyEstablishments: "13",
    aprEmplyoment: "105",
    mayEmplyoment: "102",
    juneEmplyoment: "101",
    totalWages: "$1,313,082",
    avgWages: "$984",
  },
];

export default function Table() {
  return (
    <div className="sm:px-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-50">
            Industry Data - Q3 2021
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Source:{" "}
            <a href="https://data.bls.gov/cew/apps/table_maker/v4/table_maker.htm#type=8&year=2021&qtr=3&own=5&area=15007&supp=0">
              Bureau of Labor Statistics
            </a>
          </p>
        </div>
      </div>
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-800">
                <thead className="bg-gray-900">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-50 sm:pl-6"
                    >
                      NAICS Industry
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-50"
                    >
                      Quarterly Establishments
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-50"
                    >
                      April Employment
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-50"
                    >
                      May Employment
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-600 bg-gray-800">
                  {industries.map((industry) => (
                    <tr key={industry.industry}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-300 sm:pl-6">
                        {industry.industry}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                        {industry.qtlyEstablishments}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                        {industry.aprEmplyoment}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                        {industry.mayEmplyoment}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
