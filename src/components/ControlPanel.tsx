import type { ReactNode } from 'react';
import { Buttons, type ButtonsProps } from './Buttons';

export type ControlPanelProps = ButtonsProps & {
  header?: ReactNode;
  footer?: ReactNode;
  status?: ReactNode;
};

export function ControlPanel({
  header,
  footer,
  status,
  ...buttonProps
}: ControlPanelProps) {
  return (
    <aside className="control-panel-inner flex h-full flex-col gap-4">
      {header ? <div className="control-panel-header">{header}</div> : null}
      <div className="flex-1">
        <Buttons {...buttonProps} />
      </div>
      {status ? <div className="control-panel-status text-sm text-zinc-400">{status}</div> : null}
      {footer ? <div className="control-panel-footer">{footer}</div> : null}
    </aside>
  );
}
