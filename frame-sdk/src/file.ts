type FileEntry = {
  name: string;
  size: number;
  type: "file" | "directory";
};

class RemoteFile {
  private filename: string;
  private mode: "read" | "write" | "append";
  private data: string;
  private cursor: number;

  constructor(filename: string, mode: "read" | "write" | "append") {
    this.filename = filename;
    this.mode = mode;
    this.data = "";
    this.cursor = 0;
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

  /**
   * Closes the file. It is important to close files once done writing, otherwise they may become corrupted.
   */
  close(): void {
    console.log(`File ${this.filename} closed`);
  }
}

/**
 * The FileSystem class allows for writing and reading files to Frame’s non-volatile storage.
 * These can include executable Lua scripts or other user files.
 */
export class RemoteFileSystem {
  private files: Map<string, FileEntry>;

  constructor() {
    this.files = new Map<string, FileEntry>();
  }

  /**
   * Opens a file and returns a file object.
   * @param filename - The name of the file.
   * @param mode - The mode to open the file in. Can be 'read', 'write', or 'append'.
   * @returns The file object.
   */
  open(filename: string, mode: "read" | "write" | "append"): RemoteFile {
    if (!this.files.has(filename) && mode === "read") {
      throw new Error("File not found");
    }
    if (mode === "write" || mode === "append") {
      this.files.set(filename, {name: filename, size: 0, type: "file"});
    }
    console.log(`File ${filename} opened in ${mode} mode`);
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

  /**
   * Lists all files in the directory path given.
   * @param directory - The directory path.
   * @returns An array of file entries in the directory.
   */
  listdir(directory: string): FileEntry[] {
    // Mock implementation, assuming all files are in root
    const entries: FileEntry[] = [];
    this.files.forEach((entry) => {
      if (directory === "/" || entry.name.startsWith(directory)) {
        entries.push(entry);
      }
    });
    console.log(`List of files in directory ${directory}:`, entries);
    return entries;
  }

  /**
   * Creates a new directory with the given pathname.
   * @param pathname - The path of the new directory.
   */
  mkdir(pathname: string): void {
    if (this.files.has(pathname)) {
      throw new Error("File or directory already exists");
    }
    this.files.set(pathname, {name: pathname, size: 0, type: "directory"});
    console.log(`Directory ${pathname} created`);
  }
}

