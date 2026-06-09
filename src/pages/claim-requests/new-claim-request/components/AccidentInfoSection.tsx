import { Col, DatePicker, Form, Input, Radio, Row } from 'antd'

const datePickerProps = { className: 'w-full', format: 'DD/MM/YYYY' } as const

export function AccidentInfoSection() {
  return (
    <section>
      <h2 className="mb-4 text-base font-semibold text-gray-800">
        Thông tin về tai nạn và khám chữa
      </h2>
      <Row gutter={[16, 0]}>
        <Col xs={24} md={12}>
          <Form.Item
            label="Ngày tai nạn"
            name="accidentDate"
            rules={[{ required: true, message: 'Vui lòng chọn ngày tai nạn' }]}
          >
            <DatePicker {...datePickerProps} placeholder="Vui lòng chọn ngày tai nạn" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            label="Nơi xảy ra tai nạn"
            name="accidentPlace"
            rules={[{ required: true, message: 'Vui lòng nhập nơi xảy ra tai nạn' }]}
          >
            <Input placeholder="Vui lòng nhập nơi xảy ra tai nạn" />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            label="Ngày khám bệnh"
            name="examDate"
            rules={[{ required: true, message: 'Vui lòng chọn ngày khám bệnh' }]}
          >
            <DatePicker {...datePickerProps} placeholder="Vui lòng chọn ngày khám bệnh" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item label="Ngày nhập viện" name="admissionDate">
            <DatePicker {...datePickerProps} placeholder="Vui lòng chọn ngày nhập viện" />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item label="Nơi điều trị" name="treatmentPlace">
            <Input placeholder="Vui lòng nhập nơi điều trị" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            label="Nguyên nhân / Chẩn đoán về tai nạn"
            name="diagnosis"
            rules={[{ required: true, message: 'Vui lòng nhập nguyên nhân / chẩn đoán về tai nạn' }]}
          >
            <Input placeholder="Vui lòng nhập nguyên nhân / chẩn đoán về tai nạn" />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            label="Hậu quả"
            name="consequence"
            rules={[{ required: true, message: 'Vui lòng nhập hậu quả' }]}
          >
            <Input placeholder="Vui lòng nhập hậu quả" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item
            label="Hình thức điều trị"
            name="treatmentType"
            rules={[{ required: true, message: 'Vui lòng chọn hình thức điều trị' }]}
          >
            <Radio.Group>
              <Radio value="outpatient">Ngoại trú</Radio>
              <Radio value="inpatient">Nội trú</Radio>
            </Radio.Group>
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item label="Từ ngày" name="fromDate">
            <DatePicker {...datePickerProps} placeholder="Vui lòng chọn ngày bắt đầu" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item label="Đến ngày" name="toDate">
            <DatePicker {...datePickerProps} placeholder="Vui lòng chọn ngày kết thúc" />
          </Form.Item>
        </Col>
      </Row>
    </section>
  )
}
