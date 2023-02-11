import React, { useEffect, useState } from 'react';
import { PDFDownloadLink, Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
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
    fontSize: 9,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    borderTop: '1px solid #EEE',
    paddingTop: 5,
    paddingBottom: 5,
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
  row5: {
    width: '5%',
    textAlign: 'center'
  },
  row20: {
    width: '20%',
  },
  row15: {
    width: '15%',
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

            <Text style={styles.row5}>Match</Text>
            <Text style={styles.row10}>เวลา</Text>
            <Text style={styles.row8}>ประเภท</Text>

            <Text style={styles.row15}>ผู้แข่งขัน</Text>
            <Text style={styles.row15}>ทีม</Text>
            <Text style={styles.row10}>คะแนน</Text>
            <Text style={styles.row15}>ผู้แข่งขัน</Text>
            <Text style={styles.row15}>ทีม</Text>
            <Text style={styles.row8}>คูปองลูก</Text>
            <Text style={styles.row10}>หมายเหตุ</Text>
          </View>
          {data?.map((row, i) => (
            <View key={i} style={styles.row} wrap={false}>
              <Text style={{ ...styles.row5, textAlign: 'center' }}>{row.matchNumber}</Text>
              <View style={styles.row10}>
                <Text style={{ textAlign: 'center' }}>{moment(row?.date).format('DD MMM yy')}</Text>
                <Text>{moment(row?.date).format('HH:mm')}</Text>
              </View>
              <Text style={styles.row8}>{row?.eventName}</Text>


              <View style={styles.row15}>
                {row.teamA?.team?.players.map(player => <Text key={player?._id}>{player?.officialName}</Text>)}
              </View>

              <View style={styles.row15}>
                {row.teamA?.team?.players.map(player => <Text key={player?._id}>{player?.club}</Text>)}
              </View>

              <Text style={styles.row10}>{''}</Text>

              <View style={styles.row15}>
                {row.teamB?.team?.players.map(player => <Text key={player?._id}>{player?.officialName}</Text>)}
              </View>

              <View style={styles.row15}>
                {row.teamB?.team?.players.map(player => <Text key={player?._id}>{player?.club}</Text>)}
              </View>

              <Text style={styles.row8}>{row?.shuttlecockCredit}</Text>
              <Text style={styles.row10}>{''}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  )
}

const DownloadDoc = ({ data }) => {
  const [client, setClient] = useState(false)
  useEffect(() => {
    setClient(true)
  }, [])

  return <PDFDownloadLink document={<MyDocument data={data} />} fileName={`match_list.pdf`}>
    {({ blob, url, loading, error }) => (loading ? 'Loading document...' : 'Download')}
  </PDFDownloadLink>
}
export default DownloadDoc