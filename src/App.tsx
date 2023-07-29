import React from "react";
import YandexDiskUploader from "./Components/YandexDiskUploader";
import './App.css' 

const App = () => {
  return (
    <div className='container'>
      <h1>Загрузите ваши файлы</h1>
      <YandexDiskUploader />
    </div>
  );
};

export default App;
