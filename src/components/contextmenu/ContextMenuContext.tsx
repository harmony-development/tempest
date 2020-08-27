// partially derived from https://dev.to/dmtrkovalenko/the-neatest-way-to-handle-alert-dialogs-in-react-1aoe

import React, { useCallback } from "react";

import { ContextMenu } from "./ContextMenu";

interface IContextMenuOptions {
  entries: {
    [name: string]: (
      event: React.MouseEvent<HTMLLIElement, MouseEvent>
    ) => void;
  };
  mouseX?: number;
  mouseY?: number;
}

const ContextMenuContext = React.createContext<
  (options: IContextMenuOptions) => void
>(Promise.reject);

export const ContextMenuContextProvider = React.memo(
  ({ children }: { children: JSX.Element }) => {
    const [contextMenuState, setContextMenuState] = React.useState<
      IContextMenuOptions
    >({
      entries: {},
    });

    const openContextMenu = useCallback((options: IContextMenuOptions) => {
      setContextMenuState(options);
    }, []);

    const exitHandler = () => {
      setContextMenuState({
        entries: {},
        mouseX: undefined,
        mouseY: undefined,
      });
    };

    const closeHandler = useCallback(() => {
      setContextMenuState((old) => ({
        ...old,
        mouseX: undefined,
        mouseY: undefined,
      }));
    }, []);

    return (
      <>
        <ContextMenuContext.Provider value={openContextMenu}>
          {children}
        </ContextMenuContext.Provider>
        <ContextMenu
          entries={contextMenuState.entries}
          mouseX={contextMenuState.mouseX}
          mouseY={contextMenuState.mouseY}
          onClose={closeHandler}
          onExited={exitHandler}
        />
      </>
    );
  }
);

export const useContextMenu = () => React.useContext(ContextMenuContext);
