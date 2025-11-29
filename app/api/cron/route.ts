import dbConnect from "@/lib/dbConnect";
import Capsule from "@/models/Capsule";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // 1. Secure the endpoint
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  await dbConnect();

  try {
    const now = new Date();

    // 2. Find all capsules that are past their unlock date and are still 'sealed'
    // (We will add 'sealed' status in a later step, for now we can use 'cooling-down')
    const dueCapsules = await Capsule.find({
      unlockDate: { $lte: now }, // $lte means "less than or equal to"
      status: 'cooling-down', // We'll change this to 'sealed' later
    });

    if (dueCapsules.length === 0) {
      return NextResponse.json({ success: true, message: "No capsules are due for unlocking." });
    }

    // 3. For each due capsule, update its status to 'unlocked'
    for (const capsule of dueCapsules) {
      capsule.status = 'unlocked';
      await capsule.save();
      
      // In the future, we will send an email here. For now, we'll log it.
      console.log(`Unlocked capsule: ${capsule.title} for user ${capsule.user}`);
    }

    return NextResponse.json(
      { success: true, message: `Successfully unlocked ${dueCapsules.length} capsule(s).` }
    );

  } catch (error) {
    console.error("Error in CRON job:", error);
    return NextResponse.json(
      { success: false, message: "An error occurred during the CRON job." },
      { status: 500 }
    );
  }
}