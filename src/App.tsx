/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Routes, Route } from 'react-router';
import Landing from './pages/Landing';
import Hub from './pages/Hub';
import Realm from './pages/Realm';
import Crucible from './pages/Crucible';
import Codex from './pages/Codex';
import Onboarding from './pages/Onboarding';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/hub" element={<Hub />} />
      <Route path="/realm/:realmId" element={<Realm />} />
      <Route path="/crucible/:realmId" element={<Crucible />} />
      <Route path="/codex" element={<Codex />} />
    </Routes>
  );
}
