import React, { useReducer, useRef } from 'react';
import classNames from 'classnames';

import { FormRow } from './form-row';
import styles from './form.module.css';

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
  loading: boolean;
  valid: boolean;
  fileError: boolean;
  submitPayload?: SubmitPayload;
}

interface Props {
  onSubmit: (args: SubmitPayload) => Promise<void>;
}

interface Action<T> {
  // tslint:disable-next-line no-reserved-keywords
  type: string;
  payload: T;
}

type SetLoadingAction = Action<{ loading: boolean }>;
const setLoading = (loading: boolean): SetLoadingAction => ({
  type: setLoading.type,
  payload: { loading },
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

type SetDateAction = Action<{ date: string }>;
const setDate = (date: string): SetDateAction => ({
  type: setDate.type,
  payload: { date },
});
setDate.type = 'setDate';

type SetDescriptionAction = Action<{ description: string }>;
const setDescription = (description: string): SetDescriptionAction => ({
  type: setDescription.type,
  payload: { description },
});
setDescription.type = 'setDescription';

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
  | SetTagsAction
  | SetAltTextAction
  | SetDateAction
  | SetDescriptionAction
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
      const { loading } = (action as SetLoadingAction).payload;
      return {
        ...state,
        loading,
      };
    }

    case setFileError.type: {
      const { fileError } = (action as SetFileErrorAction).payload;
      return {
        ...state,
        valid: isFormValid(state),
        fileError,
      };
    }

    case setTitle.type: {
      const { title } = (action as SetTitleAction).payload;
      return {
        ...state,
        valid: isFormValid(state),
        submitPayload: {
          ...state.submitPayload,
          title,
        },
      };
    }

    case setFileName.type: {
      const { fileName } = (action as SetFileNameAction).payload;
      return {
        ...state,
        valid: isFormValid(state),
        submitPayload: {
          ...state.submitPayload,
          fileName,
        },
      };
    }

    case setFileContent.type: {
      const { fileContent } = (action as SetFileContentAction).payload;
      return {
        ...state,
        valid: isFormValid(state),
        submitPayload: {
          ...state.submitPayload,
          fileContent,
        },
      };
    }

    case setTags.type: {
      const { tags } = (action as SetTagsAction).payload;
      return {
        ...state,
        valid: isFormValid(state),
        submitPayload: {
          ...state.submitPayload,
          tags,
        },
      };
    }

    case setAltText.type: {
      const { altText } = (action as SetAltTextAction).payload;
      return {
        ...state,
        valid: isFormValid(state),
        submitPayload: {
          ...state.submitPayload,
          altText,
        },
      };
    }

    case setDate.type: {
      const { date } = (action as SetDateAction).payload;
      return {
        ...state,
        valid: isFormValid(state),
        submitPayload: {
          ...state.submitPayload,
          date,
        },
      };
    }

    case setDescription.type: {
      const { description } = (action as SetDescriptionAction).payload;
      return {
        ...state,
        valid: isFormValid(state),
        submitPayload: {
          ...state.submitPayload,
          description,
        },
      };
    }

    case resetForm.type: {
      const { submitPayload, ...newState } = state;
      return newState;
    }

    default:
      return state;
  }
};

// tslint:disable-next-line max-func-body-length
export const Form: React.SFC<Props> = ({ onSubmit }) => {
  const fileInput = useRef<HTMLInputElement>(null);
  const [state, dispatch] = useReducer<typeof reducer>(reducer, {
    loading: false,
    valid: false,
    fileError: false,
  });
  const submitDisabled = !state.valid || state.loading;
  const handleSubmit = async (evnt: React.SyntheticEvent<HTMLFormElement>) => {
    evnt.preventDefault();
    const form = evnt.currentTarget;

    if (
      state.submitPayload &&
      state.submitPayload.title &&
      state.submitPayload.tags &&
      state.submitPayload.fileName &&
      state.submitPayload.fileContent &&
      state.submitPayload.altText
    ) {
      dispatch(setLoading(true));
      try {
        await onSubmit(state.submitPayload);
      } catch (err) {
        // tslint:disable-next-line no-console
        console.error(err);
        // tslint:disable-next-line no-suspicious-comment
        // TODO: handle error :p
      }
      if (fileInput.current) {
        fileInput.current.value = '';
      }
      dispatch(resetForm());
      form.reset();
      dispatch(setLoading(false));
    }
  };
  const handleFileChange = (evnt: React.SyntheticEvent<HTMLInputElement>) => {
    if (!evnt.currentTarget.files) {
      return;
    }
    const input = evnt.currentTarget.files[0];
    const reader: FileReader = new FileReader();
    reader.readAsArrayBuffer(input);
    reader.onload = () => {
      dispatch(setFileName(input.name.trim()));
      dispatch(setFileContent(reader.result as ArrayBuffer));
    };
    reader.onerror = (err) => {
      // tslint:disable-next-line no-console
      console.error(err);
      dispatch(setFileError(true));
    };
  };
  const handleTitleChange = (evnt: React.SyntheticEvent<HTMLInputElement>) =>
    dispatch(setTitle(evnt.currentTarget.value.trim()));
  const handleTagsChange = (evnt: React.SyntheticEvent<HTMLInputElement>) =>
    dispatch(setTags(evnt.currentTarget.value.trim().split(/\s*,\s*/)));
  const handleAltTextChange = (evnt: React.SyntheticEvent<HTMLInputElement>) =>
    dispatch(setAltText(evnt.currentTarget.value.trim()));
  const handleDateChange = (evnt: React.SyntheticEvent<HTMLInputElement>) =>
    dispatch(setDate(evnt.currentTarget.value.trim()));
  const handleDescriptionChange = (
    evnt: React.SyntheticEvent<HTMLTextAreaElement>
  ) => dispatch(setDescription(evnt.currentTarget.value.trim()));

  return (
    <form method="post" onSubmit={handleSubmit}>
      <fieldset>
        <legend className={styles.legend}>Upload an image…</legend>
        {state.loading && (
          <progress className="nes-progress is-primary" max={100} />
        )}
        <FormRow id="file" label="File">
          <input
            type="file"
            id="file"
            accept="image/jpg"
            name="file"
            className={classNames(styles.fileButton, 'nes-input', {
              'is-error': state.fileError,
            })}
            placeholder="File…"
            onChange={handleFileChange}
            ref={fileInput}
            disabled={state.loading}
          />
        </FormRow>
        <FormRow id="title" label="Title">
          <input
            type="text"
            id="title"
            name="title"
            className="nes-input"
            placeholder="Title…"
            onChange={handleTitleChange}
            disabled={state.loading}
          />
        </FormRow>
        <FormRow id="tags" label="Tags">
          <input
            type="text"
            id="tags"
            name="tags"
            className="nes-input"
            placeholder="Tags…"
            onChange={handleTagsChange}
            disabled={state.loading}
          />
        </FormRow>
        <FormRow id="altText" label="Alt-Text">
          <input
            type="text"
            id="altText"
            name="altText"
            maxLength={130}
            className="nes-input"
            placeholder="Alt-Text…"
            onChange={handleAltTextChange}
            disabled={state.loading}
          />
        </FormRow>
        <FormRow id="date" label="Date">
          <input
            type="date"
            id="date"
            name="date"
            className="nes-input"
            placeholder="Date…"
            onChange={handleDateChange}
            disabled={state.loading}
          />
        </FormRow>
        <FormRow id="description" label="Description">
          <textarea
            id="description"
            name="description"
            className="nes-textarea"
            placeholder="Description…"
            onChange={handleDescriptionChange}
            disabled={state.loading}
          />
        </FormRow>
      </fieldset>
      <button
        className={classNames(styles.submit, 'nes-btn is-primary')}
        disabled={submitDisabled}
      >
        Submit
      </button>
    </form>
  );
};
