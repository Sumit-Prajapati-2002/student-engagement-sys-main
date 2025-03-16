import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    // Clearing the 'token' cookie
    const cookieStore = cookies();
    (await cookieStore).delete("token");

    const response = NextResponse.json(
      { success: true, message: "Logged out successfully." },
      { status: 200 }
    );

    return response;
  } catch (error) {
    console.error("Error during logout", error);
    return NextResponse.json(
      { success: false, message: "Failed to log out" },
      { status: 500 }
    );
  }
}
