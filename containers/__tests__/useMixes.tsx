import { renderHook } from '@testing-library/react-hooks/dom';
import useMixes from '../useMixes';

describe('useMixes', () => {
  test('should set mix list', () => {
    const { result } = renderHook(() =>
      useMixes(
        'MIXES:[{"id":"bus01","name":"BUS01","color":"red","level":0,"mute":true},{"id":"bus03","name":"BUS 3","color":"green","level":10,"mute":false}]',
      ),
    );
    expect(result.current).toEqual([
      { id: 'bus01', name: 'BUS01', color: 'red', level: 0, mute: true },
      { id: 'bus03', name: 'BUS 3', color: 'green', level: 10, mute: false },
    ]);
  });

  test('should filter invalid mixes', () => {
    const { result } = renderHook(() =>
      useMixes(
        'MIXES:[{"id":"bus01","name":"BUS01","color":"red","level":0,"mute":true},{"id":2,"name":"BUS 3","color":"green","level":10,"mute":false}]',
      ),
    );
    expect(result.current).toEqual([
      { id: 'bus01', name: 'BUS01', color: 'red', level: 0, mute: true },
    ]);
  });

  test('should update mix list', () => {
    let message: unknown =
      'MIXES:[{"id":"bus01","name":"BUS01","color":"red","level":0,"mute":true}]';
    const { result, rerender } = renderHook(() => useMixes(message));
    expect(result.current).toEqual([
      { id: 'bus01', name: 'BUS01', color: 'red', level: 0, mute: true },
    ]);
    message =
      'MIXES:[{"id":"bus03","name":"BUS 3","color":"green","level":10,"mute":false}]';
    rerender();
    expect(result.current).toEqual([
      { id: 'bus03', name: 'BUS 3', color: 'green', level: 10, mute: false },
    ]);
  });

  test('should ignore null messages', () => {
    let message: unknown =
      'MIXES:[{"id":"bus01","name":"BUS01","color":"red","level":0,"mute":true}]';
    const { result, rerender } = renderHook(() => useMixes(message));
    expect(result.current).toEqual([
      { id: 'bus01', name: 'BUS01', color: 'red', level: 0, mute: true },
    ]);
    message = null;
    rerender();
    expect(result.current).toEqual([
      { id: 'bus01', name: 'BUS01', color: 'red', level: 0, mute: true },
    ]);
  });

  test('should ignore messages of wrong type', () => {
    let message: unknown =
      'MIXES:[{"id":"bus01","name":"BUS01","color":"red","level":0,"mute":true}]';
    const { result, rerender } = renderHook(() => useMixes(message));
    expect(result.current).toEqual([
      { id: 'bus01', name: 'BUS01', color: 'red', level: 0, mute: true },
    ]);
    message = 42;
    rerender();
    expect(result.current).toEqual([
      { id: 'bus01', name: 'BUS01', color: 'red', level: 0, mute: true },
    ]);
  });

  test('should ignore messages without an API code', () => {
    let message =
      'MIXES:[{"id":"bus01","name":"BUS01","color":"red","level":0,"mute":true}]';
    const { result, rerender } = renderHook(() => useMixes(message));
    expect(result.current).toEqual([
      { id: 'bus01', name: 'BUS01', color: 'red', level: 0, mute: true },
    ]);
    message = '{}';
    rerender();
    expect(result.current).toEqual([
      { id: 'bus01', name: 'BUS01', color: 'red', level: 0, mute: true },
    ]);
  });

  test('should ignore messages with a wrong API code', () => {
    let message =
      'MIXES:[{"id":"bus01","name":"BUS01","color":"red","level":0,"mute":true}]';
    const { result, rerender } = renderHook(() => useMixes(message));
    expect(result.current).toEqual([
      { id: 'bus01', name: 'BUS01', color: 'red', level: 0, mute: true },
    ]);
    message = 'AUTH:[]';
    rerender();
    expect(result.current).toEqual([
      { id: 'bus01', name: 'BUS01', color: 'red', level: 0, mute: true },
    ]);
  });

  test('should ignore messages with invalid JSON data', () => {
    let message =
      'MIXES:[{"id":"bus01","name":"BUS01","color":"red","level":0,"mute":true}]';
    const { result, rerender } = renderHook(() => useMixes(message));
    expect(result.current).toEqual([
      { id: 'bus01', name: 'BUS01', color: 'red', level: 0, mute: true },
    ]);
    message = 'MIXES:foobar';
    rerender();
    expect(result.current).toEqual([
      { id: 'bus01', name: 'BUS01', color: 'red', level: 0, mute: true },
    ]);
  });

  test('should ignore messages with wrong JSON data', () => {
    let message =
      'MIXES:[{"id":"bus01","name":"BUS01","color":"red","level":0,"mute":true}]';
    const { result, rerender } = renderHook(() => useMixes(message));
    expect(result.current).toEqual([
      { id: 'bus01', name: 'BUS01', color: 'red', level: 0, mute: true },
    ]);
    message = 'MIXES:{}';
    rerender();
    expect(result.current).toEqual([
      { id: 'bus01', name: 'BUS01', color: 'red', level: 0, mute: true },
    ]);
  });

  test('should set empty mix list', () => {
    let message =
      'MIXES:[{"id":"bus01","name":"BUS01","color":"red","level":0,"mute":true}]';
    const { result, rerender } = renderHook(() => useMixes(message));
    expect(result.current).toEqual([
      { id: 'bus01', name: 'BUS01', color: 'red', level: 0, mute: true },
    ]);
    message = 'MIXES:[]';
    rerender();
    expect(result.current).toEqual([]);
  });
});
