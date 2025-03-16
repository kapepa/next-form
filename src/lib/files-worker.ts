import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from 'uuid';

async function addFile({ file, folder }: { file: File, folder: string }): Promise<string> {
  try {
    const uploadDir = path.join(process.cwd(), `public/${folder}`);
    const extend = file.name.split(".").pop();
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

}