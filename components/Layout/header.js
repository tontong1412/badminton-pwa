import Head from 'next/head'
const Header = (props) => {
  return (
    <>
      <Head>
        <title>Bad Bay | Badminton Data Center</title>
        <meta name="description" content={props.description} />
      </Head>
      <div className='header'>
        <div>badbay</div>
      </div>
    </>
  )
}
export default Header