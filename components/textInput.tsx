'use client';

import { ChangeEventHandler, FC, useEffect, useRef, useState } from 'react';
import Keyboard, { SimpleKeyboard } from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import { createPortal } from 'react-dom';

export interface TextInputProps {
  type?: 'text' | 'password';
  placeholder?: string;
  className?: string;
  onChange?: (newValue: string) => void;
  value?: string;
}

export const TextInput: FC<TextInputProps> = ({
  type,
  placeholder,
  className,
  onChange,
  value,
}) => {
  const [needsOsk, setNeedsOsk] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const [keyboard, setKeyboard] = useState<SimpleKeyboard | null>(null);
  const [layoutName, setLayoutName] = useState<'default' | 'shift'>('default');
  const inputRef = useRef<HTMLInputElement>(null);
  const [keyboardContainer, setKeyboardContainer] =
    useState<HTMLElement | null>(null);

  useEffect(() => {
    if (showKeyboard) {
      keyboard?.setInput(value ?? '');
    }
  }, [value, showKeyboard, keyboard]);

  useEffect(() => {
    if (!showKeyboard) {
      setCapsLock(false);
    }
  }, [showKeyboard]);

  useEffect(() => {
    setKeyboardContainer(document.getElementById('keyboard-container'));

    const clickAndFocusHandler = (
      event: WindowEventMap['click'] | WindowEventMap['focus'],
    ) => {
      const classList = (event.target as HTMLInputElement).classList;
      if (
        event.target !== inputRef.current &&
        !classList?.contains('hg-button') &&
        !classList?.contains('hg-rows') &&
        !classList?.contains('hg-row') &&
        !classList?.contains('simple-keyboard')
      ) {
        setShowKeyboard(false);
      }
    };

    const touchHandler = () => {
      const { userAgent } = navigator;
      const isLinux =
        userAgent.includes('Linux') &&
        !userAgent.includes('Macintosh') &&
        !userAgent.includes('Android');
      if (isLinux) {
        setNeedsOsk(true);
      }
    };

    window.addEventListener('click', clickAndFocusHandler);
    window.addEventListener('focus', clickAndFocusHandler, true);
    window.addEventListener('touchstart', touchHandler);
    return () => {
      window.removeEventListener('click', clickAndFocusHandler);
      window.removeEventListener('focus', clickAndFocusHandler, true);
      window.removeEventListener('touchstart', touchHandler);
    };
  }, []);

  const onInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    if (event.target.value !== value) {
      onChange?.(event.target.value);
    }
  };

  const onKeyboardChange = (newValue: string) => {
    if (newValue !== value) {
      onChange?.(newValue);
    }
  };

  const onKeyPress = (key: string) => {
    if (key === '{shift}' || key === '{lock}') {
      setLayoutName(layoutName === 'default' ? 'shift' : 'default');
    } else if (key !== '{bksp}') {
      setLayoutName(capsLock ? 'shift' : 'default');
    }
    if (key === '{lock}') {
      setCapsLock((oldValue) => !oldValue);
    }
  };

  const layout = {
    default: [
      '^ 1 2 3 4 5 6 7 8 9 0 \u00DF \u00B4 {bksp}',
      '{tab} q w e r t z u i o p \u00FC +',
      '{lock} a s d f g h j k l \u00F6 \u00E4 # {enter}',
      '{shift} < y x c v b n m , . - {shift}',
      '@ € {space} [ \u005c ]',
    ],
    shift: [
      '\u00B0 ! " \u00A7 $ % & / ( ) = ? ` {bksp}',
      '{tab} Q W E R T Z U I O P \u00DC *',
      "{lock} A S D F G H J K L \u00D6 \u00C4 ' {enter}",
      '{shift} > Y X C V B N M ; : _ {shift}',
      '@ ~ {space} { | }',
    ],
  };

  return (
    <>
      <input
        ref={inputRef}
        type={type ?? 'text'}
        placeholder={placeholder}
        className={className ?? 'input input-bordered'}
        onChange={onInputChange}
        onFocus={(event) => {
          if (needsOsk) {
            event.target.scrollIntoView();
            setShowKeyboard(true);
          }
        }}
        value={value}
      />
      {showKeyboard && keyboardContainer
        ? createPortal(
            <div className="h-[230px]">
              <div className="fixed bottom-0 h-[230px] w-[750px] max-w-full left-1/2 -translate-x-1/2 text-stone-800">
                <Keyboard
                  layout={layout}
                  layoutName={layoutName}
                  keyboardRef={(keyboard) => {
                    setKeyboard(keyboard);
                  }}
                  onChange={onKeyboardChange}
                  onKeyPress={onKeyPress}
                  mergeDisplay={true}
                  display={{
                    '{bksp}': '⌫',
                    '{enter}': '&nbsp;&nbsp;&nbsp;⏎&nbsp;&nbsp;&nbsp;',
                    '{tab}': '↹',
                    '{lock}': '⇩',
                    '{shift}': '⇧',
                  }}
                  buttonTheme={[
                    {
                      class: 'max-w-[50px]',
                      buttons: '~ € | \u005c { [ ] }',
                    },
                  ]}
                />
              </div>
            </div>,
            keyboardContainer,
          )
        : null}
    </>
  );
};

export default TextInput;
