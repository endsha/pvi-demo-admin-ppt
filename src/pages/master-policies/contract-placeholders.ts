// Tọa độ các biến [placeholder] trong mẫu HĐBH (trích offline bằng pdfminer).
// Hai mẫu xe máy & ô tô có vị trí placeholder giống hệt nhau nên dùng chung map này.
// Hệ tọa độ: gốc dưới-trái, đơn vị point (giống pdf-lib). page = chỉ số trang (0-based).

export type PlaceholderKey =
  | 'Master_Policy_Number'
  | 'Driver_GSM_ID_Code'
  | 'Driver_Full_Name'
  | 'Driver_DOB'
  | 'Driver_ID_Number'
  | 'Driver_Gender'
  | 'Driver_Mobile_Number'
  | 'Driver_Email'
  | 'Driver_Address'
  | 'current_date'
  | 'end_date'
  | 'NG_C'
  | 'TG_C'
  | 'N_C'

export interface PlaceholderBox {
  key: PlaceholderKey
  page: number
  x0: number
  x1: number
  y0: number
  y1: number
  size: number
}

export const PLACEHOLDER_BOXES: PlaceholderBox[] = [
  { key: 'Master_Policy_Number', page: 0, x0: 253.85, x1: 377.16, y0: 650.86, y1: 662.86, size: 12 },
  { key: 'Driver_GSM_ID_Code', page: 0, x0: 230.25, x1: 351.56, y0: 556.58, y1: 568.58, size: 12 },
  { key: 'Driver_Full_Name', page: 0, x0: 230.25, x1: 329.55, y0: 534.65, y1: 546.65, size: 12 },
  { key: 'Driver_DOB', page: 0, x0: 230.25, x1: 300.9, y0: 512.73, y1: 524.73, size: 12 },
  { key: 'Driver_ID_Number', page: 0, x0: 230.25, x1: 333.54, y0: 490.8, y1: 502.8, size: 12 },
  { key: 'Driver_Gender', page: 0, x0: 230.25, x1: 310.88, y0: 468.87, y1: 480.87, size: 12 },
  { key: 'Driver_Mobile_Number', page: 0, x0: 230.25, x1: 355.55, y0: 446.94, y1: 458.94, size: 12 },
  { key: 'Driver_Email', page: 0, x0: 230.25, x1: 304.22, y0: 425.01, y1: 437.01, size: 12 },
  { key: 'Driver_Address', page: 0, x0: 230.25, x1: 314.89, y0: 403.08, y1: 415.08, size: 12 },
  { key: 'current_date', page: 2, x0: 257.33, x1: 325.28, y0: 217.34, y1: 229.34, size: 12 },
  { key: 'end_date', page: 2, x0: 376.44, x1: 427.74, y0: 217.34, y1: 229.34, size: 12 },
  { key: 'NG_C', page: 4, x0: 371.48, x1: 400.7, y0: 479.55, y1: 488.55, size: 9 },
  { key: 'TG_C', page: 4, x0: 429.07, x1: 457.46, y0: 479.55, y1: 488.55, size: 9 },
  { key: 'N_C', page: 4, x0: 480.39, x1: 503.6, y0: 479.55, y1: 488.55, size: 9 },
  { key: 'Master_Policy_Number', page: 5, x0: 238.69, x1: 369.31, y0: 635.66, y1: 647.66, size: 12 },
  { key: 'Master_Policy_Number', page: 6, x0: 238.69, x1: 369.31, y0: 635.66, y1: 647.66, size: 12 },
]
