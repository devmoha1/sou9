import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { getAuthCookie } from "@/lib/cookies";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(request: NextRequest) {
  if (!getAuthCookie(request)) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const formData = await request.formData();
  const files = formData.getAll("images").filter((value): value is File => value instanceof File);

  if (files.length === 0) {
    return NextResponse.json({ error: "Aucune image sélectionnée" }, { status: 400 });
  }
  if (files.length > 6) {
    return NextResponse.json({ error: "Maximum 6 images" }, { status: 400 });
  }

  const uploadDirectory = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDirectory, { recursive: true });
  const urls: string[] = [];

  for (const file of files) {
    if (!allowedTypes.has(file.type) || file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Chaque image doit être JPG, PNG ou WebP et faire moins de 5 Mo" },
        { status: 400 }
      );
    }

    const extension = file.type.split("/")[1].replace("jpeg", "jpg");
    const filename = `${randomUUID()}.${extension}`;
    await writeFile(path.join(uploadDirectory, filename), Buffer.from(await file.arrayBuffer()));
    urls.push(`/uploads/${filename}`);
  }

  return NextResponse.json({ urls }, { status: 201 });
}