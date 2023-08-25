// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // const requestHeaders: HeadersInit = new Headers();

  // requestHeaders.set("Content-Type", "application/json");
  // requestHeaders.set("Authorization", `Bearer ${process.env.UHERO_KEY}`);

  const { id, start } = req.query;
  try {
    const data = await fetch(
      `https://api.uhero.hawaii.edu/v1/package/series?u=uhero&id=${id}`,
      { headers: { Authorization: `Bearer ${process.env.UHERO_KEY}` } }
    );

    if (!data.ok) {
      throw new Error(`Request failed with status: ${data.status}`);
    }

    const jsonData = await data.json();
    res.status(200).json(jsonData);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({
        message: "An error occurred while processing the request.",
        error: error.message,
      });
    } else {
      res.status(500).json({
        message: "An unknown error occurred while processing the request.",
      });
    }
  }
}
