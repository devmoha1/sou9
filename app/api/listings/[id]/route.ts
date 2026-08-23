import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { forbiddenResponse, getAuthenticatedUser, unauthorizedResponse } from "@/lib/admin";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: listingId } = await params;
    const id = parseInt(listingId, 10);

    const listing = await prisma.listing.findUnique({
      where: { id },
      include: {
        images: { orderBy: { order: "asc" } },
        seller: { select: { id: true, name: true, phone: true, city: true } },
        category: true,
      },
    });

    if (!listing) {
      return NextResponse.json(
        { error: "Annonce non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json(listing, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: listingId } = await params;
    const id = parseInt(listingId, 10);
    const user = await getAuthenticatedUser(request);
    if (!user) return unauthorizedResponse();

    const existingListing = await prisma.listing.findUnique({ where: { id } });
    if (!existingListing) {
      return NextResponse.json({ error: "Annonce non trouvée" }, { status: 404 });
    }
    if (existingListing.sellerId !== user.id && user.role !== "admin") {
      return forbiddenResponse();
    }

    const { title, description, price, condition, city, categoryId } =
      await request.json();

    const listing = await prisma.listing.update({
      where: { id },
      data: { title, description, price, condition, city, categoryId },
    });

    return NextResponse.json(
      { message: "Annonce mise à jour" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: listingId } = await params;
    const id = parseInt(listingId, 10);
    const user = await getAuthenticatedUser(request);
    if (!user) return unauthorizedResponse();

    const existingListing = await prisma.listing.findUnique({ where: { id } });
    if (!existingListing) {
      return NextResponse.json({ error: "Annonce non trouvée" }, { status: 404 });
    }
    if (existingListing.sellerId !== user.id && user.role !== "admin") {
      return forbiddenResponse();
    }

    await prisma.listing.delete({ where: { id } });

    return NextResponse.json(
      { message: "Annonce supprimée" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
