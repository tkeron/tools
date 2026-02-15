import { Glob } from "bun";
import { statSync } from "fs";
import { join } from "path";

export const getPaths = (
  path: string,
  pattern: string = "**/*",
  includeDirectories: "yes" | "no" | "onlyDirectories" = "no",
  absolute: boolean = true,
): string[] => {
  try {
    if (includeDirectories === "no")
      return getFilePaths(path, pattern, absolute);
    if (includeDirectories === "onlyDirectories")
      return getDirectoryPaths(path, pattern, absolute);

    const paths: string[] = [];

    const glob = new Glob(pattern);

    const files = glob.scanSync({
      cwd: path,
      onlyFiles: false,
      absolute: absolute,
      dot: true,
      followSymlinks: false,
    });

    paths.push(...files);

    return paths;
  } catch (error) {
    console.error(`Error getting paths from ${path}:`, error);
    return [];
  }
};

export const getFilePaths = (
  path: string,
  pattern: string = "**/*",
  absolute: boolean = true,
): string[] => {
  try {
    const paths: string[] = [];

    const glob = new Glob(pattern);

    const files = glob.scanSync({
      cwd: path,
      onlyFiles: true,
      absolute: absolute,
      dot: true,
      followSymlinks: false,
    });

    paths.push(...files);

    return paths;
  } catch (error) {
    console.error(`Error getting file paths from ${path}:`, error);
    return [];
  }
};

export const getDirectoryPaths = (
  path: string,
  pattern: string = "**/*",
  absolute: boolean = true,
): string[] => {
  try {
    const paths: string[] = [];

    const glob = new Glob(pattern);

    const allItems = [
      ...glob.scanSync({
        cwd: path,
        onlyFiles: false,
        absolute: absolute,
        dot: true,
        followSymlinks: false,
      }),
    ];

    const directories = allItems.filter((item) => {
      try {
        const fullPath = absolute ? item : join(path, item);
        return statSync(fullPath).isDirectory();
      } catch {
        return false;
      }
    });

    paths.push(...directories);

    return paths;
  } catch (error) {
    console.error(`Error getting directory paths from ${path}:`, error);
    return [];
  }
};
