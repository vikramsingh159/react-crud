import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import MainComponent from './components/MainComponent';



const App = () => {

  return (
    <div className="App p-6 bg-gray-100 min-h-screen">
      <Router>
        <Routes>
          <Route path='/' element={<MainComponent />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
