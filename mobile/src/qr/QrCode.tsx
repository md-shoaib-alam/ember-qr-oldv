import createQr from 'qrcode-generator';
import Svg, { Path, Rect } from 'react-native-svg';

const QUIET_ZONE = 4;

// The library's default encoder keeps only the low byte of each character, which garbles Bangla and emoji.
// eslint-disable-next-line import/no-named-as-default-member -- the library reads this property at encode time
createQr.stringToBytes = (s: string) => Array.from(new TextEncoder().encode(s));

export type QrMatrix = { size: number; path: string };

// The three 7x7 corner squares scanners lock on to.
function inFinder(row: number, column: number, size: number) {
  return (row < 7 && column < 7) || (row < 7 && column >= size - 7) || (row >= size - 7 && column < 7);
}

// A rounded rectangle as path data, so a ring can be cut out with even-odd filling.
function roundedRect(x: number, y: number, size: number, radius: number) {
  const r = Math.min(radius, size / 2);
  return `M${x + r} ${y}h${size - 2 * r}a${r} ${r} 0 0 1 ${r} ${r}v${size - 2 * r}a${r} ${r} 0 0 1 -${r} ${r}h-${size - 2 * r}a${r} ${r} 0 0 1 -${r} -${r}v-${size - 2 * r}a${r} ${r} 0 0 1 ${r} -${r}z`;
}

// Rounded modules keep the friendly look; full squares scan more reliably than dots.
function moduleRect(x: number, y: number) {
  return roundedRect(x + 0.05, y + 0.05, 0.9, 0.3);
}

// Returns null when the content is too long to fit in any QR code version.
export function encodeQr(payload: string): QrMatrix | null {
  const qr = createQr(0, 'M');
  try {
    qr.addData(payload, 'Byte');
    qr.make();
  } catch {
    return null;
  }

  const size = qr.getModuleCount();
  let path = '';
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++) if (qr.isDark(y, x) && !inFinder(y, x, size)) path += moduleRect(x, y);

  const corners = [
    [0, 0],
    [size - 7, 0],
    [0, size - 7],
  ] as const;
  for (const [x, y] of corners) {
    // The ring: an outer square with the inner one cut out by the even-odd fill.
    path += roundedRect(x, y, 7, 2.2) + roundedRect(x + 1, y + 1, 5, 1.4);
    path += roundedRect(x + 2, y + 2, 3, 1);
  }
  return { size, path };
}

// Web only: paints the matrix straight onto a canvas at a whole-pixel scale so the PNG stays sharp.
export function qrToPngDataUrl(matrix: QrMatrix, minSize = 1024): string {
  const total = matrix.size + QUIET_ZONE * 2;
  const scale = Math.ceil(minSize / total);
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = total * scale;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.scale(scale, scale);
  ctx.translate(QUIET_ZONE, QUIET_ZONE);
  ctx.fillStyle = '#000000';
  ctx.fill(new Path2D(matrix.path), 'evenodd');
  return canvas.toDataURL('image/png');
}

export function QrCode({ matrix, size }: { matrix: QrMatrix; size: number }) {
  const total = matrix.size + QUIET_ZONE * 2;
  return (
    <Svg
      width={size}
      height={size}
      viewBox={`${-QUIET_ZONE} ${-QUIET_ZONE} ${total} ${total}`}>
      <Rect x={-QUIET_ZONE} y={-QUIET_ZONE} width={total} height={total} fill="#FFFFFF" />
      <Path d={matrix.path} fill="#000000" fillRule="evenodd" />
    </Svg>
  );
}
