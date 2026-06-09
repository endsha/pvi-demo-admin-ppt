import { Breadcrumb, Button, Form, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { initialValues, type ClaimForm } from '../claim-form/claim-form'
import { GeneralInfoSection } from '../claim-form/components/GeneralInfoSection'
import { InsuredPersonSection } from '../claim-form/components/InsuredPersonSection'
import { AccidentInfoSection } from '../claim-form/components/AccidentInfoSection'
import { ClaimAmountSection } from '../claim-form/components/ClaimAmountSection'
import { BeneficiarySection } from '../claim-form/components/BeneficiarySection'

const LIST_PATH = '/yeu-cau-boi-thuong/bao-hiem-tich-luy-tai-xe'

export function NewClaimRequestPage() {
  const navigate = useNavigate()
  const [messageApi, contextHolder] = message.useMessage()
  const [form] = Form.useForm<ClaimForm>()

  const handleFinish = () => {
    // UI only: no API call. Validation already passed via onFinish.
    messageApi.success('Đã lưu yêu cầu bồi thường')
    navigate(LIST_PATH)
  }

  const handleReset = () => form.resetFields()

  return (
    <div className="flex flex-col gap-4">
      {contextHolder}
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
        onFinish={handleFinish}
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
