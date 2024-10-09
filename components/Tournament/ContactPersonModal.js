import { Modal, message } from "antd"
import Image from "next/image"
import moment from 'moment'
import { CopyOutlined } from "@ant-design/icons"
import { COLOR } from "../../constant"
import copy from "copy-to-clipboard"
const ContactPerson = ({ player = {}, visible, setVisible, showContact }) => {
  return (
    <Modal
      visible={visible}
      onOk={() => setVisible(false)}
      onCancel={() => setVisible(false)}
      centered
      footer={null}
    >
      {player._id
        ? <div style={{
          width: '100%',
          padding: '50px 0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '40px',
            overflow: 'hidden',
            objectFit: 'contain',
            marginTop: '10px'
          }}>
            <Image unoptimized objectFit='cover' src={`/avatar.png` || player.photo?.replace('/upload/', '/upload/q_10/') || `/avatar.png`} alt='' width={50} height={50} layout='responsive' />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px', gap: '5px' }}>
            <div >{player.officialName}</div>
            {player?.displayName && <div>({player?.displayName})</div>}
          </div>
          {player.club && <div>{`${player.club}`}</div>}

          {
            showContact && <>
              <div style={{ display: 'flex', gap: '10px', width: '220px' }}>
                <div style={{ width: '100px', textAlign: 'right' }}>เบอร์โทรศัพท์:</div>
                <div><a href={`tel:${player?.tel}`}>{player?.tel}</a></div>
                {player.tel && <div onClick={() => {
                  copy(player.tel)
                  message.success('copied')
                }} style={{ color: COLOR.MINOR_THEME }}><CopyOutlined /></div>}
              </div>
              <div style={{ display: 'flex', gap: '10px', width: '220px' }}>
                <div style={{ width: '100px', textAlign: 'right' }}>Line ID:</div>
                <div>{player?.lineID}</div>
                {player?.lineID && <div onClick={() => {
                  copy(player?.lineID)
                  message.success('copied')
                }} style={{ color: COLOR.MINOR_THEME }}><CopyOutlined /></div>}
              </div>
            </>
          }
        </div >
        : <div>ไม่มีข้อมูลผู้ติดต่อ</div>
      }
    </Modal>
  )
}
export default ContactPerson