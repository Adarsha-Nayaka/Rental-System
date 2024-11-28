import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await request.json();
  const {
    title,
    description,
    imageSrc,
    category,
    itemCount,
    location,
    price,
    securityDeposit, // Extract the security deposit from the request body
  } = body;

  // Check if any required fields are missing
  Object.keys(body).forEach((value: any) => {
    if (!body[value]) {
      NextResponse.error();
    }
  });

  // Create a new listing with the securityDeposit included
  const listing = await prisma.listing.create({
    data: {
      title,
      description,
      imageSrc,
      category,
      itemCount,
      locationValue: location.value,
      price: parseInt(price, 10),
      securityDeposit: parseInt(securityDeposit), // Store the security deposit
      userId: currentUser.id,
    },
  });

  return NextResponse.json(listing);
}