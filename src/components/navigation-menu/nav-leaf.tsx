import { styled } from '@mui/material/styles';

import { ButtonBase } from '../shared/custom-button-base.tsx';

import type { ReactNode } from 'react';

type NavLeafProps = {
  title: string;
  icon: ReactNode;
  $link?: string;
  $disabled?: boolean;
  $withPadding?: boolean;
  onClick?: () => void;
};

type LeafWrapperProps = {
  $disabled: boolean;
};

type NavLinkProps = {
  $withPadding: boolean;
};

type NavLeafButtonProps = {
  $withPadding: boolean;
};

const NavLeafWrapper = styled('li')<LeafWrapperProps>`
  display: block;
  width: 100%;
  margin: 0;
  box-sizing: border-box;
  cursor: pointer;
  color: ${({ theme }) => theme.gbaThemeBlue};
  list-style-type: none;
  padding: 0 2px;
  border-radius: 0.75rem;
  background: linear-gradient(
    95deg,
    rgba(28, 118, 253, 0.12),
    rgba(28, 118, 253, 0.02)
  );
  box-shadow: inset 0 0 0 1px rgba(28, 118, 253, 0.12);
  transition: transform 0.2s ease, background 0.2s ease, color 0.2s ease;

  ${({ $disabled, theme }) =>
    $disabled &&
    `color: ${theme.disabledGray};
     pointer-events: none;
     cursor: default;
     background: rgba(108, 117, 125, 0.08);
     box-shadow: inset 0 0 0 1px rgba(108, 117, 125, 0.18);
    `}

  &:hover {
    color: ${({ theme }) => theme.menuHover};
    background: linear-gradient(
      95deg,
      rgba(28, 118, 253, 0.28),
      rgba(28, 118, 253, 0.08)
    );
    transform: translateX(2px);
  }

  svg {
    font-size: 1.15rem;
  }
`;

const NavLeafButton = styled(ButtonBase)<NavLeafButtonProps>`
  background-color: unset;
  border: none;
  color: inherit;
  min-height: 44px;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem ${({ $withPadding }) => ($withPadding ? '1rem' : '0.5rem')};
  line-height: 1.2;

  text-align: inherit;
  width: 100%;
  cursor: pointer;
`;

const NavTitle = styled('span')`
  font-size: 0.92rem;
  letter-spacing: 0.03em;
`;

const NavLink = styled('a')<NavLinkProps>`
  text-decoration: none;
  color: unset;
  outline-offset: 0;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem ${({ $withPadding }) => ($withPadding ? '1rem' : '0.5rem')};
  min-height: 44px;
  line-height: 1.2;
`;

export const NavLeaf = ({
  title,
  icon,
  onClick,
  $link,
  $disabled = false,
  $withPadding = false
}: NavLeafProps) => {
  const commonChildren = (
    <>
      {icon}
      <NavTitle>{title}</NavTitle>
    </>
  );

  return (
    <NavLeafWrapper $disabled={$disabled}>
      {$link ? (
        <NavLink href={$link} $withPadding={$withPadding} target="_blank">
          {commonChildren}
        </NavLink>
      ) : (
        <NavLeafButton
          disabled={$disabled}
          onClick={onClick}
          $withPadding={$withPadding}
        >
          {commonChildren}
        </NavLeafButton>
      )}
    </NavLeafWrapper>
  );
};
