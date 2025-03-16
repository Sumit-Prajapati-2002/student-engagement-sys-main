import { getUserByUsernameOrEmail } from "@/lib/db";
import { compare } from "bcryptjs";
import { NextResponse } from "next/server";
import * as jose from "jose";

import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    const dbUser = await getUserByUsernameOrEmail(username);

    if (dbUser == null) {
      return NextResponse.json(
        {
          success: false,
          message: "User does not exist.",
        },
        {
          status: 404,
        }
      );
    }

    const comparedPassword = await compare(password, dbUser.password);

    if (comparedPassword == false) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid pw",
        },
        {
          status: 400,
        }
      );
    }

    const token = await new jose.SignJWT({ username: dbUser.username })
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .sign(new TextEncoder().encode(process.env.JWT_SECRET!));

    (await cookies()).set("token", token);

    const response = NextResponse.json(
      { success: true, message: "Login successful." },
      { status: 200 }
    );

    return response;
  } catch (error) {
    console.error("Error sending verification ", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to send verification ",
      },
      {
        status: 500,
      }
    );
  }
}
