// app/api/search_jobs/route.ts
import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    // Send the query to the Flask backend
    const { data } = await axios.post(
      "http://127.0.0.1:5000/search_jobs", // Updated to match Flask endpoint
      { query }, // Changed from field to query to match Flask endpoint
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    console.log("Flask API response:", data);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in job search:", error);
    return NextResponse.json(
      { error: "Failed to fetch job recommendations" },
      { status: 500 }
    );
  }
}
