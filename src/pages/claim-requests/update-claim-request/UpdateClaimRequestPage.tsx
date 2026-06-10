import { Breadcrumb, Button, Form, Tooltip, message } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { type ClaimForm } from '../claim-form/claim-form'
import { GeneralInfoSection } from '../claim-form/components/GeneralInfoSection'
import { InsuredPersonSection } from '../claim-form/components/InsuredPersonSection'
import { AccidentInfoSection } from '../claim-form/components/AccidentInfoSection'
import { ClaimAmountSection } from '../claim-form/components/ClaimAmountSection'
import { BeneficiarySection } from '../claim-form/components/BeneficiarySection'
import { ClaimHistorySection } from './components/ClaimHistorySection'
import { findClaim } from './update-claim-request-mock'

const LIST_PATH = '/yeu-cau-boi-thuong/bao-hiem-tich-luy-tai-xe'

export function UpdateClaimRequestPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const claim = findClaim(id)
  const [messageApi, contextHolder] = message.useMessage()
  const [form] = Form.useForm<ClaimForm>()

  const handleFinish = () => {
    messageApi.success('Đã cập nhật yêu cầu bồi thường')
    navigate(LIST_PATH)
  }

  const handleReset = () => form.resetFields()

  const handleCreateClaimFile = () => {
    messageApi.success('Đã tạo Hồ sơ bồi thường')
  }

  return (
    <div className="flex flex-col gap-4">
      {contextHolder}
      <div className="flex flex-col gap-1">
        <Breadcrumb
          items={[
            { title: 'Yêu cầu bồi thường' },
            { title: 'Bảo hiểm tích lũy tài xế' },
            { title: 'Chỉnh sửa yêu cầu bồi thường' },
          ]}
        />
        <h1 className="text-xl font-semibold text-gray-800">Chỉnh sửa yêu cầu bồi thường</h1>
      </div>

      <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
        <Form
          form={form}
          layout="vertical"
          requiredMark
          initialValues={claim}
          onFinish={handleFinish}
          className="flex flex-col gap-8"
        >
          <GeneralInfoSection />
          <InsuredPersonSection showCustomerSearch={false} />
          <AccidentInfoSection />
          <ClaimAmountSection />
          <BeneficiarySection />
          <ClaimHistorySection rows={claim.historyRows} />

          <div className="flex items-center gap-3">
            <Button color="green" variant="solid" onClick={handleCreateClaimFile}>
              Tạo Hồ sơ bồi thường
            </Button>
            <Button onClick={handleReset}>Làm lại</Button>
            <Tooltip title="Cập nhật Yêu cầu bồi thường">
              <Button type="primary" htmlType="submit">
                Lưu
              </Button>
            </Tooltip>
          </div>
        </Form>
      </div>
    </div>
  )
}
