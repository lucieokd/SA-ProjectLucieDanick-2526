

function verifyEmailPage() {
  return (
    <div className="verify-email-page">
        <h1>Verify Email Page</h1>
        <input type="email" placeholder="test.test@test.com"></input>
        <input type="email" placeholder="confirm test.test@test.com " />
        <button>Send verification email</button>
    </div>
  )
}

export default verifyEmailPage;