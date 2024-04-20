import './App.css';
import React from 'react';
import Dialog from './components/Dialog/Dialog.comp';
import UsersPage from './pages/UsersPage/Users.page';

class App extends React.Component {
  constructor(props) {
    super(props);

    window.app = this;
    this.state = {};
  }

  render() {
    return (
      <div className="App">
        <UsersPage />
        <Dialog ref={r=>this.alert = r}/>
      </div>
    );
  } 
}

export default App;
