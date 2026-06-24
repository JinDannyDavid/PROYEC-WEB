import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as typeof global.TextDecoder;

const noop = () => {};
const mockEventTarget = {
  addEventListener: noop,
  removeEventListener: noop,
  dispatchEvent: noop,
};

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    ...mockEventTarget,
  }),
});

const storageMock = {
  getItem: noop,
  setItem: noop,
  removeItem: noop,
  clear: noop,
};

Object.defineProperty(window, 'localStorage', {
  writable: true,
  value: storageMock,
});

jest.mock('next/router', () => ({
  useRouter: () => ({
    push: noop,
    replace: noop,
    prefetch: noop,
    back: noop,
    beforePopState: noop,
    events: {
      on: noop,
      off: noop,
      emit: noop,
    },
  }),
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: noop,
    replace: noop,
    prefetch: noop,
    back: noop,
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

console.error = (...args: unknown[]) => {
  const message = args.join(' ');
  if (
    message.includes('Warning: ReactDOM.render is no longer supported') ||
    message.includes('act(...)') ||
    message.includes('Network error') || // Expected in error handling tests
    message.includes('Error fetching user') || // Expected in auth tests
    message.includes('Error obteniendo') // Expected in service tests
  ) {
    return;
  }
  throw new Error(message);
};