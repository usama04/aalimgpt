//import logo from './logo.svg';
import React, { useContext} from 'react';
import './App.css';
import './normal.css';
import { Chat } from './components/Chat';
import { LoginOrRegister } from './components/LoginOrRegister';
import { UserContext } from './context/UserContext';




function App() {
  const { token } = useContext(UserContext);

  return (
    <>
    <div className="App">

      {token ? <Chat /> : <LoginOrRegister />}

    </div>
    
    </>
    
  );
}
export default App;
