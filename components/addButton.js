const AddButton = (props) => {
  return (
    <div
      className='add-button'
      style={props.style}
      onClick={props.onClick}
    >+</div >
  )
}
export default AddButton