import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function uploadFile(file: File, directory: string = "avatars"): Promise<string | null> {
  if (!file || file.size === 0) return null;

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_"); // Sanitize filename
    const filename = `${uniqueSuffix}-${originalName}`;
    
    const publicDir = join(process.cwd(), "public");
    const uploadDir = join(publicDir, "uploads", directory);
    
    // Ensure directory exists
    await mkdir(uploadDir, { recursive: true });

    // Write file
    const filepath = join(uploadDir, filename);
    await writeFile(filepath, buffer);

    // Return the public URL path
    return `/uploads/${directory}/${filename}`;
  } catch (error) {
    console.error("Error uploading file:", error);
    return null;
  }
}
