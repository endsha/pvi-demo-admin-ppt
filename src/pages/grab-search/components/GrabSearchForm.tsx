import { Button, Form, Input, Select } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { insuranceTypeOptions } from '../mock-data'
import { DEFAULT_CRITERIA, type GrabSearchCriteria } from '../grab-search'

interface GrabSearchFormProps {
  loading: boolean
  onSearch: (criteria: GrabSearchCriteria) => void
}

interface FormShape {
  phone?: string
  driverCode?: string
  insuranceType: string
}

const initialValues: FormShape = {
  phone: '',
  driverCode: '',
  insuranceType: DEFAULT_CRITERIA.insuranceType,
}

export function GrabSearchForm({ loading, onSearch }: GrabSearchFormProps) {
  const [form] = Form.useForm<FormShape>()

  const handleFinish = (values: FormShape) => {
    onSearch({
      phone: values.phone ?? '',
      driverCode: values.driverCode ?? '',
      insuranceType: values.insuranceType,
    })
  }

  return (
    <div className="mx-auto w-full max-w-[640px]">
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onFinish={handleFinish}
        requiredMark
        className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm"
      >
        <h2 className="mb-5 text-base font-semibold text-gray-800">
          Tra cứu thông tin Grab PPT
        </h2>
        <Form.Item label="Số điện thoại" name="phone" className="mb-4">
          <Input
            prefix={<SearchOutlined className="text-gray-400" />}
            placeholder="Nhập số điện thoại"
            allowClear
          />
        </Form.Item>
        <Form.Item label="Mã tài xế Grab" name="driverCode" className="mb-4">
          <Input placeholder="Nhập mã tài xế (nếu có)" allowClear />
        </Form.Item>
        <Form.Item
          label="Loại bảo hiểm"
          name="insuranceType"
          className="mb-5"
          rules={[{ required: true, message: 'Vui lòng chọn loại bảo hiểm' }]}
        >
          <Select options={insuranceTypeOptions} placeholder="Chọn loại bảo hiểm" />
        </Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          icon={<SearchOutlined />}
          loading={loading}
          block
        >
          Tra cứu
        </Button>
      </Form>
    </div>
  )
}
