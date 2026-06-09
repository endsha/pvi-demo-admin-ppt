import { App, Breadcrumb, Button, Form } from 'antd'
import { useNavigate } from 'react-router-dom'
import { initialValues, type NewClaimRequestForm } from './new-claim-request-form'
import { GeneralInfoSection } from './components/GeneralInfoSection'
import { InsuredPersonSection } from './components/InsuredPersonSection'
import { AccidentInfoSection } from './components/AccidentInfoSection'
import { ClaimAmountSection } from './components/ClaimAmountSection'
import { BeneficiarySection } from './components/BeneficiarySection'

const LIST_PATH = '/yeu-cau-boi-thuong/bao-hiem-tich-luy-tai-xe'

export function NewClaimRequestPage() {
  const navigate = useNavigate()
  const { message } = App.useApp()
  const [form] = Form.useForm<NewClaimRequestForm>()

  const handleSave = () => {
    // UI only: no API call. Validation already passed via onFinish.
    message.success('Đã lưu yêu cầu bồi thường')
    navigate(LIST_PATH)
  }

  const handleReset = () => form.resetFields()

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <Breadcrumb
          items={[
            { title: 'Yêu cầu bồi thường' },
            { title: 'Bảo hiểm tích luỹ tài xế' },
            { title: 'Thêm yêu cầu bồi thường' },
          ]}
        />
        <h1 className="text-xl font-semibold text-gray-800">Thêm yêu cầu bồi thường</h1>
      </div>

      <Form
        form={form}
        layout="vertical"
        requiredMark
        initialValues={initialValues}
        onFinish={handleSave}
        className="flex flex-col gap-8 rounded-lg border border-gray-100 bg-white p-6 shadow-sm"
      >
        <GeneralInfoSection />
        <InsuredPersonSection />
        <AccidentInfoSection />
        <ClaimAmountSection />
        <BeneficiarySection />

        <div className="flex items-center gap-3">
          <Button onClick={handleReset}>Làm lại</Button>
          <Button type="primary" htmlType="submit">
            Lưu
          </Button>
        </div>
      </Form>
    </div>
  )
}
