const LoginForm = ({ handleLogin, username, usernameChange, password, passwordChange }) => {
  return(
    <>
      <h2>Log in to bloglist</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>
                    username
            <input
              type="text"
              value={username}
              onChange={usernameChange}/>
          </label>
        </div>
        <div>
          <label>
                    password
            <input
              type="password"
              value={password}
              onChange={passwordChange}/>
          </label>
        </div>
        <button type="submit">login</button>
      </form>
    </>
  )
}

export default LoginForm