import { styled } from '@mui/material/styles';
import { useEffect, useState, type ReactNode } from 'react';

import { ButtonBase } from '../shared/custom-button-base.tsx';

type NavComponentProps = {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  $isExpanded?: boolean;
  $disabled?: boolean;
};

type ComponentWrapperProps = {
  $disabled: boolean;
};

type ExpandableProps = {
  $isExpanded: boolean;
};

const NavComponentWrapper = styled('li')<ComponentWrapperProps>`
  display: block;
  width: 100%;
  margin: 0;
  box-sizing: border-box;
  color: ${({ theme }) => theme.gbaThemeBlue};
  padding: 0 2px;
  border-radius: 0.85rem;
  background: linear-gradient(
    95deg,
    rgba(28, 118, 253, 0.14),
    rgba(28, 118, 253, 0.02)
  );
  box-shadow: inset 0 0 0 1px rgba(28, 118, 253, 0.12);

  ${({ $disabled, theme }) =>
    $disabled &&
    `color: ${theme.disabledGray};
     pointer-events: none;
     cursor: default;
     background: rgba(108, 117, 125, 0.08);
     box-shadow: inset 0 0 0 1px rgba(108, 117, 125, 0.18);
    `}
`;

const HoverWrapper = styled(ButtonBase)`
  background-color: unset;
  border: none;
  color: inherit;
  cursor: pointer;
  min-height: 44px;
  padding: 0.5rem 1rem;
  text-align: inherit;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.78rem;
  line-height: 1.2;

  &:hover {
    color: ${({ theme }) => theme.menuHover};
    background-color: ${({ theme }) => theme.menuHighlight};
  }

  svg {
    font-size: 1.15rem;
  }
`;

const NavTitle = styled('span')`
  font-size: 0.8rem;
`;

const ChildrenWrapper = styled('ul')`
  list-style: none;
  padding-left: 1.25rem;
  margin: 0.35rem 0 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  border-left: 1px dashed rgba(28, 118, 253, 0.35);
`;

const ExpandableSection = styled('div')<ExpandableProps>`
  max-height: ${({ $isExpanded }) => ($isExpanded ? '800px' : '0px')};
  opacity: ${({ $isExpanded }) => ($isExpanded ? 1 : 0)};
  overflow: hidden;
  transition: max-height 350ms ease, opacity 250ms ease;
  pointer-events: ${({ $isExpanded }) => ($isExpanded ? 'auto' : 'none')};
`;

export const NavComponent = ({
  title,
  icon,
  children,
  $isExpanded = false,
  $disabled = false
}: NavComponentProps) => {
  const [isExpanded, setIsExpanded] = useState($isExpanded);

  useEffect(() => {
    setIsExpanded($isExpanded);
  }, [$isExpanded]);

  return (
    <NavComponentWrapper $disabled={$disabled}>
      <HoverWrapper
        disabled={$disabled}
        onClick={() => {
          setIsExpanded((prevState) => !prevState);
        }}
      >
        {icon}
        <NavTitle>{title}</NavTitle>
      </HoverWrapper>

      <ExpandableSection
        aria-hidden={!isExpanded}
        $isExpanded={isExpanded}
      >
        <ChildrenWrapper>{children}</ChildrenWrapper>
      </ExpandableSection>
    </NavComponentWrapper>
  );
};
