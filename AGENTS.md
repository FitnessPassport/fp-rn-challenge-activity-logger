# This project

Expo SDK 57, React Native 0.86, React 19, TypeScript 6.

If you have network access, check the versioned docs at
https://docs.expo.dev/versions/v57.0.0/ rather than relying on training data. This
SDK has changed a lot. If you do not have network access, work from the installed
types in `node_modules` instead.

## Testing

`@testing-library/react-native` v14 is **async**. `render`, `fireEvent` and
`renderHook` all return promises and must be awaited:

```tsx
const { findByText } = await render(<App />);
await fireEvent.changeText(input, '30');
```

Without the `await`, a controlled `TextInput` never flushes its value, and the failure
surfaces as `Unable to find an element with text ...` rather than anything mentioning
`act()`. That symptom points at the component, not at the missing await, so it is easy
to spend a long time in the wrong place. `__tests__/App.test.tsx` shows the shape.

`jest.setup.js` mocks `expo-font`, because `useFonts` never resolves under Jest and the
app would render nothing at all.
