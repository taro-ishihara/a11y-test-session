import { createRoot } from 'react-dom/client'
import Good from './Good';
import Bad from './Bad';
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import "the-new-css-reset/css/reset.css";
import "./index.css"

const root = createRoot(document.getElementById("root")!);

root.render(
  <BrowserRouter>
    <Routes>
      <Route path='/good' Component={Good} />
      <Route path='/bad' Component={Bad} />
    </Routes>
  </BrowserRouter>
);