
import { Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';
import Button from 'react-bootstrap/Button';
import SparepartForm from './Screens/SparepartStoreForm/SparepartForm';

const App = (props) => {
  const {
    auth,
  } = props;

  const handleAuth = () => {
    if (auth.isAuthenticated()) {
      auth.logout();
    } else {
      auth.login();
    }
  }

  return (
    <Row className='app'>
      <Col xs={12} className='auth'>
        <Button variant="secondary" onClick={handleAuth}>
          {
            auth.isAuthenticated() ? 'LogOut' : 'LogIn'
          }
        </Button>
      </Col>
      <Col xs={12} className='form'>
      {auth.isAuthenticated() && <SparepartForm auth={auth}/> }
      </Col>
    </Row>
  )
}

export default App;
