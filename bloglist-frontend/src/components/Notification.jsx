const Notification = ({ message, classname }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={classname}>
      {message}
    </div>
  )
}

export default Notification