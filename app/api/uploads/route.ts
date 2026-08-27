import { put } from "@vercel/blob";
import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getAuthCookie } from "@/lib/cookies";

const MAX_FILE_SIZE = 4 * 1024 * 1024;

const allowedTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export async function POST(request: NextRequest) {
  try {
    if (!getAuthCookie(request)) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    const formData = await request.formData();

    const files = formData
      .getAll("images")
      .filter((value): value is File => value instanceof File);

    if (files.length === 0) {
      return NextResponse.json(
        { error: "Aucune image sélectionnée" },
        { status: 400 }
      );
    }

    if (files.length > 6) {
      return NextResponse.json(
        { error: "Maximum 6 images" },
        { status: 400 }
      );
    }

    const urls: string[] = [];

    for (const file of files) {
      if (!allowedTypes.has(file.type)) {
        return NextResponse.json(
          {
            error:
              "Chaque image doit être JPG, PNG ou WebP",
          },
          { status: 400 }
        );
      }

      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          {
            error:
              "Chaque image doit faire moins de 4 Mo",
          },
          { status: 400 }
        );
      }

      const extension =
        file.type === "image/jpeg"
          ? "jpg"
          : file.type.split("/")[1];

      const filename = `listings/${randomUUID()}.${extension}`;

      const blob = await put(filename, file, {
        access: "public",
      });

      urls.push(blob.url);
    }

    return NextResponse.json(
      { urls },
      { status: 201 }
    );
  } catch (error) {
    console.error("Upload error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erreur lors de l'upload",
      },
      { status: 500 }
    );
  }
}