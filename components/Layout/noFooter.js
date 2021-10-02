import Header from './header'

const AppLayout = (props) => {
  return (
    <>
      <Header description='This is Home Page' />
      <main>
        <div className='content'>
          {props.children}
        </div>
      </main>
    </>
  )
}
export default AppLayout