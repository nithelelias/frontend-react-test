import './style/App.css';
import './style/Animations.css';
import AppHeaderCom from './components/AppHeader';
import MainPage from './pages/MainPage';

/**
 *  Main App Body
 * @returns  ReactNode
 */
function App() { 
  return (
    <div className="App">
      <AppHeaderCom />
      <div id="AppPage" className='page-container'>
        <MainPage />
      </div>      
    </div>
  );
}

export default App;
