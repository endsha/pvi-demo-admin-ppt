export interface BenefitRow {
  key: string
  name: string
  sub?: string
  hanMuc: string | null
  daChiTra: string | null
  uocBoiThuong: string | null
  hanMucConLai: string | null
}

export interface AccumulationTrip {
  id: string
  gsmTripId: string // ID chuyến xe GSM
  transferContractNo: string // Mã hợp đồng bảo hiểm chuyến
  completedAt: string // ISO — Thời gian hoàn thành chuyến
  effectiveStart: string // ISO — Thời gian bắt đầu bảo hiểm
  effectiveEnd: string // ISO — Thời gian kết thúc bảo hiểm
  sumInsured: number // STBH/ chuyến
  benefits: BenefitRow[]
}
