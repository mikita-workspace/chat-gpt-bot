import axios from 'axios';
import { createWriteStream } from 'fs';
import { dirname, resolve as resolvePath } from 'path';
import ffmpeg from 'fluent-ffmpeg';
import installer from '@ffmpeg-installer/ffmpeg';
import { IOggConverter } from '../types';
import { removeFile } from '../utils';

class OggConverterService implements IOggConverter {
  constructor() {
    ffmpeg.setFfmpegPath(installer.path);
  }

  async toMp3(input = '', output = '') {
    try {
      const outputPath = resolvePath(dirname(input), `${output}.mp3`);

      return await new Promise<string>((resolve, reject) => {
        ffmpeg(input)
          .inputOption('-t 30')
          .output(outputPath)
          .on('end', () => {
            removeFile(input);
            resolve(outputPath);
          })
          .on('error', (error) => reject(error))
          .run();
      });
    } catch (error) {
      console.error(`ERROR::OggConverterService::toMp3::${(error as Error).message}`);
    }
  }

  async create(url = '', filename = '') {
    try {
      const oggPath = resolvePath(__dirname, '../../assets', `${filename}.ogg`);

      const response = await axios({
        method: 'get',
        url,
        responseType: 'stream',
      });

      return await new Promise<string>((resolve) => {
        const stream = createWriteStream(oggPath);

        response.data.pipe(stream);
        stream.on('finish', () => resolve(oggPath));
      });
    } catch (error) {
      console.error(`ERROR::OggConverterService::create::${(error as Error).message}`);
    }
  }
}

export const oggConverter = new OggConverterService();
