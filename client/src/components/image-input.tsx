import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  forwardRef,
} from 'react';
import classNames from 'classnames';

import styles from './image-input.module.css';

interface Props {
  id: string;
  name: string;
  disabled: boolean;
  hasError: boolean;
  onChange: (
    err: ProgressEvent<FileReader> | null,
    name: string,
    image: ArrayBuffer
  ) => void;
  onReset: () => void;
}

export const ImageInput = forwardRef<HTMLInputElement, Props>(
  ({ id, name, disabled, hasError, onChange, onReset }, ref) => {
    const [preview, setPreview] = useState<string | null>(null);
    const [resetListenerBound, setResetListenerBound] = useState<boolean>(
      false
    );
    const formRef = useRef<HTMLFormElement | null>();
    const fileWrapClassName = classNames({
      [styles.fileWrap]: Boolean(preview),
    });
    const handleChange = (evnt: React.SyntheticEvent<HTMLInputElement>) => {
      formRef.current = evnt.currentTarget.form;

      if (!evnt.currentTarget.files) {
        return;
      }

      const file = evnt.currentTarget.files[0];
      const fileName = file.name.trim();
      const contentReader: FileReader = new FileReader();
      const previewReader: FileReader = new FileReader();

      contentReader.readAsArrayBuffer(file);
      contentReader.onload = () =>
        onChange(null, fileName, contentReader.result as ArrayBuffer);
      contentReader.onerror = (err) => onChange(err, '', new ArrayBuffer(0));

      previewReader.readAsDataURL(file);
      previewReader.onload = () => setPreview(previewReader.result as string);
      previewReader.onerror = (err) => {
        // tslint:disable-next-line no-console
        console.error(err);
        setPreview(`data:${file.type};base64,=`);
      };
    };
    const handleReset = useCallback(() => {
      setPreview(null);
      onReset();
    }, [onReset, setPreview]);

    useEffect(() => {
      if (formRef.current && !resetListenerBound) {
        formRef.current.addEventListener('reset', handleReset);
        setResetListenerBound(true);
      }
    }, [handleReset, resetListenerBound]);

    return (
      <>
        {Boolean(preview) && (
          <>
            <img
              src={preview!}
              className={styles.image}
              alt=""
              role="presentation"
            />
            <button
              type="button"
              onClick={handleReset}
              className={classNames(styles.button, 'nes-btn is-error')}
              disabled={disabled}
              aria-label="Reset"
            >
              &times;
            </button>
          </>
        )}
        <div className={fileWrapClassName}>
          <input
            type="file"
            id={id}
            accept="image/jpg"
            name={name}
            className={classNames(styles.file, 'nes-input', {
              'is-error': hasError,
            })}
            ref={ref}
            disabled={disabled}
            onChange={handleChange}
          />
        </div>
      </>
    );
  }
);
