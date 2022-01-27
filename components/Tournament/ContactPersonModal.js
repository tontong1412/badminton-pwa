import { Modal } from "antd"
import Image from "next/image"
import moment from 'moment'
const ContactPerson = ({ player = {}, visible, setVisible, showContact }) => {
  return (
    <Modal
      visible={visible}
      onOk={() => setVisible(false)}
      onCancel={() => setVisible(false)}
      centered
      footer={null}
    >
      <div style={{
        width: '100%',
        padding: '50px 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '40px',
          overflow: 'hidden',
          objectFit: 'contain',
          marginTop: '10px'
        }}>
          <Image objectFit='cover' src={player.photo || `/avatar.png`} alt='' width={50} height={50} layout='responsive' />
        </div>
        <div style={{ marginTop: '20px' }}>{player.officialName}</div>
        <div>{`(${player.club})`}</div>

        {
          showContact && <>
            <div style={{ display: 'flex', gap: '10px', width: '200px' }}>
              <div style={{ width: '100px', textAlign: 'right' }}>เบอร์โทรศัพท์:</div>
              <div><a href={`tel:${player.tel}`}>{player.tel}</a></div>
            </div>
            <div style={{ display: 'flex', gap: '10px', width: '200px' }}>
              <div style={{ width: '100px', textAlign: 'right' }}>Line ID:</div>
              <div>{player.lineID}</div>
            </div>
          </>
        }
      </div >
    </Modal>
  )
}
export default ContactPerson