import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Create a success response
    const response = NextResponse.json(
      { success: true, message: "Logout successful." },
      { status: 200 }
    );
    
    // This is the key part: set the 'token' cookie with a maxAge of 0
    // This tells the browser to delete the cookie immediately.
    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: "/",
      maxAge: 0, // Expire the cookie
    });

    return response;

  } catch (error) {
    console.error("Error logging out:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred during logout." },
      { status: 500 }
    );
  }
}