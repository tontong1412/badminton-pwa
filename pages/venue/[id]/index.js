import Layout from '../../../components/Layout'
import { useRouter } from 'next/router'
import { COLOR, MAP_BOOKING_COLOR } from '../../../constant'
import moment from 'moment'
import { Table, Button, Drawer, Modal, Input, Radio, Form, InputNumber, Space, DatePicker, Checkbox } from 'antd'
import { PlusCircleOutlined, DeleteOutlined, CaretRightOutlined, CaretLeftOutlined } from '@ant-design/icons'
import { useEffect, useState, useRef } from 'react'
import { useVenue, convertTimeToNumber, useBookings } from '../../../utils'
import { useDispatch, useSelector } from 'react-redux'
import request from '../../../utils/request'

const findPriceForTime = (time, timeSlots) => {
  const timeToCheck = convertTimeToNumber(time);  // Convert '15.00' to 15.00

  // Iterate through each time slot and find the one where the time fits
  for (const slot of timeSlots) {
    const start = convertTimeToNumber(slot.startTime);
    const end = convertTimeToNumber(slot.endTime);
    if (timeToCheck >= start && timeToCheck < end) {
      return slot.price;  // Return the price for the matching time slot
    }
  }
  return 'No price found for this time';  // If no time slot matches
}

const Venue = () => {
  const router = useRouter()
  const { id } = router.query
  const tableRef = useRef(null);
  const { booking: bookingState, user } = useSelector(state => state)
  const { venue, isLoading, isError, mutate } = useVenue(id)
  const [column, setColumn] = useState([])
  const [row, setRow] = useState([])
  const [selectedDay, setSelectedDay] = useState(moment().add(1, 'hour').set({ minute: 0, second: 0 }))
  const [selectedSlots, setSelectedSlots] = useState(bookingState?.slots || [])
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [totalPrice, setTotalPrice] = useState(bookingState?.totalPrice || 0)
  const { bookings, mutate: mutateBooking } = useBookings(id, selectedDay)
  const [isManager, setIsManager] = useState(false)
  const [bookingName, setBookingName] = useState('')
  const [bookingNameModalVisible, setBookingNameModalVisible] = useState(false)
  const [form] = Form.useForm()
  const [radioValue, setRadioValue] = useState()



  useEffect(() => {
    if (user && venue && (venue.managers?.map(e => e._id).includes(user.playerID) || (user.playerID === venue.creator))) {
      setIsManager(true)
    } else {
      setIsManager(false)
    }

  }, [user, venue])

  useEffect(() => {
    mutateBooking([id, selectedDay])
  }, [selectedDay, id])

  const getOperateTime = (venue) => {
    let operatingHours = venue?.operatingHours?.find(d => d.day === selectedDay.locale('en').format('dddd')) || venue?.operatingHours?.find(d => d.day === 'Default')
    const openTimeNum = parseFloat(operatingHours?.openTime)
    const closeTimeNum = parseFloat(operatingHours?.closeTime)
    return {
      openTime: operatingHours?.openTime,
      closeTime: operatingHours?.closeTime,
      openTimeNum,
      closeTimeNum,
    }
  }


  useEffect(() => {
    if (!venue) return null
    const { openTimeNum, closeTimeNum } = getOperateTime(venue)

    const tempCol = [];
    for (let hour = openTimeNum; hour <= closeTimeNum; hour++) {
      const formattedTime = hour.toFixed(2).padStart(5, '0')
      if (isManager || (selectedDay.startOf('day') >= moment().startOf('day') && hour >= moment().hour()) || (selectedDay.startOf('day') > moment().startOf('day'))) {
        tempCol.push({
          title: formattedTime,
          dataIndex: formattedTime,
          align: 'center',
          width: '100px',
          onCell: (row, rowIndex) => {
            return {
              onClick: () => onSelectSlot(row.court, formattedTime, row[formattedTime]),
              style: {
                backgroundColor: MAP_BOOKING_COLOR[row[formattedTime]?.booking?.status]
              }
            }
          },
          render: (item) => {
            if (item?.booking?.name) {
              if (item?.booking?.name === 'selected') {
                return <DeleteOutlined style={{ fontSize: '20px', color: COLOR.MINOR_THEME }} />
              } else if (isManager) {
                return <div>
                  <div> {item?.booking?.name}</div>
                  <div>{item?.booking?.note}</div>
                </div>
              } else if (item?.booking?.isPublic) {
                return <div>
                  <div> {item?.booking?.name}</div>
                </div>
              } else {
                return null
              }
            } else {
              const isBookable = isManager || (selectedDay.startOf('day') >= moment().startOf('day') && hour >= moment().hour()) || (selectedDay.startOf('day') > moment().startOf('day'))
              if (isBookable) {
                return <PlusCircleOutlined style={{ fontSize: '20px', color: COLOR.MINOR_THEME }} />
              }
              return null

            }
          }
        });
      }

    }

    tempCol.splice(0, 0, {
      title: "",
      dataIndex: "court",
      key: "court",
      fixed: "left",
      width: '120px',
      align: 'center',
      onCell: (record, rowIndex) => ({
        style: {
          backgroundColor: "#fafafa"
        }
      }),
      render: (item) => <p>{item.name}</p>,
    })
    setColumn(tempCol)

    const tempRow = venue?.courts?.reduce((rows, court, index) => {
      let courtObject = { court }
      bookings?.forEach(item => {
        item.slots?.filter(s => s.court._id == court._id).forEach(b => {
          courtObject = {
            ...courtObject,
            [b.time]: { court, booking: item }
          }
        })
      })

      selectedSlots.filter(slot => slot.court._id == court._id).forEach(slot => {
        courtObject = {
          ...courtObject,
          [slot.time]: { court: slot.court, booking: slot.booking }
        }
      })

      rows.push(courtObject)
      return rows
    }, [])
    setRow(tempRow)

  }, [venue, selectedDay, selectedSlots, bookings])

  const onSelectSlot = (court, selectedTime, booking) => {
    let tempSelectedSlot = [...selectedSlots]

    const index = tempSelectedSlot.findIndex(obj => obj.time === selectedTime && obj.court._id === court._id)

    const priceOfDay = court.pricing.find(d => d.day === selectedDay.locale('en').format('dddd')) || court.pricing.find(d => d.day === 'Default')
    const price = findPriceForTime(selectedTime, priceOfDay.timeSlots)
    const tempTotalPrice = totalPrice

    const isBookable = isManager || (selectedDay.startOf('day') >= moment().startOf('day') && parseInt(selectedTime) >= moment().hour()) || (selectedDay.startOf('day') > moment().startOf('day'))

    if (index !== -1) {
      setTotalPrice(tempTotalPrice - price)
      tempSelectedSlot.splice(index, 1);  // Remove 1 element at the found index
    } else {
      if (!booking && isBookable) {
        tempSelectedSlot = [
          ...selectedSlots,
          {
            time: selectedTime,
            court,
            booking: {
              status: 'select',
              name: 'selected'
            },
            price
          }
        ]
        setTotalPrice(tempTotalPrice + price)
      }
    }
    setSelectedSlots(tempSelectedSlot)
  }

  const onContinueBooking = () => {
    if (!user.token) {
      Modal.info({
        title: 'กรุณาเข้าสู่ระบบ',
        onOk: () => router.push('/login')
      })
    }
    if (isManager) {
      setBookingNameModalVisible(true)
    } else {
      setBookingName(user.displayName || user.officialName)
      onContinueToPayment({ name: user.displayName || user.officialName })
    }
  }

  const onContinueToPayment = (values) => {
    setBookingNameModalVisible(false)

    request.post('/bookings', {
      venue: venue._id,
      slots: selectedSlots,
      price: values.price === 'free' ? 0 : totalPrice,
      date: selectedDay,
      name: values.name || user.displayName || user.officialName,
      note: values.note,
      isCustomer: !isManager
    },
      user.token)
      .then(res => {
        if (isManager) {
          setSelectedSlots([])
          setTotalPrice(0)
          mutateBooking()
          form.resetFields()
        } else {
          router.push(`/booking/${res.data._id}`)
        }
      })
      .catch(err => {
        console.log(err.response.data)
      })
  }

  const disabledDate = (current) => {
    const startOfToday = moment().startOf('day')
    const threeMonthsFromNow = moment().add(3, 'months').endOf('day')
    const nextYear = moment().add(1, 'year').endOf('year')
    if (isManager) {
      return current && current > nextYear
    }

    return current && (current < startOfToday || current > threeMonthsFromNow);
  }

  const disableTime = (current) => {
    if (isManager) {
      return false
    }
    return current && (current) < moment().startOf('hour')
  }
  useEffect(() => {
    console.log('Table Ref:', tableRef.current);
  }, []);


  return (
    <Layout back={{ href: '/venue' }}>
      <div style={{ fontSize: '24px', textAlign: 'center', margin: '20px', color: COLOR.MINOR_THEME }}>
        {venue?.name}
      </div>
      <div style={{ margin: 'auto' }}>
        <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>


          <Button disabled={selectedDay.startOf('day') <= moment().startOf('day')} size='large' type='primary' onClick={() => setSelectedDay(moment(selectedDay).subtract(1, 'day'))}><CaretLeftOutlined style={{ fontSize: '16px' }} /></Button>
          <DatePicker
            size='large'
            value={selectedDay}
            onOk={(date) => setSelectedDay(date)}
            onChange={(date) => setSelectedDay(date)}
            disabledDate={disabledDate}
            disabledHours={disableTime}
            showNow={false}
            // format="ddd, DD MMM - HH:mm" // wait for auto scroll feature
            format="ddd, DD MMM YYYY"
            // showTime={{
            //   format: 'HH',
            //   hideDisabledOptions: true,
            //   disabledHours: () => {
            //     const { openTimeNum, closeTimeNum } = getOperateTime(venue)
            //     const allHours = Array.from(Array(24).keys())
            //     return allHours.filter(hour => hour < openTimeNum || hour > closeTimeNum)
            //   }
            // }}
            defaultValue={selectedDay}
          />
          <Button size='large' type='primary' onClick={() => setSelectedDay(moment(selectedDay).add(1, 'day'))}><CaretRightOutlined style={{ fontSize: '16px' }} /></Button>
        </div>
        <div >
          <Table
            ref={tableRef}
            columns={column}
            dataSource={row}
            bordered
            pagination={false}
            scroll={{ y: 500 }}
            size='small'
            style={{
              margin: '20px auto',
              maxWidth: '1500px',
              zIndex: '-999',
              pageBreakAfter: 'always'
            }}
          />
        </div>

        {totalPrice > 0 && <div style={{
          position: 'absolute',
          bottom: '80px',
          width: 'calc(100% - 20px)',
          border: '1px solid #ddd',
          borderRadius: '5px',
          padding: '10px',
          margin: '10px',
          boxShadow: '2px 2px 5px -5px rgba(0,0,0,0.75)',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ color: COLOR.MINOR_THEME }} >Total price</div>
            <div style={{ color: COLOR.MINOR_THEME }} ><span style={{ fontSize: '24px', fontWeight: 'bold' }}>{totalPrice}</span> Baht</div>
          </div>
          <div style={{ display: 'flex', gap: '5px' }}>
            <Button size='large' onClick={() => setDrawerVisible(true)}>Detail</Button>
            <Button size='large' type='primary' onClick={onContinueBooking}>Continue</Button>
          </div>
        </div>}

        <Drawer
          title="รายละเอียด"
          placement="bottom"
          closable={true}
          onClose={() => setDrawerVisible(false)}
          visible={drawerVisible}
          height={Math.max(300, Math.min(selectedSlots.length * 40 + 100, 600))}
        >
          <div>{selectedDay.format('l')}</div>
          <div style={{ height: Math.min(selectedSlots.length * 30, 400), overflow: 'scroll' }}>
            {
              selectedSlots.sort((a, b) => {
                if (convertTimeToNumber(a.time) - convertTimeToNumber(b.time) === 0) {
                  if (a.court.name > b.court.name) return 1
                  if (a.court.name < b.court.name) return -1
                }

                return convertTimeToNumber(a.time) - convertTimeToNumber(b.time)
              }).map((slot, index) =>
                <div key={index} style={{ width: '300px', display: 'flex' }}>
                  <div style={{ width: '80px' }}>{slot.time}</div>
                  <div style={{ width: '80px' }}>{slot.court.name}</div>
                  <div style={{ width: '80px' }}>ราคา {slot.price}</div>
                </div>)
            }
          </div>
          <div style={{
            position: 'absolute',
            bottom: '10px',
            left: 0,
            width: 'calc(100% - 20px)',
            margin: '10px',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ color: COLOR.MINOR_THEME }} >Total price</div>
              <div style={{ color: COLOR.MINOR_THEME }} ><span style={{ fontSize: '24px', fontWeight: 'bold' }}>{totalPrice}</span> Baht</div>
            </div>
            <div style={{ display: 'flex', gap: '5px' }}>
              <Button size='large' onClick={() => setDrawerVisible(false)}>Back</Button>
              <Button size='large' type='primary' onClick={onContinueBooking}>Continue</Button>
            </div>
          </div>
        </Drawer>
      </div >
      <Modal
        title="ฺBooking Detail"
        visible={bookingNameModalVisible}
        onCancel={() => setBookingNameModalVisible(false)}
        onOk={form.submit}
      >
        <Form
          form={form}
          style={{ marginTop: '30px' }}
          onFinish={onContinueToPayment}
          initialValues={{ name: '', price: 'normal' }}
        >
          <Form.Item
            label='ชื่อการจอง'
            name='name'
          >
            <Input />
          </Form.Item>

          <Form.Item
            label='ราคารวม'
            name='price'
          >
            <Radio.Group onChange={e => setRadioValue(e.target.value)}>
              <Space direction="vertical">
                <Radio value={"normal"}>ราคาปกติ</Radio>
                <Radio value={'special'}>
                  ราคาพิเศษ
                  {radioValue === "special" ? <InputNumber onChange={(value) => setTotalPrice(value)} style={{ width: 100, marginInlineStart: 10 }} /> : null}
                </Radio>
                <Radio value={"free"}>ไม่คิดเงิน</Radio>
              </Space>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label='หมายเหตุ'
            name='note'
          >
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>


      </Modal>
    </Layout >
  )
}
export default Venue