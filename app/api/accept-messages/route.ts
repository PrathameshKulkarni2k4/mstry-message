import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth"

export async function POST(request: Request) {
    await dbConnect()

    const session = await getServerSession(authOptions)
    const user = session?.user as User

    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "Not authenticated"
            },
            { status: 401 }
        )
    }

    const userId = user._id;
    const { acceptMessage } = await request.json()

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {
                isAcceptingMessages: acceptMessage
            },
            { new: user }
        )

        if (!updatedUser) {
            return Response.json(
                {
                    success: false,
                    message: "failed to update user status to accept message"
                },
                { status: 401 }
            )
        }

        return Response.json(
            {
                success: true,
                message: "Message acceptance successful",
                updatedUser
            },
            { status: 201 }
        )
    } catch (error) {
        console.error("failed to update user status to accept message");
        return Response.json(
            {
                success: false,
                message: "failed to update user status to accept message"
            },
            { status: 500 }
        )
    }

}
