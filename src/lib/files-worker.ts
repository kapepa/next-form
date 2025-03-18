import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from 'uuid';

const allowedExtensions = ["jpg", "jpeg", "png", "gif"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

async function addFile({ file, folder }: { file: File, folder: string }): Promise<string> {
  try {
    const extend = file.name.split(".").pop()?.toLowerCase();

    if (!extend || !allowedExtensions.includes(extend)) {
      throw new Error(`File type .${extend} is not allowed`);
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File size exceeds the limit of ${MAX_FILE_SIZE} bytes`);
    }

    const uploadDir = path.join(process.cwd(), `public/${folder}`);
    const fileName = `${uuidv4()}.${extend}`;
    await fs.mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, fileName);
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    return `/${folder}/${fileName}`
  } catch (error) {
    console.error(`Error writing file ${file.name}:`, error);
    throw new Error(`Failed to write file ${file.name}`);
  }
}

export async function writeFile(file: File, folder: string): Promise<string> {
  return await addFile({ file, folder });
}

export async function writeFiles({ files, folder }: { files: File[], folder: string }): Promise<string[]> {
  const names: string[] = [];

  for (const file of files) {
    const getName = await addFile({ file, folder });
    names.push(getName)
  }

  return names
}

export async function deleteFile(urls: string[]) {
  try {
    const deletePromises = urls.map(async (url) => {
      const filePath = path.join(process.cwd(), `public${url}`);

      try {
        await fs.access(filePath);
        await fs.unlink(filePath);
        console.log(`Deleted file: ${filePath}`);
      } catch (error) {
        if (error instanceof Error && "code" in error) {
          if (error.code === "ENOENT") {
            console.warn(`File not found: ${filePath}`);
          } else {
            throw error; // Re-throw unexpected errors
          }
        } else {
          throw new Error("Unknown error occurred");
        }
      }
    });

    await Promise.all(deletePromises);
  } catch (error) {
    console.error("Error deleting files:", error);
    throw new Error("Failed to delete files");
  }
}