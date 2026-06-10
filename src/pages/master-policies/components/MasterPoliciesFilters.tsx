import { Button, Col, DatePicker, Form, Input, Row, Select, Tooltip } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import type { Dayjs } from 'dayjs'
import { packageTypeOptions, sortOptions } from '../mock-data'
import {
  DEFAULT_FILTERS,
  type MasterPoliciesFilters,
  type MasterPoliciesSort,
} from '../master-policies-filters'

const { RangePicker } = DatePicker

interface MasterPoliciesFiltersProps {
  onSearch: (filters: MasterPoliciesFilters) => void
  onReset: () => void
}

interface FormShape {
  keyword?: string
  sort?: MasterPoliciesSort
  effectiveRange?: [Dayjs, Dayjs] | null
  packageType?: string | null
}

const initialValues: FormShape = {
  keyword: '',
  sort: DEFAULT_FILTERS.sort,
  effectiveRange: null,
  packageType: DEFAULT_FILTERS.packageType,
}

function toIsoRange(range?: [Dayjs, Dayjs] | null): [string, string] | null {
  if (!range || !range[0] || !range[1]) return null
  return [range[0].format('YYYY-MM-DD'), range[1].format('YYYY-MM-DD')]
}

export function MasterPoliciesFilters({ onSearch, onReset }: MasterPoliciesFiltersProps) {
  const [form] = Form.useForm<FormShape>()

  const handleSearch = () => {
    const v = form.getFieldsValue()
    onSearch({
      keyword: v.keyword ?? '',
      sort: v.sort ?? 'newest',
      effectiveRange: toIsoRange(v.effectiveRange),
      packageType: v.packageType ?? null,
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
      <Row gutter={[16, 16]} align="bottom">
        <Col xs={24} md={6}>
          <Form.Item
            label={
              <span className="inline-flex items-center gap-1">
                Tìm kiếm
                <Tooltip title="Tìm theo số hợp đồng, mã tài xế, tên khách hàng hoặc SĐT">
                  <QuestionCircleOutlined className="text-gray-400" />
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
          <Form.Item label="Thời gian bắt đầu hiệu lực" name="effectiveRange" className="mb-0">
            <RangePicker
              className="w-full"
              format="YYYY-MM-DD"
              placeholder={['Từ ngày', 'Đến ngày']}
            />
          </Form.Item>
        </Col>
        <Col xs={24} md={6}>
          <Form.Item label="Loại bảo hiểm" name="packageType" className="mb-0">
            <Select options={packageTypeOptions} allowClear placeholder="Vui lòng chọn" />
          </Form.Item>
        </Col>
        <Col span={24} className="flex items-center justify-end gap-2">
          <Button onClick={handleReset}>Làm lại</Button>
          <Button type="primary" onClick={handleSearch}>
            Tìm kiếm
          </Button>
        </Col>
      </Row>
    </Form>
  )
}
