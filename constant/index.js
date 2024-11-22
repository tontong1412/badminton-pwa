import GANG from './gang'
import COLOR from './color'
import PLAYER from './player'

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
  },
  idle: {
    LABEL: 'ยังไม่จ่าย',
    COLOR: 'red'
  },
  expired: {
    LABEL: 'ยกเลิก',
    COLOR: 'purple'
  }
}

const EVENT = {
  FORMAT: {
    ROUND_ROBIN: 'roundRobin',
    SINGLE_ELIMINATION: 'singleElim',
    DOUBLE_ELIMINATION: 'doubleElim',
  },
  TEAM_STATUS: {
    'idle': {
      COLOR: 'orange',
      LABEL: 'รอประเมิน'
    },
    'approved': {
      COLOR: 'green',
      LABEL: 'ผ่าน'
    },
    'rejected': {
      COLOR: 'red',
      LABEL: 'ไม่ผ่าน'
    },
    'withdraw': {
      COLOR: 'purple',
      LABEL: 'ถอนตัว'
    }
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
  ACCOUNT: 'account',
  TOURNAMENT: 'tournament',
  TOURNAMENT_MANAGER: {
    INDEX: 'tounamentManager',
    DETAIL: 'detail',
    PARTICIPANTS: 'participants',
    MANAGE: 'manage',
    DRAWS: 'draws',
    MATCHES: 'matces',
    SETTING: 'setting'
  },
  VENUE: 'venue'
}

const MATCH = {
  TYPE: {
    SINGLE: 'single',
    DOUBLE: 'double'
  },
  STATUS: {
    finished: {
      LABEL: 'finished',
      COLOR: 'green'
    },
    playing: {
      LABEL: 'playing',
      COLOR: 'cyan'
    },
    waiting: {
      LABEL: 'waiting',
      COLOR: 'orange'
    }
  }
}

const MAP_TOURNAMENT_STATUS = {
  'prepare': {
    LABEL: 'เตรียมการ',
    COLOR: 'purple'
  },
  'register': {
    LABEL: 'เปิดรับสมัคร',
    COLOR: 'geekblue'
  },
  'draw': {
    LABEL: 'จับฉลากสาย',
    COLOR: 'purple'
  },
  'arrange': {
    LABEL: 'จัดตารางแข่ง',
    COLOR: 'purple'
  },
  'ongoing': {
    LABEL: 'กำลังแข่งขัน',
    COLOR: 'blue'
  },
  'finish': {
    LABEL: 'แข่งเสร็จแล้ว',
    COLOR: 'green'
  },
  knockOut: {
    LABEL: 'กำลังแข่งขัน',
    COLOR: 'blue'
  },
}

const MAP_FORMAT = {
  roundRobin: 'แบ่งกลุ่ม/แพ้คัดออก',
  roundRobinConsolation: 'แบ่งกลุ่ม/แพ้คัดออก/สายล่าง',
  singleElim: 'แพ้คัดออก'
}

const MAP_EVENT_TYPE = {
  double: 'คู่',
  single: 'เดี่ยว'
}
const MAP_GENDER = {
  male: 'ชาย',
  female: 'หญิง'
}
const GROUP_NAME = [
  {
    NAME: 'A',
    VALUE: 0
  },
  {
    NAME: 'B',
    VALUE: 1
  },
  {
    NAME: 'C',
    VALUE: 2
  },
  {
    NAME: 'D',
    VALUE: 3
  },
  {
    NAME: 'E',
    VALUE: 4
  },
  {
    NAME: 'F',
    VALUE: 5
  },
  {
    NAME: 'G',
    VALUE: 6
  },
  {
    NAME: 'H',
    VALUE: 7
  },
  {
    NAME: 'I',
    VALUE: 8
  },
  {
    NAME: 'J',
    VALUE: 9
  },
  {
    NAME: 'K',
    VALUE: 10
  },
  {
    NAME: 'L',
    VALUE: 11
  },
  {
    NAME: 'M',
    VALUE: 12
  },
  {
    NAME: 'N',
    VALUE: 13
  },
  {
    NAME: 'O',
    VALUE: 14
  },
  {
    NAME: 'P',
    VALUE: 15
  }
]

const ROUND_NAME = {
  '128': '128',
  '64': '64',
  '32': '32',
  '16': '16',
  '8': 'Quarter Finals',
  '4': 'Semi Finals',
  '2': 'Finals'
}

const MAP_TOURNAMENT_STATUS_TO_DRAW_TAB = {
  'ongoing': 'group',
  'knockOut': 'knockOut',
  'finish': 'knockOut',
  'prepare': 'participants',
  'register': 'participants',
  'draw': 'participants',
  'arrange': 'participants',
}

const MAP_BOOKING_COLOR = {
  paid: '#eee',
  pending: '#eee',
  idle: '#eee',
  select: COLOR.MAIN_THEME
}
export {
  GANG,
  PLAYER,
  TAB_OPTIONS,
  COLOR,
  TRANSACTION,
  EVENT,
  MATCH,
  MAP_GENDER,
  MAP_TOURNAMENT_STATUS,
  MAP_FORMAT,
  MAP_EVENT_TYPE,
  GROUP_NAME,
  ROUND_NAME,
  MAP_TOURNAMENT_STATUS_TO_DRAW_TAB,
  MAP_BOOKING_COLOR
}