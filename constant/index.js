import GANG from './gang'
import COLOR from './color'

const TRANSACTION = {
  paid: {
    LABEL: 'จ่ายแล้ว',
    COLOR: 'green'
  },
  pending: {
    LABEL: 'รอยืนยัน',
    COLOR: 'orange'
  },
  notpaid: {
    LABEL: 'ยังไม่จ่าย',
    COLOR: 'red'
  }
}

const TAB_OPTIONS = {
  HOME: 'home',
  GANG: {
    INDEX: 'gang',
    DETAIL: 'detail',
    PLAYERS: 'players',
    QUEUE: 'queue',
    SETTING: 'setting'
  },
  NOTI: 'noti',
  ACCOUNT: 'account'
}
export {
  GANG,
  TAB_OPTIONS,
  COLOR,
  TRANSACTION
}