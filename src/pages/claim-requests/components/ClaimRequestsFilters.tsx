import { Button, Col, DatePicker, Form, Input, Row, Select, Tooltip } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'
import { type Dayjs } from 'dayjs'
import { sortOptions, sourceOptions, statusOptions } from '../mock-data'
import { DEFAULT_FILTERS, type ClaimRequestFilters } from '../claim-requests-filters'

const { RangePicker } = DatePicker

interface ClaimRequestsFiltersProps {
  onSearch: (filters: ClaimRequestFilters) => void
  onReset: () => void
}

interface FormShape {
  keyword?: string
  sort?: ClaimRequestFilters['sort']
  requestedRange?: [Dayjs, Dayjs] | null
  source?: string | null
  status?: ClaimRequestFilters['status']
}

const initialValues: FormShape = {
  keyword: '',
  sort: DEFAULT_FILTERS.sort,
  requestedRange: null,
  source: null,
  status: null,
}

function toIsoRange(range?: [Dayjs, Dayjs] | null): [string, string] | null {
  if (!range || !range[0] || !range[1]) return null
  return [range[0].format('YYYY-MM-DD'), range[1].format('YYYY-MM-DD')]
}

export function ClaimRequestsFilters({ onSearch, onReset }: ClaimRequestsFiltersProps) {
  const [form] = Form.useForm<FormShape>()

  const handleSearch = () => {
    const v = form.getFieldsValue()
    onSearch({
      keyword: v.keyword ?? '',
      sort: v.sort ?? 'newest',
      requestedRange: toIsoRange(v.requestedRange),
      source: v.source ?? null,
      status: v.status ?? null,
    })
  }

  const handleReset = () => {
    form.resetFields()
    onReset()
  }

  return (
    <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
      <Form form={form} layout="vertical" initialValues={initialValues}>
        <Row gutter={[16, 16]} align="bottom">
          <Col xs={24} md={6}>
            <Form.Item
              label={
                <span className="inline-flex items-center gap-1">
                  Tìm kiếm
                  <Tooltip title="Tìm theo mã tài xế, tên, số điện thoại, số thông báo tổn thất">
                    <InfoCircleOutlined className="text-gray-400" />
                  </Tooltip>
                </span>
              }
              name="keyword"
              className="mb-0"
            >
              <Input placeholder="Nhập từ khoá tìm kiếm" allowClear />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item label="Sắp xếp theo" name="sort" className="mb-0">
              <Select options={sortOptions} />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item label="Ngày yêu cầu bồi thường" name="requestedRange" className="mb-0">
              <RangePicker
                className="w-full"
                format="YYYY-MM-DD"
                placeholder={['Từ ngày', 'Đến ngày']}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item label="Nguồn tiếp nhận" name="source" className="mb-0">
              <Select options={sourceOptions} allowClear placeholder="Vui lòng chọn" />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item label="Tình trạng yêu cầu bồi thường" name="status" className="mb-0">
              <Select options={statusOptions} allowClear placeholder="Vui lòng chọn" />
            </Form.Item>
          </Col>
        </Row>
        <div className="mt-4 flex justify-end gap-2">
          <Button onClick={handleReset}>Làm lại</Button>
          <Button type="primary" onClick={handleSearch}>
            Tìm kiếm
          </Button>
        </div>
      </Form>
    </div>
  )
}
