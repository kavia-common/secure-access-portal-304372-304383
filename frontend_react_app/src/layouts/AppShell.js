import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import SideDrawer from "../components/SideDrawer";
import TopNav from "../components/TopNav";

/**
 * PUBLIC_INTERFACE
 * AppShell - shared layout: top navigation + side drawer + content area.
 */
export default function AppShell() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="app-shell">
      <TopNav onToggleDrawer={() => setDrawerOpen((v) => !v)} />
      <SideDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <main className="content" onClick={() => drawerOpen && setDrawerOpen(false)}>
        <Outlet />
      </main>
    </div>
  );
}
