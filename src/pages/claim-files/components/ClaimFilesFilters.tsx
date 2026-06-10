import { Button, Col, DatePicker, Form, Input, Row, Select, Tooltip } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'
import { type Dayjs } from 'dayjs'
import { sortOptions, statusOptions } from '../mock-data'
import { DEFAULT_FILTERS, type ClaimFileFilters } from '../claim-files-filters'

const { RangePicker } = DatePicker

interface ClaimFilesFiltersProps {
  onSearch: (filters: ClaimFileFilters) => void
  onReset: () => void
}

interface FormShape {
  keyword?: string
  sort?: ClaimFileFilters['sort']
  status?: ClaimFileFilters['status']
  paidRange?: [Dayjs, Dayjs] | null
}

const initialValues: FormShape = {
  keyword: '',
  sort: DEFAULT_FILTERS.sort,
  status: null,
  paidRange: null,
}

function toIsoRange(range?: [Dayjs, Dayjs] | null): [string, string] | null {
  if (!range || !range[0] || !range[1]) return null
  return [range[0].format('YYYY-MM-DD'), range[1].format('YYYY-MM-DD')]
}

export function ClaimFilesFilters({ onSearch, onReset }: ClaimFilesFiltersProps) {
  const [form] = Form.useForm<FormShape>()

  const handleSearch = () => {
    const v = form.getFieldsValue()
    onSearch({
      keyword: v.keyword ?? '',
      sort: v.sort ?? 'newest',
      status: v.status ?? null,
      paidRange: toIsoRange(v.paidRange),
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
                  <Tooltip title="Tìm theo số yêu cầu, mã hồ sơ, mã tài xế, tên, số HĐNT">
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
            <Form.Item label="Tình trạng Hồ sơ bồi thường" name="status" className="mb-0">
              <Select options={statusOptions} allowClear placeholder="Lọc theo trạng thái" />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item label="Ngày thực hiện chi trả bồi thường" name="paidRange" className="mb-0">
              <RangePicker
                className="w-full"
                format="YYYY-MM-DD"
                placeholder={['Từ ngày', 'Đến ngày']}
              />
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
