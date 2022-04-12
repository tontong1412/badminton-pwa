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
  },
  idle: {
    LABEL: 'ยังไม่จ่าย',
    COLOR: 'red'
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
  }
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
export {
  GANG,
  TAB_OPTIONS,
  COLOR,
  TRANSACTION,
  EVENT,
  MATCH,
  MAP_GENDER,
  MAP_TOURNAMENT_STATUS,
  MAP_FORMAT,
  MAP_EVENT_TYPE,
  GROUP_NAME
}