// frame/file.d.ts

/** @noSelf */
declare module "file" {

  /**
   * Opens a file and returns a file object.
   * @param filename - The name of the file.
   * @param mode - The mode to open the file in ('read', 'write', or 'append').
   * @returns The file object.
   */
  function open(filename: string, mode: 'read' | 'write' | 'append'): File;

  /**
   * Removes a file or directory of the given name.
   * @param name - The name of the file or directory.
   */
  function remove(name: string): void;

  /**
   * Renames a file or directory of the given name to a new name.
   * @param name - The current name.
   * @param new_name - The new name.
   */
  function rename(name: string, new_name: string): void;

  /**
   * Lists all files in the given directory path.
   * @param directory - The directory path.
   * @returns A table with name, size, and type of each file.
   */
  function listdir(directory: string): { name: string, size: number, type: string }[];

  /**
   * Creates a new directory with the given pathname.
   * @param pathname - The pathname of the new directory.
   */
  function mkdir(pathname: string): void;

  /**
   * Reads a number of bytes from a file.
   * @param num_bytes - The number of bytes to read. If not provided, reads the whole line.
   * @returns The read data.
   */
  interface File {
    read(num_bytes?: number): string;

    write(data: string): void;

    close(): void;
  }

}