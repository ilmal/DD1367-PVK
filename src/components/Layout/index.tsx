import React, { FC, ReactNode, useEffect, useState, useCallback } from "react";
import { Titlebar } from "../Titlebar";
import { SideBar } from "../SideBar";

const { ipcRenderer } = window.require("electron");

export interface ILayout {
  children: ReactNode;
}

export const Layout: FC<ILayout> = ({ children }) => {
  // Electron updater logic
  useEffect(() => {
    ipcRenderer.send("app_version");

    ipcRenderer.on("app_version", (event: any, arg: any) => {
      ipcRenderer.removeAllListeners("app_version");
      console.log(arg.version);
    });

    ipcRenderer.on("update_available", () => {
      ipcRenderer.removeAllListeners("update_available");
      console.log("update available, downloading...");
    });

    ipcRenderer.on("update_downloaded", () => {
      ipcRenderer.removeAllListeners("update_downloaded");
      console.log("update downloaded, restarting...");
      ipcRenderer.send("restart_app");
    });
  }, []);

  return (
    <>
      <Titlebar />

      {/* Container for sidebar + main area */}
      <div className="flex h-screen">

        {/* Sidebar */}
        <SideBar />

        {/* Main area */}
        <main className="flex-1 overflow-auto bg-white select-none flex flex-row">
          {/* If you still want to render child components/pages below, you can do so */}
          <div>{children}</div>
        </main>
      </div>
    </>
  );
};
