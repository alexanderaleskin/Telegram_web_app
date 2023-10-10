// import logo from './logo.svg';
import './App.css';
import { FileSystem } from './fileSystem.page';



import { BrowserRouter, Routes, Route } from "react-router-dom";


function App() {


  return (
    <BrowserRouter>
      <Routes>
      <Route path="" element={<FileSystem />} />
        <Route path="/:itemId" element={<FileSystem />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
