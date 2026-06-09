import { Checkbox, Col, Form, InputNumber, Row } from 'antd'
import { claimCaseOptions } from '../new-claim-request-form'

export function ClaimAmountSection() {
  return (
    <section>
      <h2 className="mb-4 text-base font-semibold text-gray-800">
        Nội dung yêu cầu chi trả bảo hiểm
      </h2>
      <Row gutter={[16, 0]}>
        <Col xs={24} md={12}>
          <Form.Item
            label="Tổng số tiền yêu cầu chi trả"
            name="claimAmount"
            rules={[{ required: true, message: 'Vui lòng nhập tổng số tiền yêu cầu chi trả' }]}
          >
            <InputNumber<number>
              className="w-full"
              addonAfter="đ"
              min={0}
              controls={false}
              formatter={(value) => `${value ?? ''}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => Number((value ?? '').replace(/,/g, ''))}
              placeholder="Vui lòng nhập tổng số tiền yêu cầu chi trả"
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item label="Chi trả bảo hiểm cho trường hợp" name="claimCases">
            <Checkbox.Group options={claimCaseOptions} />
          </Form.Item>
        </Col>
      </Row>
    </section>
  )
}
