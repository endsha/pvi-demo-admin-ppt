import { Button, Form, Input, Switch, message } from 'antd'
import { defaultAccount } from './mock-data'

interface FormShape {
  name: string
  phone?: string
  email: string
  changePassword: boolean
  currentPassword?: string
  newPassword?: string
  confirmPassword?: string
}

const initialValues: FormShape = {
  name: defaultAccount.name,
  phone: defaultAccount.phone,
  email: defaultAccount.email,
  changePassword: false,
}

export function AccountSettingsPage() {
  const [form] = Form.useForm<FormShape>()
  const [messageApi, contextHolder] = message.useMessage()
  const changePassword = Form.useWatch('changePassword', form)

  const handleFinish = () => {
    // UI only — no API call (spec §6). Edited values are kept in form state.
    messageApi.success('Cập nhật thành công')
  }

  const handleReset = () => {
    form.resetFields()
  }

  return (
    <div className="mx-auto w-full max-w-[640px]">
      {contextHolder}
      <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
        <Form
          form={form}
          layout="vertical"
          initialValues={initialValues}
          onFinish={handleFinish}
          requiredMark
        >
          <h2 className="mb-5 text-center text-base font-semibold text-gray-800">
            Cài đặt tài khoản
          </h2>

          <Form.Item
            label="Tên"
            name="name"
            className="mb-4"
            rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
          >
            <Input placeholder="Nhập tên" allowClear />
          </Form.Item>

          <Form.Item label="Số điện thoại" name="phone" className="mb-4">
            <Input placeholder="Nhập số điện thoại" allowClear />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            className="mb-4"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' },
            ]}
          >
            <Input placeholder="Nhập email" allowClear />
          </Form.Item>

          <Form.Item
            label="Thay đổi mật khẩu"
            name="changePassword"
            valuePropName="checked"
            className="mb-4"
          >
            <Switch />
          </Form.Item>

          {changePassword && (
            <>
              <Form.Item
                label="Mật khẩu hiện tại"
                name="currentPassword"
                className="mb-4"
                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại' }]}
              >
                <Input.Password placeholder="Nhập mật khẩu hiện tại" />
              </Form.Item>
              <Form.Item
                label="Mật khẩu mới"
                name="newPassword"
                className="mb-4"
                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới' }]}
              >
                <Input.Password placeholder="Nhập mật khẩu mới" />
              </Form.Item>
              <Form.Item
                label="Xác nhận mật khẩu"
                name="confirmPassword"
                className="mb-4"
                dependencies={['newPassword']}
                rules={[
                  { required: true, message: 'Vui lòng xác nhận mật khẩu' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve()
                      }
                      return Promise.reject(new Error('Mật khẩu xác nhận không khớp'))
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Nhập lại mật khẩu mới" />
              </Form.Item>
            </>
          )}

          <div className="flex gap-2">
            <Button onClick={handleReset}>Làm lại</Button>
            <Button type="primary" htmlType="submit">
              Cập nhật
            </Button>
          </div>
        </Form>
      </div>
    </div>
  )
}
