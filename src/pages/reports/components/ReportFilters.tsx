import { useState } from 'react'
import { Button, Col, Form, Input, Row, Select } from 'antd'
import { DownOutlined, UpOutlined } from '@ant-design/icons'
import { reportTypeOptions, sortOptions, statusOptions } from '../mock-data'
import { DEFAULT_FILTERS, type ReportFilters } from '../reports-filters'

interface ReportFiltersProps {
  onSearch: (filters: ReportFilters) => void
  onReset: () => void
}

interface FormShape {
  keyword?: string
  sort?: ReportFilters['sort']
  title?: string
  reportType?: string | null
  partnerCode?: string
  status?: ReportFilters['status']
}

const initialValues: FormShape = {
  keyword: '',
  sort: DEFAULT_FILTERS.sort,
  title: '',
  reportType: null,
  partnerCode: '',
  status: null,
}

export function ReportFilters({ onSearch, onReset }: ReportFiltersProps) {
  const [form] = Form.useForm<FormShape>()
  const [expanded, setExpanded] = useState(false)

  const handleSearch = () => {
    const v = form.getFieldsValue()
    onSearch({
      keyword: v.keyword ?? '',
      title: v.title ?? '',
      sort: v.sort ?? 'moi-nhat',
      reportType: v.reportType ?? null,
      partnerCode: v.partnerCode ?? '',
      status: v.status ?? null,
    })
  }

  const handleReset = () => {
    form.resetFields()
    onReset()
  }

  return (
    <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">
      <Form form={form} layout="horizontal" initialValues={initialValues}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={6}>
            <Form.Item label="Tìm kiếm" name="keyword" className="mb-0">
              <Input placeholder="Nhập từ khoá tìm kiếm" allowClear />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item label="Sắp xếp theo" name="sort" className="mb-0">
              <Select options={sortOptions} />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item label="Tiêu đề" name="title" className="mb-0">
              <Input placeholder="nhập dữ liệu" allowClear />
            </Form.Item>
          </Col>
          <Col xs={24} md={6} className="flex items-center justify-end gap-2">
            <Button onClick={handleReset}>Làm lại</Button>
            <Button type="primary" onClick={handleSearch}>
              Tìm kiếm
            </Button>
            <Button
              type="link"
              className="px-1"
              onClick={() => setExpanded((prev) => !prev)}
            >
              {expanded ? 'Thu gọn' : 'Mở rộng'} {expanded ? <UpOutlined /> : <DownOutlined />}
            </Button>
          </Col>
        </Row>
        {expanded && (
          <Row gutter={[16, 16]} align="middle" className="mt-4">
            <Col xs={24} md={6}>
              <Form.Item label="Loại báo cáo" name="reportType" className="mb-0">
                <Select options={reportTypeOptions} allowClear placeholder="Chọn loại báo cáo" />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item label="Mã đối tác" name="partnerCode" className="mb-0">
                <Input placeholder="Nhập mã đối tác" allowClear />
              </Form.Item>
            </Col>
            <Col xs={24} md={6}>
              <Form.Item label="Trạng thái" name="status" className="mb-0">
                <Select options={statusOptions} allowClear placeholder="Chọn trạng thái" />
              </Form.Item>
            </Col>
          </Row>
        )}
      </Form>
    </div>
  )
}
