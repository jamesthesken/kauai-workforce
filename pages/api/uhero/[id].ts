// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const requestHeaders: HeadersInit = new Headers();

  requestHeaders.set("Content-Type", "application/json");
  requestHeaders.set("Authorization", `Bearer ${process.env.UHERO_KEY}`);

  const { id, start } = req.query;

  const data = await fetch(
    `http://api.uhero.hawaii.edu/v1/package/series?u=uhero&id=${id}&fc=&start=${start}`,
    { headers: requestHeaders }
  );

  const jsonData = await data.json();

  res.status(200).json(jsonData);
}