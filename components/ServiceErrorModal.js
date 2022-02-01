import { Modal } from 'antd'
const ServiceErrorModal = (onOk) => {
  return Modal.error({
    title: 'ผิดพลาด',
    content: (
      <div>
        <p>เกิดปัญหาขณะอัพเดทข้อมูล กรุณาลองใหม่ในภายหลัง</p>
      </div>
    ),
    onOk,
  })
}
export default ServiceErrorModal