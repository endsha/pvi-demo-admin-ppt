import { Col, Form, Input, Row, Select } from 'antd'
import { customerOptions, findCustomer, genderOptions } from '../new-claim-request-form'

export function InsuredPersonSection() {
  const form = Form.useFormInstance()
  const idNumber = Form.useWatch<string | undefined>('idNumber', form)
  const dob = Form.useWatch<string | undefined>('dob', form)

  const handleSelectCustomer = (value: string) => {
    const customer = findCustomer(value)
    if (!customer) return
    form.setFieldsValue({
      driverCode: customer.driverCode,
      fullName: customer.fullName,
      gender: customer.gender,
      idNumber: customer.idNumber,
      dob: customer.dob,
      phone: customer.phone,
      email: customer.email,
      zalo: customer.zalo,
    })
  }

  return (
    <section>
      <h2 className="mb-4 text-base font-semibold text-gray-800">
        Thông tin về người được bảo hiểm
      </h2>
      <Row gutter={[16, 0]}>
        <Col xs={24}>
          <Form.Item
            label="Tìm thông tin khách hàng"
            name="customerSearch"
            rules={[{ required: true, message: 'Vui lòng chọn khách hàng' }]}
          >
            <Select
              showSearch
              optionFilterProp="label"
              options={customerOptions}
              onChange={handleSelectCustomer}
              placeholder="Nhập số hợp đồng nguyên tắc, số điện thoại hoặc mã tài xế GSM để tìm kiếm"
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item
            label="Mã Tài xế GSM"
            name="driverCode"
            rules={[{ required: true, message: 'Vui lòng nhập Mã Tài xế GSM' }]}
          >
            <Input placeholder="Vui lòng nhập Mã Tài xế GSM" />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item
            label="Họ và tên"
            name="fullName"
            rules={[{ required: true, message: 'Vui lòng nhập Họ và tên' }]}
          >
            <Input placeholder="Vui lòng nhập Họ và tên" />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item label="Giới tính" name="gender">
            <Select options={genderOptions} placeholder="Vui lòng chọn Giới tính" />
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item label="Số CMND/ CCCD/ Hộ chiếu">
            <span className="text-gray-700">{idNumber || '-'}</span>
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item label="Ngày sinh">
            <span className="text-gray-700">{dob || '-'}</span>
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[{ required: true, message: 'Vui lòng nhập Số điện thoại' }]}
          >
            <Input placeholder="Vui lòng nhập Số điện thoại" />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item label="Email" name="email">
            <Input placeholder="Nhập Email" />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item label="Số điện thoại sử dụng Zalo" name="zalo">
            <Input placeholder="Nhập Số điện thoại sử dụng Zalo" />
          </Form.Item>
        </Col>
      </Row>
    </section>
  )
}
