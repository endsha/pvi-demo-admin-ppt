import { Button, Col, DatePicker, Form, Input, Row, Select } from 'antd'
import dayjs, { type Dayjs } from 'dayjs'
import { statusOptions } from '../mock-data'
import { DEFAULT_FILTERS, type DriverSavingsFilters } from '../driver-savings-filters'

const { RangePicker } = DatePicker

interface DriverSavingsFiltersProps {
  onSearch: (filters: DriverSavingsFilters) => void
  onReset: () => void
}

interface FormShape {
  phone?: string
  tripId?: string
  plate?: string
  driverCode?: string
  effectiveRange?: [Dayjs, Dayjs] | null
  createdRange?: [Dayjs, Dayjs] | null
  status?: DriverSavingsFilters['status']
}

const initialValues: FormShape = {
  phone: '',
  tripId: '',
  plate: '',
  driverCode: '',
  effectiveRange: null,
  createdRange: DEFAULT_FILTERS.createdRange
    ? [dayjs(DEFAULT_FILTERS.createdRange[0]), dayjs(DEFAULT_FILTERS.createdRange[1])]
    : null,
  status: DEFAULT_FILTERS.status,
}

function toIsoRange(range?: [Dayjs, Dayjs] | null): [string, string] | null {
  if (!range || !range[0] || !range[1]) return null
  return [range[0].format('YYYY-MM-DD'), range[1].format('YYYY-MM-DD')]
}

export function DriverSavingsFilters({ onSearch, onReset }: DriverSavingsFiltersProps) {
  const [form] = Form.useForm<FormShape>()

  const handleSearch = () => {
    const v = form.getFieldsValue()
    onSearch({
      phone: v.phone ?? '',
      tripId: v.tripId ?? '',
      plate: v.plate ?? '',
      driverCode: v.driverCode ?? '',
      effectiveRange: toIsoRange(v.effectiveRange),
      createdRange: toIsoRange(v.createdRange),
      status: v.status ?? null,
    })
  }

  const handleReset = () => {
    form.resetFields()
    onReset()
  }

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm"
    >
      <Row gutter={16}>
        <Col xs={24} md={6}>
          <Form.Item label="Số điện thoại" name="phone" className="mb-3">
            <Input placeholder="Nhập số điện thoại" allowClear />
          </Form.Item>
        </Col>
        <Col xs={24} md={6}>
          <Form.Item label="ID chuyến đi" name="tripId" className="mb-3">
            <Input placeholder="Nhập ID chuyến đi" allowClear />
          </Form.Item>
        </Col>
        <Col xs={24} md={6}>
          <Form.Item label="Biển số xe" name="plate" className="mb-3">
            <Input placeholder="Nhập biển số xe" allowClear />
          </Form.Item>
        </Col>
        <Col xs={24} md={6}>
          <Form.Item label="Mã tài xế" name="driverCode" className="mb-3">
            <Input placeholder="Nhập mã tài xế" allowClear />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16} align="bottom">
        <Col xs={24} md={6}>
          <Form.Item label="Thời gian bắt đầu hiệu lực" name="effectiveRange" className="mb-0">
            <RangePicker
              className="w-full"
              format="YYYY-MM-DD"
              placeholder={['Từ ngày', 'Đến ngày']}
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={6}>
          <Form.Item label="Thời gian tạo (Thời gian mua)" name="createdRange" className="mb-0">
            <RangePicker
              className="w-full"
              format="YYYY-MM-DD"
              placeholder={['Từ ngày', 'Đến ngày']}
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={6}>
          <Form.Item label="Trạng thái đơn bảo hiểm" name="status" className="mb-0">
            <Select options={statusOptions} allowClear placeholder="Chọn trạng thái" />
          </Form.Item>
        </Col>
        <Col xs={24} md={6} className="flex items-end justify-end gap-2 pt-3 md:pt-0">
          <Button onClick={handleReset}>Làm lại</Button>
          <Button type="primary" onClick={handleSearch}>
            Tìm kiếm
          </Button>
        </Col>
      </Row>
    </Form>
  )
}
