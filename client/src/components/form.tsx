import React, { useReducer, useRef } from 'react';
// tslint:disable-next-line match-default-export-name
import TextareaAutosize from 'react-textarea-autosize';
import classNames from 'classnames';

import { FormRow } from './form-row';
import { LoadingBar, LoadingState } from './loading-bar';
import { ImageInput } from './image-input';
import styles from './form.module.css';

export type UpldateLoadingStateFunction = (loadingState?: LoadingState) => void;

export interface SubmitPayload {
  fileName?: string;
  fileContent?: ArrayBuffer;
  title?: string;
  tags?: string[];
  altText?: string;
  date?: string;
  description?: string;
}

interface ReducerShape {
  loadingState?: LoadingState;
  valid: boolean;
  fileError: boolean;
  submitPayload?: SubmitPayload;
}

interface Props {
  onSubmit: (
    updateLoadingState: UpldateLoadingStateFunction,
    args?: SubmitPayload
  ) => Promise<void>;
  onSubmitError: (err: unknown) => void;
}

interface Action<T> {
  // tslint:disable-next-line no-reserved-keywords
  type: string;
  payload: T;
}

type SetLoadingAction = Action<{ loadingState?: LoadingState }>;
const setLoading = (loadingState?: LoadingState): SetLoadingAction => ({
  type: setLoading.type,
  payload: { loadingState },
});
setLoading.type = 'setLoading';

type SetFileErrorAction = Action<{ fileError: boolean }>;
const setFileError = (fileError: boolean): SetFileErrorAction => ({
  type: setFileError.type,
  payload: { fileError },
});
setFileError.type = 'setFileError';

type SetTitleAction = Action<{ title: string }>;
const setTitle = (title: string): SetTitleAction => ({
  type: setTitle.type,
  payload: { title },
});
setTitle.type = 'setTitle';

type SetFileNameAction = Action<{ fileName: string }>;
const setFileName = (fileName: string): SetFileNameAction => ({
  type: setFileName.type,
  payload: { fileName },
});
setFileName.type = 'setFileName';

type SetFileContentAction = Action<{ fileContent: ArrayBuffer }>;
const setFileContent = (fileContent: ArrayBuffer): SetFileContentAction => ({
  type: setFileContent.type,
  payload: { fileContent },
});
setFileContent.type = 'setFileContent';

type ResetFileAction = Action<void>;
const resetFile = (): ResetFileAction => ({
  type: resetFile.type,
  payload: undefined,
});
resetFile.type = 'resetFile';

type SetTagsAction = Action<{ tags: string[] }>;
const setTags = (tags: string[]): SetTagsAction => ({
  type: setTags.type,
  payload: { tags },
});
setTags.type = 'setTags';

type SetAltTextAction = Action<{ altText: string }>;
const setAltText = (altText: string): SetAltTextAction => ({
  type: setAltText.type,
  payload: { altText },
});
setAltText.type = 'setAltText';

type SetDescriptionAction = Action<{ description: string }>;
const setDescription = (description: string): SetDescriptionAction => ({
  type: setDescription.type,
  payload: { description },
});
setDescription.type = 'setDescription';

type SetDateAction = Action<{ date: string }>;
const setDate = (date: string): SetDateAction => ({
  type: setDate.type,
  payload: { date },
});
setDate.type = 'setDate';

type ResetFormAction = Action<void>;
const resetForm = (): ResetFormAction => ({
  type: resetForm.type,
  payload: undefined,
});
resetForm.type = 'resetForm';

type ReducerAction =
  | SetLoadingAction
  | SetFileErrorAction
  | SetTitleAction
  | SetFileNameAction
  | SetFileContentAction
  | ResetFileAction
  | SetTagsAction
  | SetAltTextAction
  | SetDescriptionAction
  | SetDateAction
  | ResetFormAction;

export const hasRequiredPayload = (submitPayload?: SubmitPayload): boolean => {
  return Boolean(
    submitPayload &&
      submitPayload.title &&
      submitPayload.tags &&
      submitPayload.fileName &&
      submitPayload.fileContent &&
      submitPayload.altText
  );
};

const isFormValid = (state: ReducerShape): boolean => {
  return !state.fileError && hasRequiredPayload(state.submitPayload);
};

// tslint:disable-next-line max-func-body-length
const reducer = (state: ReducerShape, action: ReducerAction): ReducerShape => {
  switch (action.type) {
    case setLoading.type: {
      const { loadingState } = (action as SetLoadingAction).payload;
      return {
        ...state,
        loadingState,
      };
    }

    case setFileError.type: {
      const { fileError } = (action as SetFileErrorAction).payload;
      const newState = {
        ...state,
        fileError,
      };

      return {
        ...newState,
        valid: isFormValid(newState),
      };
    }

    case setTitle.type: {
      const { title } = (action as SetTitleAction).payload;
      const newState = {
        ...state,
        submitPayload: {
          ...state.submitPayload,
          title,
        },
      };

      return {
        ...newState,
        valid: isFormValid(newState),
      };
    }

    case setFileName.type: {
      const { fileName } = (action as SetFileNameAction).payload;
      const newState = {
        ...state,
        submitPayload: {
          ...state.submitPayload,
          fileName,
        },
      };

      return {
        ...newState,
        valid: isFormValid(newState),
      };
    }

    case setFileContent.type: {
      const { fileContent } = (action as SetFileContentAction).payload;
      const newState = {
        ...state,
        submitPayload: {
          ...state.submitPayload,
          fileContent,
        },
      };

      return {
        ...newState,
        valid: isFormValid(newState),
      };
    }

    case resetFile.type: {
      const { fileName, fileContent, ...submitPayload } =
        state.submitPayload || {};

      return {
        ...state,
        fileError: false,
        submitPayload,
      };
    }

    case setTags.type: {
      const { tags } = (action as SetTagsAction).payload;
      const newState = {
        ...state,
        submitPayload: {
          ...state.submitPayload,
          tags,
        },
      };

      return {
        ...newState,
        valid: isFormValid(newState),
      };
    }

    case setAltText.type: {
      const { altText } = (action as SetAltTextAction).payload;
      const newState = {
        ...state,
        submitPayload: {
          ...state.submitPayload,
          altText,
        },
      };

      return {
        ...newState,
        valid: isFormValid(newState),
      };
    }

    case setDescription.type: {
      const { description } = (action as SetDescriptionAction).payload;
      const newState = {
        ...state,
        submitPayload: {
          ...state.submitPayload,
          description,
        },
      };

      return {
        ...newState,
        valid: isFormValid(newState),
      };
    }

    case setDate.type: {
      const { date } = (action as SetDateAction).payload;
      const newState = {
        ...state,
        submitPayload: {
          ...state.submitPayload,
          date,
        },
      };

      return {
        ...newState,
        valid: isFormValid(newState),
      };
    }

    case resetForm.type: {
      const { submitPayload, loadingState, ...newState } = state;
      return newState;
    }

    default:
      return state;
  }
};

// tslint:disable-next-line max-func-body-length
export const Form: React.SFC<Props> = ({ onSubmit, onSubmitError }) => {
  const fileInput = useRef<HTMLInputElement>(null);
  const [state, dispatch] = useReducer<typeof reducer>(reducer, {
    valid: false,
    fileError: false,
  });
  const inputDisabled = !(state.loadingState === undefined);
  const submitDisabled = !state.valid || inputDisabled;
  const handleFileChange = (
    err: ProgressEvent<FileReader> | null,
    name: string,
    image: ArrayBuffer
  ) => {
    if (err) {
      // tslint:disable-next-line no-console
      console.error(err);
      dispatch(setFileError(true));
      return;
    }
    dispatch(setFileName(name));
    dispatch(setFileContent(image));
  };
  const handleFileReset = () => {
    if (fileInput.current) {
      fileInput.current.value = '';
    }
    dispatch(resetFile());
  };
  const handleReset = () => {
    window.scrollTo(0, 0);
    handleFileReset();
    dispatch(resetForm());
  };
  const handleSubmit = async (evnt: React.SyntheticEvent<HTMLFormElement>) => {
    evnt.preventDefault();
    window.scrollTo(0, 0);

    const form = evnt.currentTarget;

    if (
      state.submitPayload &&
      state.submitPayload.title &&
      state.submitPayload.tags &&
      state.submitPayload.fileName &&
      state.submitPayload.fileContent &&
      state.submitPayload.altText
    ) {
      const updateLoadingState: UpldateLoadingStateFunction = (loadingState) =>
        dispatch(setLoading(loadingState));
      try {
        await onSubmit(updateLoadingState, state.submitPayload);
      } catch (err) {
        // tslint:disable-next-line no-console
        console.error(err);
        onSubmitError(err);
      }
      if (fileInput.current) {
        fileInput.current.value = '';
      }
      dispatch(resetForm());
      form.reset();
    }
  };
  const handleTitleChange = (evnt: React.SyntheticEvent<HTMLInputElement>) =>
    dispatch(setTitle(evnt.currentTarget.value.trim()));
  const handleTagsChange = (evnt: React.SyntheticEvent<HTMLTextAreaElement>) =>
    dispatch(setTags(evnt.currentTarget.value.trim().split(/\s*,\s*/)));
  const handleAltTextChange = (
    evnt: React.SyntheticEvent<HTMLTextAreaElement>
  ) => dispatch(setAltText(evnt.currentTarget.value.trim()));
  const handleDescriptionChange = (
    evnt: React.SyntheticEvent<HTMLTextAreaElement>
  ) => dispatch(setDescription(evnt.currentTarget.value.trim()));
  const handleDateChange = (evnt: React.SyntheticEvent<HTMLInputElement>) =>
    dispatch(setDate(evnt.currentTarget.value.trim()));

  return (
    <form method="post" onSubmit={handleSubmit}>
      <fieldset>
        <legend className={styles.legend}>Upload an image…</legend>
        <LoadingBar value={state.loadingState} />
        <FormRow id="file" label="File">
          <ImageInput
            ref={fileInput}
            id="file"
            name="file"
            disabled={inputDisabled}
            onChange={handleFileChange}
            onReset={handleFileReset}
            hasError={state.fileError}
          />
        </FormRow>
        <FormRow id="title" label="Title">
          <input
            type="text"
            id="title"
            name="title"
            className={classNames(styles.input, 'nes-input')}
            placeholder="Title…"
            onChange={handleTitleChange}
            disabled={inputDisabled}
          />
        </FormRow>
        <FormRow id="tags" label="Tags">
          <TextareaAutosize
            minRows={1}
            id="tags"
            name="tags"
            className={classNames(styles.textarea, 'nes-textarea')}
            placeholder="Tags…"
            autoCapitalize="off"
            onChange={handleTagsChange}
            disabled={inputDisabled}
          />
        </FormRow>
        <FormRow id="altText" label="Alt-Text">
          <TextareaAutosize
            id="altText"
            name="altText"
            maxLength={280}
            minRows={1}
            className={classNames(styles.textarea, 'nes-textarea')}
            placeholder="Alt-Text…"
            onChange={handleAltTextChange}
            disabled={inputDisabled}
          />
        </FormRow>
        <FormRow id="description" label="Description">
          <TextareaAutosize
            id="description"
            name="description"
            className={classNames(styles.textarea, 'nes-textarea')}
            minRows={1}
            placeholder="Description…"
            onChange={handleDescriptionChange}
            disabled={inputDisabled}
          />
        </FormRow>
        <FormRow id="date" label="Date">
          <input
            type="date"
            id="date"
            name="date"
            className={classNames(styles.input, 'nes-input')}
            placeholder="Date…"
            onChange={handleDateChange}
            disabled={inputDisabled}
          />
        </FormRow>
      </fieldset>
      <button
        type="reset"
        className={classNames(styles.reset, 'nes-btn')}
        disabled={inputDisabled}
        onClick={handleReset}
      >
        Reset
      </button>
      <button
        className={classNames(styles.submit, 'nes-btn is-primary')}
        disabled={submitDisabled}
      >
        Submit
      </button>
    </form>
  );
};
