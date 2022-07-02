import Image from 'next/image'
import { RightCircleOutlined, UploadOutlined, MoreOutlined, MenuOutlined, PlusOutlined, PlusSquareOutlined } from '@ant-design/icons';
import { MobileView, isSafari, isMobileSafari, isChrome, isAndroid, isIOS, isSamsungBrowser } from 'react-device-detect';
import { useState } from 'react';
import { Modal } from 'antd';
import { COLOR } from '../constant';
const AddToHomeScreenCard = () => {
  const [modalVisible, setModalVisible] = useState(false)
  return (
    <MobileView>
      <div
        style={{
          margin: '20px',
          borderRadius: '10px',
          height: '100px',
          boxShadow: '2px 2px 10px -5px rgba(0,0,0,0.75)',
          background: 'rgb(255,226,170)',
          background: 'linear-gradient(160deg, rgba(255,226,170,1) 0%, rgba(255,255,154,1) 19%, rgba(255,219,143,1) 78%)'
        }}
        onClick={() => setModalVisible(true)}
      >
        <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

          <div style={{
            width: '60px',
            height: '60px',
            boxShadow: '2px 2px 10px -5px rgba(0,0,0,0.75)',
            borderRadius: '10px', overflow: 'hidden',
          }}>
            <Image
              src='/icon/logo.png'
              alt=''
              width={60}
              height={60}
              objectFit='cover'
            />
          </div>
          <div>
            <div>เพื่อความสะดวกในการใช้งาน</div>
            <div>เพิ่มไปยังในหน้าจอหลัก</div>
          </div>
          <div style={{ fontSize: '20px' }}>
            <RightCircleOutlined />
          </div>
        </div>
      </div>
      <Modal
        footer={null}
        onCancel={() => setModalVisible(false)}
        visible={modalVisible}
        centered
      >
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>

          <div style={{
            width: '60px',
            height: '60px',
            boxShadow: '2px 2px 10px -5px rgba(0,0,0,0.75)',
            borderRadius: '10px', overflow: 'hidden',
          }}>
            <Image
              src='/icon/logo.png'
              alt=''
              width={60}
              height={60}
              objectFit='cover'
            />
          </div>
          {isSafari && <div style={{ fontSize: '16px' }}>
            <div style={{ fontWeight: 'bold', color: COLOR.MINOR_THEME, fontSize: '18px' }}>ใช้งานง่ายเหมือนใช้แอพ</div>
            <div>1. {<span style={{ color: COLOR.MINOR_THEME, fontSize: '18px' }}><UploadOutlined /></span>} กดปุ่ม share</div>
            <div>2. {<span style={{ color: COLOR.MINOR_THEME, fontSize: '18px' }}><PlusSquareOutlined /></span>} เลือก Add to Home Screen</div>
          </div>}
          {isChrome && isAndroid && <div style={{ fontSize: '16px' }}>
            <div style={{ fontWeight: 'bold', color: COLOR.MINOR_THEME, fontSize: '18px' }}>ใช้งานง่ายเหมือนใช้แอพ</div>
            <div>1. {<span style={{ color: COLOR.MINOR_THEME, fontSize: '18px' }}><MoreOutlined /></span>} กดปุ่ม more (จุด 3 จุด)</div>
            <div>2. {<span style={{ color: COLOR.MINOR_THEME, fontSize: '18px' }}><PlusSquareOutlined /></span>} เลือก เพิ่มลงในหน้าจอหลัก</div>
          </div>}
          {isSamsungBrowser && isAndroid && <div style={{ fontSize: '16px' }}>
            <div style={{ fontWeight: 'bold', color: COLOR.MINOR_THEME, fontSize: '18px' }}>ใช้งานง่ายเหมือนใช้แอพ</div>
            <div>1. {<span style={{ color: COLOR.MINOR_THEME, fontSize: '18px' }}><MenuOutlined /></span>} กดปุ่ม Menu (ขีด 3 ขีด)</div>
            <div>2. {<span style={{ color: COLOR.MINOR_THEME, fontSize: '18px' }}><PlusOutlined /></span>} เลือก เพิ่มหน้าไปยัง</div>
            <div>3. หน้าจอหลัก</div>

          </div>}
          {
            isIOS && !isSafari && <div style={{ fontSize: '16px' }}>
              <div style={{ fontWeight: 'bold', color: COLOR.MINOR_THEME, fontSize: '18px' }}>ใช้งานง่ายเหมือนใช้แอพ</div>
              <div> กรุณาเปิดโดยใช้ Safari</div>
            </div>
          }
        </div>
      </Modal>
    </MobileView>
  )
}

export default AddToHomeScreenCard