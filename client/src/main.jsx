import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Home, CreateBattle, JoinBattle, Battle, PrevBattles, User, Tokens, Landing,Result } from './page';
import './index.css';
import { GlobalContextProvider } from "./context";
import { OnboardModal } from "./components";
import Battle2 from './page/Battle2';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      {/* Landing page without GlobalContextProvider */}
      <Route path="/" element={<Landing />} />

      {/* Wrap the rest of the app inside GlobalContextProvider */}
      <Route
        path="/*"
        element={
          <GlobalContextProvider>
            <OnboardModal />
            <Routes>
              <Route path="/home" element={<Home />} />
              <Route path="/create-battle" element={<CreateBattle />} />
              <Route path="/join-battle" element={<JoinBattle />} />
              <Route path="/battle-history" element={<PrevBattles />} />
              <Route path="/my-Account" element={<User />} />
              <Route path="/tokens" element={<Tokens />} />
              <Route path="/battle/:battleName" element={<Battle />} />
              <Route path="/result/:battleName" element={<Result />} />
              <Route path="/battle2" element={<Battle2 />} />
            </Routes>
          </GlobalContextProvider>
        }
      />
    </Routes>
  </BrowserRouter>
);
