"use server"

import { sql } from '@vercel/postgres';

export async function getBlogPosts() {
  try {
    const { rows, fields } =
      await sql`SELECT * FROM posts LIMIT 5;`;
    return rows;
  } catch (error) {
    console.error("Error:", error);
  }
}