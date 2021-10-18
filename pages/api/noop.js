import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req,
  res
) {
  res.status(200).end('noop')
}