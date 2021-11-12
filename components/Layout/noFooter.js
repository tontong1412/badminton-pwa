import Header from './header'

const AppLayout = (props) => {
  return (
    <>
      <Header  {...props} />
      <main>
        <div className='content'>
          {props.children}
        </div>
      </main>
    </>
  )
}
export default AppLayout