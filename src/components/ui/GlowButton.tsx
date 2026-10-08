import type {ComponentProps, ReactNode} from 'react';
import {Link} from '@/i18n/navigation';
import styles from './GlowButton.module.css';

type Variant = 'primary' | 'ghost';
type Size = 'md' | 'sm' | 'nav';

interface BaseProps {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  block?: boolean;
  className?: string;
}

type LinkProps = BaseProps &
  Omit<ComponentProps<typeof Link>, 'className' | 'children'> & {href: ComponentProps<typeof Link>['href']};
type AnchorProps = BaseProps &
  Omit<ComponentProps<'a'>, 'className' | 'children' | 'href'> & {externalHref: string};
type ButtonProps = BaseProps & Omit<ComponentProps<'button'>, 'className' | 'children'>;

export function glowClass({variant = 'primary', size = 'md', block, className}: Omit<BaseProps, 'children'>) {
  return [
    styles.btn,
    variant === 'ghost' && styles.ghost,
    size === 'sm' && styles.sm,
    size === 'nav' && styles.nav,
    block && styles.block,
    className
  ]
    .filter(Boolean)
    .join(' ');
}

export function GlowButton(props: LinkProps | AnchorProps | ButtonProps) {
  const {children, variant, size, block, className, ...rest} = props;
  const cls = glowClass({variant, size, block, className});

  if ('externalHref' in rest) {
    const {externalHref, ...anchor} = rest;
    return (
      <a href={externalHref} className={cls} {...anchor}>
        {children}
      </a>
    );
  }
  if ('href' in rest) {
    return (
      <Link className={cls} {...(rest as Omit<LinkProps, keyof BaseProps>)}>
        {children}
      </Link>
    );
  }
  return (
    <button className={cls} {...(rest as Omit<ButtonProps, keyof BaseProps>)}>
      {children}
    </button>
  );
}
