

import './App.css'
import { Show,SignInButton,SignOutButton,SignUpButton,UserButton } from '@clerk/react'

function App() {
 

  return (
    <>
    <h1>HELLO ! </h1>
    <Show when="signed-out">
      <SignInButton mode='modal'/>
      <SignUpButton mode='modal'/>
    </Show>
    <Show when="signed-in">
      <UserButton/>
      <SignOutButton/>
    </Show>
    </>
  )
}

export default App
