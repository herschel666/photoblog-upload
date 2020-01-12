import React from 'react';
import { render } from '@testing-library/react';

import { LoadingBar, LoadingState, getLabel } from './loading-bar';

const loadingStates = Array.from(
  { length: 5 },
  (_, i) => ((i + 1) * 10) as LoadingState
);

it.each(loadingStates)('handles loading state %s', (loadingState) => {
  const { getByText } = render(<LoadingBar value={loadingState} />);

  getByText(getLabel(loadingState));
});
