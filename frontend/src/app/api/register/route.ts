import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { getUserByUsername } from "@/lib/db";
import { getUserByEmail } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json();
    const dbUser = await getUserByUsername(username);
    const dbEmail = await getUserByEmail(email);
    console.log(dbUser);
    if (dbUser != null) {
      return Response.json(
        {
          success: false,
          message: "Username already exists.",
        },
        {
          status: 400,
        }
      );
    }
    if (dbEmail != null) {
      return Response.json(
        {
          success: false,
          message: "Email already exists.",
        },
        {
          status: 400,
        }
      );
    }
    await UserModel.insertOne({
      username,
      email,
      password: bcrypt.hashSync(password, 10),
      isVerified: false,
      isAcceptingMessages: true,
      messages: [],
    });
    return Response.json(
      {
        success: true,
        message: "User created successfully.",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error signing up", error);
    return Response.json(
      {
        success: false,
        message: "Failed to sign up.",
      },
      {
        status: 500,
      }
    );
  }
}
