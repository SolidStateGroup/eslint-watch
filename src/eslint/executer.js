import { spawn } from 'child_process';

export default {
  execute(cmd, args = [], options) {
    const happyData = [];
    const angryData = [];

    return new Promise((resolve, reject) => {
      const result = spawn(cmd, args, { env: process.env, ...options });

      result.stdout.on('data', (data) => {
        happyData.push(data.toString());
      });

      result.stderr.on('data', (data) => {
        angryData.push(data.toString());
      });

      result.on('error', (err) => {
        reject(err);
      });

      result.on('close', (code) => {
        const happyResult = happyData.join('').trim();

        if (code === 0) {
          return resolve(happyResult);
        }

        const response = angryData.length === 0 ? happyResult : angryData.join('').trim();

        return reject(response);
      });
    });
  },
};