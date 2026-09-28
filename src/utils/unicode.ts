/**
 * Chuẩn hóa Unicode NFC cho tiếng Việt.
 * Đảm bảo các ký tự có dấu không bị phân rã (NFD) gây lỗi font, lệch dấu hoặc mất thẩm mỹ.
 */

export function normalizeVN(text: string): string;
export function normalizeVN<T>(data: T): T;
export function normalizeVN(input: any): any {
  if (typeof input === 'string') {
    return input.normalize('NFC');
  }
  if (Array.isArray(input)) {
    return input.map(item => normalizeVN(item));
  }
  if (input !== null && typeof input === 'object') {
    const res: Record<string, any> = {};
    for (const key of Object.keys(input)) {
      res[key] = normalizeVN(input[key]);
    }
    return res;
  }
  return input;
}
