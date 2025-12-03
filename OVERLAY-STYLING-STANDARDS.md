# Overlay Styling Standards

## Issue
Tailwind v4 doesn't support `bg-opacity-*` utility classes. Need to use inline styles for overlays.

## Standard Overlay Styles

### Modal/Dialog Backdrop
```jsx
style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
```
- **Use case**: Full-screen modal overlays (ImageModal, dialogs, lightboxes)
- **Opacity**: 85% (0.85)
- **Color**: Black

### Hover Overlay (on images/cards)
```jsx
style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
```
- **Use case**: Hover effects on images, cards
- **Opacity**: 40% (0.4)
- **Color**: Black

### Loading/Upload Overlay
```jsx
style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
```
- **Use case**: Loading spinners, upload progress
- **Opacity**: 50% (0.5)
- **Color**: Black

### Button Glass Effect
```jsx
style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
```
- **Use case**: Floating buttons on dark backgrounds
- **Opacity**: 15% (0.15)
- **Color**: White

## Components Fixed
- ✅ `src/components/chat/ImageModal.jsx` - Modal backdrop (85%)
- ✅ `src/components/chat/ChatMessage.jsx` - Hover overlay (40%), Upload overlay (50%)

## Components That Need Fixing
- ⚠️ `src/components/ui/confirm-modal.jsx` - Check if uses bg-opacity
- ⚠️ Other modal/dialog components
- ⚠️ Image galleries
- ⚠️ Dropdown overlays
- ⚠️ Any component using `bg-opacity-*` classes

## Complete Modal Example

### Full Modal Component (Working in Tailwind v4)
```jsx
import { X } from "lucide-react";
import { useEffect } from "react";

export default function Modal({ isOpen, onClose, children }) {
  // Close on ESC key
  useEffect(() => {
    if (!isOpen) return;
    
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-3 rounded-full transition-all text-white z-10 hover:scale-110"
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
        title="Close (ESC)"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Modal Content */}
      <div 
        className="relative bg-white rounded-lg shadow-2xl p-6 max-w-2xl w-full mx-4"
        style={{ animation: 'zoomIn 0.2s ease-out' }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes zoomIn {
          from { 
            opacity: 0;
            transform: scale(0.95);
          }
          to { 
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
```

### Usage Example
```jsx
import Modal from '@/components/ui/modal';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>
      
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <h2 className="text-xl font-bold mb-4">Modal Title</h2>
        <p>Modal content goes here...</p>
      </Modal>
    </>
  );
}
```

## How to Fix Existing Components

### Before (Tailwind v3 - doesn't work in v4):
```jsx
<div className="bg-black bg-opacity-90">
  <div className="bg-white bg-opacity-10 hover:bg-opacity-20">
    Button
  </div>
</div>
```

### After (Inline style - works in v4):
```jsx
<div style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}>
  <div 
    className="hover:scale-110 transition-all"
    style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
  >
    Button
  </div>
</div>
```

## Key Points for Modal Overlays

1. **Fixed positioning**: `className="fixed inset-0 z-50"`
2. **Inline background**: `style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}`
3. **Click outside to close**: `onClick={onClose}` on backdrop
4. **Stop propagation**: `onClick={(e) => e.stopPropagation()}` on content
5. **ESC key handler**: Add keyboard event listener
6. **Body scroll lock**: Set `document.body.style.overflow = 'hidden'`
7. **Animations**: Use `<style jsx>` with keyframes or inline styles
8. **Cleanup**: Remove event listeners and restore scroll in useEffect cleanup

## Search Pattern
To find components that need fixing, search for:
- `bg-opacity-`
- `bg-black bg-opacity`
- `bg-white bg-opacity`

## Notes
- Always use `rgba()` format for transparency
- Keep opacity values consistent across the app
- Test on both light and dark backgrounds
- Ensure text/icons are readable on overlays
