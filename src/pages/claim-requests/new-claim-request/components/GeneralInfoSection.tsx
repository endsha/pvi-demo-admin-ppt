import { Col, Form, Row, Select } from 'antd'
import { receivingSourceOptions } from '../new-claim-request-form'

export function GeneralInfoSection() {
  return (
    <section>
      <h2 className="mb-4 text-base font-semibold text-gray-800">Thông tin chung</h2>
      <Row gutter={[16, 0]}>
        <Col xs={24} md={8}>
          <Form.Item
            label="Nguồn tiếp nhận"
            name="receivingSource"
            rules={[{ required: true, message: 'Vui lòng chọn nguồn tiếp nhận' }]}
          >
            <Select options={receivingSourceOptions} placeholder="Vui lòng chọn nguồn tiếp nhận" />
          </Form.Item>
        </Col>
      </Row>
    </section>
  )
}
