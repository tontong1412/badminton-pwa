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
    MATCHES: 'matces'
  }
}
export {
  GANG,
  TAB_OPTIONS,
  COLOR,
  TRANSACTION,
  EVENT
}