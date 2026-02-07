import { useEffect, useState } from 'react';

import {
  mGBAEmulator,
  type GBAEmulator
} from '../emulator/mgba/mgba-emulator.tsx';

export const useEmulator = (canvas: HTMLCanvasElement | null) => {
  const [emulator, setEmulator] = useState<GBAEmulator | null>(null);

  useEffect(() => {
    const initialize = async () => {
      if (!canvas) return;

      try {
        const modulePath: string = '/wasm/mgba.js';
        const { default: mGBA } = (await import(
          /* webpackIgnore: true */ modulePath
        )) as {
          default: typeof import('@thenick775/mgba-wasm').default;
        };

        const Module = await mGBA({
          canvas,
          locateFile: (path: string) => {
            if (path.startsWith('http') || path.startsWith('/')) return path;
            return `/wasm/${path}`;
          }
        } as Parameters<typeof mGBA>[0] & {
          locateFile: (path: string) => string;
        });

        const mGBAVersion =
          Module.version.projectName + ' ' + Module.version.projectVersion;
        console.log(mGBAVersion);

        await Module.FSInit();

        const emulator = mGBAEmulator(Module);

        setEmulator(emulator);
      } catch (error) {
        console.error('Failed to initialize mGBA', error);
      }
    };

    void initialize();
  }, [canvas]);

  return emulator;
};
