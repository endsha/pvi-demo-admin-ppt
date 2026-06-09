import { useState } from 'react'
import { Breadcrumb, Col, Collapse, Form, Row, Select } from 'antd'
import { useParams } from 'react-router-dom'
import { InfoTable } from './components/InfoTable'
import { PaymentTable } from './components/PaymentTable'
import { BenefitTable } from '../../components/insurance/BenefitTable'
import { AccumulationTable } from '../../components/insurance/AccumulationTable'
import {
  claimFileStatusOptions,
  findClaimFileDetail,
  masterPolicyOptions,
} from './claim-file-detail-mock'

export function ClaimFileDetailPage() {
  const { id } = useParams<{ id: string }>()
  const detail = findClaimFileDetail(id)
  const [masterPolicy, setMasterPolicy] = useState(detail.masterPolicyNumber)
  const [status, setStatus] = useState(detail.status)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <Breadcrumb
          items={[
            { title: 'Hồ sơ bồi thường' },
            { title: 'Bảo hiểm tích lũy tài xế' },
            { title: 'Chỉnh sửa hồ sơ bồi thường' },
          ]}
        />
        <h1 className="text-xl font-semibold text-gray-800">Chỉnh sửa hồ sơ bồi thường</h1>
      </div>

      <div className="flex flex-col gap-8 rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
        <Form layout="vertical" requiredMark>
          <Row gutter={[16, 0]}>
            <Col xs={24}>
              <Form.Item label="Chọn Hợp đồng nguyên tắc" required>
                <Select
                  value={masterPolicy}
                  onChange={setMasterPolicy}
                  options={masterPolicyOptions}
                />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item label="Trạng thái Hồ sơ bồi thường" required className="mb-0">
                <Select value={status} onChange={setStatus} options={claimFileStatusOptions} />
              </Form.Item>
            </Col>
          </Row>
        </Form>

        <Collapse
          defaultActiveKey={['ycbt']}
          items={[
            {
              key: 'ycbt',
              label: <span className="font-semibold text-gray-800">Thông tin yêu cầu bồi thường</span>,
              children: (
                <div className="flex flex-col gap-8">
                  <section>
                    <h2 className="mb-4 text-base font-semibold text-gray-800">
                      Thông tin người được bảo hiểm
                    </h2>
                    <InfoTable items={detail.insured} />
                  </section>
                  <section>
                    <h2 className="mb-4 text-base font-semibold text-gray-800">
                      Thông tin người thụ hưởng
                    </h2>
                    <InfoTable items={detail.beneficiary} />
                  </section>
                  <section>
                    <h2 className="mb-4 text-base font-semibold text-gray-800">
                      Thông tin về tai nạn và khám chữa
                    </h2>
                    <InfoTable items={detail.accident} />
                  </section>
                  <section>
                    <h2 className="mb-4 text-base font-semibold text-gray-800">Tải ảnh kèm</h2>
                    {detail.attachments.length > 0 ? (
                      <div className="flex flex-wrap gap-3">
                        {detail.attachments.map((src) => (
                          <img
                            key={src}
                            src={src}
                            alt="Ảnh kèm hồ sơ"
                            className="h-24 w-24 rounded-md border border-gray-200 object-cover"
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="flex h-28 items-center justify-center rounded-md border border-dashed border-gray-300 text-sm text-gray-400">
                        Chưa có ảnh đính kèm
                      </div>
                    )}
                  </section>
                </div>
              ),
            },
          ]}
        />

        <section>
          <h2 className="mb-4 text-base font-semibold text-gray-800">Bảng Quyền lợi bảo hiểm</h2>
          <BenefitTable rows={detail.benefits} />
        </section>

        <section>
          <h2 className="mb-4 text-base font-semibold text-gray-800">Bảng thanh toán bồi thường</h2>
          <PaymentTable rows={detail.payments} />
        </section>

        <AccumulationTable trips={detail.trips} />
      </div>
    </div>
  )
}
