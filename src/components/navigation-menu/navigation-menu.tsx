import { useMediaQuery } from '@mui/material';
import { useTheme, styled } from '@mui/material/styles';
import { useId, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import toast from 'react-hot-toast';
import {
  BiInfoCircle,
  BiFolderPlus,
  BiCloudUpload,
  BiUpload,
  BiGame,
  BiScreenshot,
  BiFullscreen,
  BiCloudDownload,
  BiRedo,
  BiBookmarks,
  BiEdit,
  BiJoystick,
  BiUserCheck,
  BiLogInCircle,
  BiLogOutCircle,
  BiCheckShield,
  BiMenu,
  BiFileFind,
  BiBrain,
  BiRefresh,
  BiDownload
} from 'react-icons/bi';
import { MdImportExport } from 'react-icons/md';

import { NavigationMenuWidth, SystemMenuWidth } from './consts.tsx';
import { NavComponent } from './nav-component.tsx';
import { NavLeaf } from './nav-leaf.tsx';
import {
  useEmulatorContext,
  useAuthContext,
  useModalContext,
  useRunningContext,
  useDragContext,
  useLayoutContext
} from '../../hooks/context.tsx';
import { useQuickReload } from '../../hooks/emulator/use-quick-reload.tsx';
import { useLogout } from '../../hooks/use-logout.tsx';
import { useShowLoadPublicRoms } from '../../hooks/use-show-load-public-roms.tsx';
import { AboutModal } from '../modals/about.tsx';
import { CheatsModal } from '../modals/cheats.tsx';
import { ControlsModal } from '../modals/controls.tsx';
import { DownloadSaveModal } from '../modals/download-save.tsx';
import { EmulatorSettingsModal } from '../modals/emulator-settings.tsx';
import { FileSystemModal } from '../modals/file-system.tsx';
import { ImportExportModal } from '../modals/import-export.tsx';
import { LegalModal } from '../modals/legal.tsx';
import { LoadLocalRomModal } from '../modals/load-local-rom.tsx';
import { LoadRomModal } from '../modals/load-rom.tsx';
import { LoadSaveModal } from '../modals/load-save.tsx';
import { LoginModal } from '../modals/login.tsx';
import { SaveStatesModal } from '../modals/save-states.tsx';
import { UploadFilesModal } from '../modals/upload-files.tsx';
import { UploadRomToServerModal } from '../modals/upload-rom-to-server.tsx';
import { UploadSaveToServerModal } from '../modals/upload-save-to-server.tsx';
import { ButtonBase } from '../shared/custom-button-base.tsx';

type ExpandableComponentProps = {
  $isExpanded?: boolean;
};

const NavigationMenuWrapper = styled('aside')<ExpandableComponentProps>`
  display: flex;
  flex-direction: column;
  width: ${NavigationMenuWidth}px;
  height: 100dvh;
  position: fixed;
  background: linear-gradient(
    180deg,
    rgba(8, 12, 18, 0.98) 0%,
    ${({ theme }) => theme.mediumBlack} 100%
  );
  transition: left 0.4s ease-in-out;
  -webkit-transition: left 0.4s ease-in-out;
  z-index: 150;
  text-align: left;
  left: 0;
  top: 0;
  touch-action: none;
  overflow: hidden;
  border-right: 1px solid rgba(28, 118, 253, 0.28);
  box-shadow: 14px 0 30px rgba(0, 0, 0, 0.45);
  font-family: 'Oxanium', 'Space Grotesk', sans-serif;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(
          circle at 15% 20%,
          rgba(28, 118, 253, 0.18),
          transparent 45%
        ),
      radial-gradient(
          circle at 85% 12%,
          rgba(255, 255, 255, 0.06),
          transparent 40%
        );
    opacity: 0.65;
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 2px;
    height: 100%;
    background: linear-gradient(
      180deg,
      rgba(28, 118, 253, 0.7) 0%,
      rgba(28, 118, 253, 0.1) 70%
    );
    opacity: 0.6;
  }

  & > * {
    position: relative;
    z-index: 1;
  }

  ${({ $isExpanded = false }) =>
    !$isExpanded &&
    `left: -${NavigationMenuWidth + 5}px;
  `};
`;

const SystemMenuWrapper = styled('aside')`
  display: flex;
  flex-direction: column;
  width: ${SystemMenuWidth}px;
  height: 100dvh;
  position: fixed;
  right: 0;
  top: 0;
  background: linear-gradient(
    200deg,
    rgba(10, 14, 22, 0.98) 0%,
    rgba(5, 8, 13, 0.98) 100%
  );
  z-index: 150;
  text-align: left;
  overflow: hidden;
  border-left: 1px solid rgba(28, 118, 253, 0.24);
  box-shadow: -14px 0 30px rgba(0, 0, 0, 0.45);
  font-family: 'Oxanium', 'Space Grotesk', sans-serif;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(
          circle at 75% 18%,
          rgba(28, 118, 253, 0.16),
          transparent 45%
        ),
      radial-gradient(
          circle at 20% 85%,
          rgba(255, 255, 255, 0.05),
          transparent 40%
        );
    opacity: 0.6;
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 2px;
    height: 100%;
    background: linear-gradient(
      180deg,
      rgba(28, 118, 253, 0.1) 0%,
      rgba(28, 118, 253, 0.7) 60%
    );
    opacity: 0.6;
  }

  & > * {
    position: relative;
    z-index: 1;
  }
`;

const MenuHeader = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 1rem 1.25rem 0.65rem;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    left: 1.25rem;
    right: 1.25rem;
    bottom: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      rgba(28, 118, 253, 0.5),
      rgba(28, 118, 253, 0.05)
    );
  }
`;

const StyledMenuHeader = styled('h2')`
  color: ${({ theme }) => theme.pureWhite};
  font-size: 1.05rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  margin: 0;
`;

const MenuBadge = styled('span')`
  font-size: 0.62rem;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.gbaThemeBlue};
  border: 1px solid rgba(28, 118, 253, 0.35);
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  background: rgba(28, 118, 253, 0.12);
`;

const MenuItemWrapper = styled('ul')`
  margin-bottom: 0;
  margin-top: 0;
  list-style: none;
  padding: 0.65rem 0.85rem 1rem;
  overflow-y: auto;
  overscroll-behavior: none;
  touch-action: pan-y;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.35rem;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const HamburgerButton = styled(ButtonBase)<
  ExpandableComponentProps & { $areItemsDraggable: boolean }
>`
  background: linear-gradient(
    135deg,
    rgba(28, 118, 253, 0.2),
    rgba(10, 12, 18, 0.98)
  );
  color: ${({ theme }) => theme.pureWhite};
  z-index: 200;
  position: fixed;
  left: ${NavigationMenuWidth + 10}px;
  top: 12px;
  transition: 0.4s ease-in-out;
  -webkit-transition: 0.4s ease-in-out;
  transition-property: left;
  cursor: pointer;
  border-radius: 0.6rem;
  border: 1px solid rgba(28, 118, 253, 0.35);
  min-height: 36px;
  min-width: 40px;
  box-shadow: 0 10px 18px rgba(0, 0, 0, 0.35);

  @media ${({ theme }) => theme.isMobileLandscape} {
    bottom: 15px;
    top: unset;
  }

  ${({ $isExpanded = false }) =>
    !$isExpanded &&
    `left: -5px;
    `}

  &:focus {
    outline: 0;
    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
  }

  ${({ $areItemsDraggable, theme }) =>
    $areItemsDraggable &&
    `
    outline-color: ${theme.gbaThemeBlue};
    outline-style: dashed;
    outline-width: 2px;
  `}
`;

const NavigationMenuClearDismiss = styled('button')`
  position: absolute;
  width: calc(100dvw - ${NavigationMenuWidth}px);
  left: ${NavigationMenuWidth}px;
  height: 99%;
  background: 0 0;
  z-index: 140;
  border: none;
`;

export const NavigationMenu = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const { setModalContent, setIsModalOpen } = useModalContext();
  const { isAuthenticated } = useAuthContext();
  const { canvas, emulator } = useEmulatorContext();
  const { isRunning } = useRunningContext();
  const { mutate: executeLogout } = useLogout();
  const { areItemsDraggable } = useDragContext();
  const { getLayout, setLayout } = useLayoutContext();
  const menuButtonLayout = getLayout('menuButton');
  const theme = useTheme();
  const isLargerThanPhone = useMediaQuery(theme.isLargerThanPhone);
  const isMobileLandscape = useMediaQuery(theme.isMobileLandscape);
  const showSystemMenu = isLargerThanPhone && !isMobileLandscape;
  const menuHeaderId = useId();
  const systemHeaderId = useId();
  const { quickReload, isQuickReloadAvailable } = useQuickReload();

  const isMenuItemDisabledByAuth = !isAuthenticated();
  const hasApiLocation = !!process.env.NEXT_PUBLIC_GBA_SERVER_LOCATION;
  const hasNoLocalRoms = !emulator?.listRoms().length;

  useShowLoadPublicRoms();

  const systemMenuNodes = (
    <>
      <NavLeaf
        title="About"
        icon={<BiInfoCircle />}
        $withPadding
        onClick={() => {
          setModalContent(<AboutModal />);
          setIsModalOpen(true);
        }}
      />
      <NavLeaf
        title="Emulator Settings"
        icon={<BiBrain />}
        $withPadding
        onClick={() => {
          setModalContent(<EmulatorSettingsModal />);
          setIsModalOpen(true);
        }}
      />
      <NavComponent
        title="Profile"
        icon={<BiUserCheck />}
        $disabled={!hasApiLocation}
      >
        <NavLeaf
          title="Login"
          icon={<BiLogInCircle />}
          onClick={() => {
            setModalContent(<LoginModal />);
            setIsModalOpen(true);
          }}
        />
        <NavLeaf
          title="Logout"
          $disabled={isMenuItemDisabledByAuth}
          icon={<BiLogOutCircle />}
          onClick={executeLogout}
        />
        <NavLeaf
          title="Load Save (Server)"
          $disabled={isMenuItemDisabledByAuth}
          icon={<BiCloudDownload />}
          onClick={() => {
            setModalContent(<LoadSaveModal />);
            setIsModalOpen(true);
          }}
        />
        <NavLeaf
          title="Load Rom (Server)"
          $disabled={isMenuItemDisabledByAuth}
          icon={<BiCloudDownload />}
          onClick={() => {
            setModalContent(<LoadRomModal />);
            setIsModalOpen(true);
          }}
        />
        <NavLeaf
          title="Send Save to Server"
          $disabled={isMenuItemDisabledByAuth || !isRunning}
          icon={<BiCloudUpload />}
          onClick={() => {
            setModalContent(<UploadSaveToServerModal />);
            setIsModalOpen(true);
          }}
        />
        <NavLeaf
          title="Send Rom to Server"
          $disabled={isMenuItemDisabledByAuth || !isRunning}
          icon={<BiCloudUpload />}
          onClick={() => {
            setModalContent(<UploadRomToServerModal />);
            setIsModalOpen(true);
          }}
        />
      </NavComponent>
      <NavLeaf
        title="Import/Export"
        icon={<MdImportExport />}
        onClick={() => {
          setModalContent(<ImportExportModal />);
          setIsModalOpen(true);
        }}
        $withPadding
      />
      <NavLeaf
        title="Legal"
        icon={<BiCheckShield />}
        onClick={() => {
          setModalContent(<LegalModal />);
          setIsModalOpen(true);
        }}
        $withPadding
      />
    </>
  );

  return (
    <>
      <Draggable
        nodeRef={menuButtonRef}
        bounds="parent"
        axis="y"
        position={menuButtonLayout?.position ?? { x: 0, y: 0 }}
        disabled={!areItemsDraggable}
        onStop={(_, data) => {
          setLayout('menuButton', {
            position: { x: 0, y: data.y },
            standalone: true
          });
        }}
      >
        <HamburgerButton
          ref={menuButtonRef}
          id="menu-btn"
          $isExpanded={isExpanded}
          onClick={() => {
            setIsExpanded((prevState) => !prevState);
          }}
          aria-label="Menu Toggle"
          $areItemsDraggable={areItemsDraggable}
        >
          <BiMenu
            style={{ height: '29px', width: '29px', verticalAlign: 'middle' }}
          />
        </HamburgerButton>
      </Draggable>
      <NavigationMenuWrapper
        data-testid="menu-wrapper"
        id="menu-wrapper"
        $isExpanded={isExpanded}
      >
        <MenuHeader>
          <StyledMenuHeader id={menuHeaderId}>Menu</StyledMenuHeader>
          <MenuBadge>Deck</MenuBadge>
        </MenuHeader>
        <MenuItemWrapper aria-labelledby={menuHeaderId}>
          <NavComponent
            title="Pre Game Actions"
            $disabled={isRunning}
            $isExpanded={!isRunning}
            icon={<BiFolderPlus />}
          >
            <NavLeaf
              title="Upload Files"
              $disabled={isRunning}
              icon={<BiUpload />}
              onClick={() => {
                setModalContent(<UploadFilesModal />);
                setIsModalOpen(true);
              }}
            />
            <NavLeaf
              title="Load Local Rom"
              $disabled={isRunning || hasNoLocalRoms}
              icon={<BiRedo />}
              onClick={() => {
                setModalContent(<LoadLocalRomModal />);
                setIsModalOpen(true);
              }}
            />
          </NavComponent>

          <NavComponent
            title="In Game Actions"
            $disabled={!isRunning}
            $isExpanded={isRunning}
            icon={<BiGame />}
          >
            <NavLeaf
              title="Screenshot"
              $disabled={!isRunning}
              icon={<BiScreenshot />}
              onClick={() => {
                if (emulator?.screenshot())
                  toast.success('Screenshot saved successfully');
                else toast.error('Screenshot has failed');
              }}
            />
            <NavLeaf
              title="Full Screen"
              $disabled={!isRunning}
              icon={<BiFullscreen />}
              onClick={() => {
                canvas?.requestFullscreen().catch(() => {
                  toast.error('Full screen request has failed');
                });
              }}
            />
            <NavLeaf
              title="Download Save"
              $disabled={!isRunning}
              icon={<BiDownload />}
              onClick={() => {
                setModalContent(<DownloadSaveModal />);
                setIsModalOpen(true);
              }}
            />
            <NavLeaf
              title="Manage Save States"
              $disabled={!isRunning}
              icon={<BiBookmarks />}
              onClick={() => {
                setModalContent(<SaveStatesModal />);
                setIsModalOpen(true);
              }}
            />
            <NavLeaf
              title="Manage Cheats"
              $disabled={!isRunning}
              icon={<BiEdit />}
              onClick={() => {
                setModalContent(<CheatsModal />);
                setIsModalOpen(true);
              }}
            />
          </NavComponent>

          <NavLeaf
            title="Quick Reload"
            $disabled={!isQuickReloadAvailable}
            icon={<BiRefresh />}
            $withPadding
            onClick={quickReload}
          />

          <NavLeaf
            title="Controls"
            icon={<BiJoystick />}
            $withPadding
            onClick={() => {
              setModalContent(<ControlsModal />);
              setIsModalOpen(true);
            }}
          />

          <NavLeaf
            title="File System"
            icon={<BiFileFind />}
            $withPadding
            onClick={() => {
              setModalContent(<FileSystemModal />);
              setIsModalOpen(true);
            }}
          />
          {!showSystemMenu && systemMenuNodes}
        </MenuItemWrapper>
      </NavigationMenuWrapper>
      {showSystemMenu && (
        <SystemMenuWrapper data-testid="system-menu-wrapper">
          <MenuHeader>
            <StyledMenuHeader id={systemHeaderId}>System</StyledMenuHeader>
            <MenuBadge>Core</MenuBadge>
          </MenuHeader>
          <MenuItemWrapper aria-labelledby={systemHeaderId}>
            {systemMenuNodes}
          </MenuItemWrapper>
        </SystemMenuWrapper>
      )}
      {isExpanded && (!isLargerThanPhone || isMobileLandscape) && (
        <NavigationMenuClearDismiss
          aria-label="Menu Dismiss"
          onClick={() => {
            setIsExpanded(false);
          }}
        />
      )}
    </>
  );
};
