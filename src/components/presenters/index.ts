import { ComponentType } from 'react';
import { ContentType } from '../../types/app-state';
import type { ScreenPresenterProps } from './types';
import { AiLoadingPresenter } from './AiLoadingPresenter';
import { IndustryPickerPresenter } from './IndustryPickerPresenter';
import { MultiChoicePresenter } from './MultiChoicePresenter';
import { ReportViewPresenter } from './ReportViewPresenter';
import { SingleChoicePresenter } from './SingleChoicePresenter';
import { TextInputPresenter } from './TextInputPresenter';

type PresenterComponent = ComponentType<ScreenPresenterProps>;

export const PRESENTERS: Record<ContentType, PresenterComponent> = {
  [ContentType.INDUSTRY_PICKER]: IndustryPickerPresenter,
  [ContentType.SINGLE_CHOICE]: SingleChoicePresenter,
  [ContentType.MULTI_CHOICE]: MultiChoicePresenter,
  [ContentType.TEXT_INPUT]: TextInputPresenter,
  [ContentType.AI_LOADING]: AiLoadingPresenter,
  [ContentType.REPORT_VIEW]: ReportViewPresenter,
};

export type { ScreenPresenterProps };
