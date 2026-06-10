import { Button, Col, Form, Input, Row, Select } from 'antd'
import { sortOptions } from '../mock-data'
import { DEFAULT_FILTERS, type InvoiceFilters } from '../invoice-filters'

interface InvoiceFiltersProps {
  onSearch: (filters: InvoiceFilters) => void
  onReset: () => void
}

interface FormShape {
  keyword?: string
  sort?: InvoiceFilters['sort']
}

const initialValues: FormShape = {
  keyword: '',
  sort: DEFAULT_FILTERS.sort,
}

export function InvoiceFilters({ onSearch, onReset }: InvoiceFiltersProps) {
  const [form] = Form.useForm<FormShape>()

  const handleSearch = () => {
    const v = form.getFieldsValue()
    onSearch({
      keyword: v.keyword ?? '',
      sort: v.sort ?? 'moi-nhat',
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
        <Col xs={24} md={8}>
          <Form.Item label="Tìm kiếm" name="keyword" className="mb-0">
            <Input placeholder="Nhập từ khoá tìm kiếm" allowClear />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item label="Sắp xếp theo" name="sort" className="mb-0">
            <Select options={sortOptions} />
          </Form.Item>
        </Col>
        <Col xs={24} md={8} className="flex items-end justify-end gap-2">
          <Button onClick={handleReset}>Làm lại</Button>
          <Button type="primary" onClick={handleSearch}>
            Tìm kiếm
          </Button>
        </Col>
      </Row>
    </Form>
  )
}
