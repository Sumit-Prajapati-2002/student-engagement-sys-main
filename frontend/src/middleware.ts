import { NextResponse, NextRequest } from "next/server";
import * as jose from "jose";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  // If no token is found, redirect to the login page
  if (token == null) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    // Verify the JWT token
    const { payload } = await jose.jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET!)
    );
    console.log(payload);

    // Log the username from the token payload
    if (payload.username) {
      console.log(payload.username);
    } else {
      console.log("Username not found in payload");
    }
  } catch (err) {
    console.log("Token verification failed:", err);

    // If the token is invalid, respond with an error message
    return NextResponse.json(
      {
        success: false,
        message: "Invalid token",
      },
      {
        status: 403,
      }
    );
  }

  // Allow the request to continue
  return NextResponse.next();
}

// Apply the middleware to the root or specific paths
export const config = {
  matcher: ["/", "/datascience", "/chat", "/roadmap", "/jobs"], // This can be updated to match specific paths if needed
};
