declare module "gifshot" {
  interface Options {
    video?: string[];
    gifWidth?: number;
    gifHeight?: number;
    interval?: number;
    numFrames?: number;
    sampleInterval?: number;
    numWorkers?: number;
    keepCameraOn?: boolean;
    cameraStream?: MediaStream;
  }

  interface Response {
    error: boolean;
    errorCode?: string;
    errorMsg?: string;
    image: string;
  }

  export function createGIF(options: Options, callback: (response: Response) => void): void;
}
