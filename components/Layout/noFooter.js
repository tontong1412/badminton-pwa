import Header from './header'

const AppLayout = (props) => {
  return (
    <>
      <Header  {...props} />
      <main>
        <div
          className='content'
          style={{ paddingBottom: 0 }}
        >
          {props.children}
        </div>
      </main>
    </>
  )
}
export default AppLayout