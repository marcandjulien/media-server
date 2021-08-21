import path from 'path';
import { sum } from 'src/commun/math';

function stringToArrayOfInt(stringList) {
  return stringList ? stringList.split(',').map((val) => parseInt(val, 10)) : undefined;
}

export default () => {
  const rgbWhite = stringToArrayOfInt(process.env.RGB_WHITE) || [255, 255, 255];
  const rgbBlack = stringToArrayOfInt(process.env.RGB_BLACK) || [0, 0, 0];

  return {
    filesRoot: path.join(__dirname, '..', '..', 'files'),
    port: parseInt(process.env.PORT, 10) || 3000,
    trimThreshold: process.env.TRIM_THRESHOLD || 5,
    rgbWhite,
    rgbBlack,
    rgbSumWhite: sum(rgbWhite),
    rgbSumBlack: sum(rgbBlack),
  };
};
