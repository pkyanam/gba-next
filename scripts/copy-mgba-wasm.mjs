import { cp, mkdir, readdir } from 'fs/promises';
import path from 'path';

const root = process.cwd();
const srcDir = path.join(root, 'node_modules', '@thenick775', 'mgba-wasm', 'dist');
const destDir = path.join(root, 'public', 'wasm');

try {
  await mkdir(destDir, { recursive: true });
  const files = await readdir(srcDir);
  const assets = files.filter((file) =>
    [
      '.js',
      '.js.map',
      '.wasm',
      '.wasm.map',
      '.data',
      '.data.map',
      '.worker.js',
      '.worker.js.map'
    ].some((ext) => file.endsWith(ext))
  );

  if (!assets.length) {
    console.warn(`No runtime assets found in ${srcDir}`);
    process.exit(0);
  }

  await Promise.all(
    assets.map((file) => cp(path.join(srcDir, file), path.join(destDir, file)))
  );

  console.log(`Copied ${assets.length} runtime file(s) to ${destDir}`);
} catch (error) {
  console.error('Failed to copy mGBA wasm files', error);
  process.exit(1);
}
