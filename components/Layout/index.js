import Footer from './footer'
import Header from './header'

const AppLayout = (props) => {
  return (
    <>
      <Header description='This is Home Page' />
      <main>{props.children}</main>
      <Footer />
    </>
  )
}
export default AppLayout