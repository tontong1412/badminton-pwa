import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import moment from 'moment'


// Register Font
Font.register({
  family: "Sarabun",
  src:
    "/Sarabun-Light.ttf"
});

// Create styles
const styles = StyleSheet.create({
  table: {
    width: '100%',
    fontFamily: 'Sarabun',
    fontSize: 10,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    borderTop: '1px solid #EEE',
    paddingTop: 2,
    paddingBottom: 2,
    alignItems: 'center'
  },
  header: {
    borderTop: 'none',
    marginTop: 15,
    fontWeight: 'bold'
  },
  bold: {
    fontWeight: 'bold',
  },
  // So Declarative and unDRY 👌
  row10: {
    width: '10%',
    textAlign: 'center'
  },
  row25: {
    width: '25%',
  },
  row8: {
    width: '8%',
    textAlign: 'center'
  },
  row20: {
    width: '20%',
  },
})

const data = [1, 2, 3]
// Create Document Component
const MyDocument = ({ data }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page} orientation='landscape'>
        <View style={styles.table}>
          <View style={[styles.row, styles.bold, styles.header]} fixed>

            <Text style={styles.row10}>ลำดับที่</Text>
            <Text style={styles.row10}>วันที่สมัคร</Text>
            <Text style={styles.row10}>มือ</Text>

            <Text style={styles.row20}>ผู้สมัคร</Text>
            <Text style={styles.row20}>ทีม</Text>
            <Text style={styles.row8}>ค่าสมัคร</Text>
            <Text style={styles.row8}>คูปองลูก</Text>
            <Text style={styles.row20}>หมายเหตุ</Text>
          </View>
          {data?.teams?.map((row, i) => (
            <View key={i} style={styles.row} wrap={false}>
              <Text style={styles.row10}>{i + 1}</Text>
              <Text style={styles.row10}>{moment(row.date).format('DD MMM yyyy')}</Text>
              <Text style={styles.row10}>{data.name}</Text>


              <View style={styles.row20}>
                {row.team.players.map(player => <Text key={player._id}>{player.officialName}</Text>)}
              </View>

              <View style={styles.row20}>
                {row.team.players.map(player => <Text key={player._id}>{player.club}</Text>)}
              </View>

              <Text style={styles.row8}>{row.paymentStatus === 'paid' ? '/' : ''}</Text>
              <Text style={styles.row8}>{row.shuttlecockCredit}</Text>
              <Text style={styles.row20}>{''}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  )
}
export default MyDocument