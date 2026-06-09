import { Col, Form, Input, Row, Upload } from 'antd'
import { InboxOutlined } from '@ant-design/icons'

const { Dragger } = Upload

export function BeneficiarySection() {
  return (
    <section>
      <h2 className="mb-4 text-base font-semibold text-gray-800">Thông tin người thụ hưởng</h2>
      <Row gutter={[16, 0]}>
        <Col xs={24} md={12}>
          <Form.Item
            label="Người thụ hưởng"
            name="beneficiary"
            rules={[{ required: true, message: 'Vui lòng nhập tên người thụ hưởng' }]}
          >
            <Input placeholder="Vui lòng nhập tên người thụ hưởng" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            label="Số tài khoản"
            name="accountNumber"
            rules={[{ required: true, message: 'Vui lòng nhập số tài khoản' }]}
          >
            <Input placeholder="Vui lòng nhập số tài khoản" />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            label="Ngân hàng"
            name="bankName"
            rules={[{ required: true, message: 'Vui lòng nhập tên ngân hàng' }]}
          >
            <Input placeholder="Vui lòng nhập tên ngân hàng" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item label="Địa chỉ ngân hàng" name="bankAddress">
            <Input placeholder="Vui lòng nhập địa chỉ ngân hàng" />
          </Form.Item>
        </Col>

        <Col xs={24}>
          <Form.Item label="Tài liệu đính kèm">
            <Dragger
              multiple
              beforeUpload={() => false}
              accept=".png,.jpg,.jpeg,.pdf,.docx,.xlsx,.mp4"
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Nhấn để tải lên hoặc kéo thả vào đây</p>
              <p className="ant-upload-hint">
                Định dạng: PNG, JPG, JPEG, PDF, DOCX, XLSX, MP4
              </p>
            </Dragger>
          </Form.Item>
        </Col>
      </Row>
    </section>
  )
}
