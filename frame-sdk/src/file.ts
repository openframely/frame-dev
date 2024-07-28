import { Frame } from "frame";

class FileEntry {
  name: string;
  size: number;
  type: "directory" | "file";

  constructor(public tuple: string) {
    const [name, type, size] = tuple.split("|");
    this.name = name;
    this.size = parseInt(size);
    this.type = parseInt(type) === 1 ? "file" : "directory";
  }
}

class RemoteFile {
  private cursor: number;
  private data: string;
  private filename: string;
  private mode: "append" | "read" | "write";

  constructor(filename: string, mode: "append" | "read" | "write") {
    this.filename = filename;
    this.mode = mode;
    this.data = "";
    this.cursor = 0;
  }

  /**
   * Closes the file. It is important to close files once done writing, otherwise they may become corrupted.
   */
  close(): void {
    console.log(`File ${this.filename} closed`);
  }

  /**
   * Reads a number of bytes from the file. If no argument is given, the whole line is returned.
   * @param numBytes - The number of bytes to read.
   * @returns The read data.
   */
  read(numBytes?: number): string {
    if (this.mode === "write" || this.mode === "append") {
      throw new Error("File not opened in read mode");
    }
    if (numBytes === undefined) {
      numBytes = this.data.length - this.cursor;
    }
    const readData = this.data.substr(this.cursor, numBytes);
    this.cursor += numBytes;
    return readData;
  }

  /**
   * Writes data to the file. Data must be a string and can contain any byte data.
   * @param data - The data to write.
   */
  write(data: string): void {
    if (this.mode === "read") {
      throw new Error("File not opened in write or append mode");
    }
    this.data += data;
  }
}

/**
 * The FileSystem class allows for writing and reading files to Frame’s non-volatile storage.
 * These can include executable Lua scripts or other user files.
 */
export class RemoteFileSystem {
  private files: Map<string, FileEntry>;

  constructor(public frame: Frame) {
    this.files = new Map<string, FileEntry>();
  }

  /**
   * Lists all files in the directory path given.
   * @param directory - The directory path.
   * @returns An array of file entries in the directory.
   */
  async listdir(directory: string): Promise<FileEntry[]> {
    return (async () => {
      const listDirCommand = `l=frame.file.listdir('${directory}')`;
      await this.frame.request(listDirCommand, true);

      const dirSizeCommand = `print(#l)`;
      const dirSizeResult = await this.frame.request(dirSizeCommand, true);
      const dirSize = parseInt(dirSizeResult?.toString() || "0");
      console.log(`Directory ${directory} has ${dirSize} entries`);

      const printContentsCommand = `for k, b in ipairs(l) do print(b['name']..'|'..b['type']..'|'..b['size']..'\\n') end`;
      const contents = await this.frame.expect(printContentsCommand, dirSize);
      const fileEntries = [];
      for (const entry of contents) {
        const tuple = entry?.trim();
        if (tuple) fileEntries.push(new FileEntry(tuple));
      }
      return fileEntries;
    })();
  }

  /**
   * Creates a new directory with the given pathname.
   * @param pathname - The path of the new directory.
   */
  mkdir(pathname: string): void {}

  /**
   * Opens a file and returns a file object.
   * @param filename - The name of the file.
   * @param mode - The mode to open the file in. Can be 'read', 'write', or 'append'.
   * @returns The file object.
   */
  open(filename: string, mode: "append" | "read" | "write"): RemoteFile {
    return new RemoteFile(filename, mode);
  }

  /**
   * Removes a file or directory of given name.
   * @param name - The name of the file or directory to remove.
   */
  remove(name: string): void {
    if (!this.files.has(name)) {
      throw new Error("File or directory not found");
    }
    this.files.delete(name);
    console.log(`File or directory ${name} removed`);
  }

  /**
   * Renames a file or directory of given name to new_name.
   * @param name - The current name of the file or directory.
   * @param newName - The new name of the file or directory.
   */
  rename(name: string, newName: string): void {
    if (!this.files.has(name)) {
      throw new Error("File or directory not found");
    }
    const entry = this.files.get(name)!;
    this.files.delete(name);
    entry.name = newName;
    this.files.set(newName, entry);
    console.log(`File or directory ${name} renamed to ${newName}`);
  }
}
