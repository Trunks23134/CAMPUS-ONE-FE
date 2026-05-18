# Professor Dashboard - Visual Guide

## Desktop Layout (≥768px)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  ┌──────────────┬──────────────────────────────────────────────────────┐   │
│  │              │ [Menu] Dashboard                    [User Profile]   │   │
│  │              ├──────────────────────────────────────────────────────┤   │
│  │              │                                                      │   │
│  │   SIDEBAR    │ Welcome back, Professor!                            │   │
│  │   (Fixed)    │ user@campus.edu                                     │   │
│  │              │                                                      │   │
│  │ ┌──────────┐ │ ┌──────────────┬──────────────┬──────────────┐     │   │
│  │ │Dashboard │ │ │   Classes    │   Students   │   Pending    │     │   │
│  │ │My Classes│ │ │      5       │     120      │      8       │     │   │
│  │ │          │ │ │ Classes this │ Across all   │ Awaiting     │     │   │
│  │ │──────────│ │ │ semester     │ your classes │ your review  │     │   │
│  │ │Students  │ │ └──────────────┴──────────────┴──────────────┘     │   │
│  │ │Grades    │ │                                                      │   │
│  │ │Announce. │ │ Quick Actions                                       │   │
│  │ │Schedule  │ │ ┌──────────────┬──────────────┬──────────────┐     │   │
│  │ │          │ │ │ 📚 Classes   │ ✓ Grades     │ 🔔 Announce  │     │   │
│  │ │──────────│ │ │ View & manage│ Input grades │ Notify       │     │   │
│  │ │Settings  │ │ └──────────────┴──────────────┴──────────────┘     │   │
│  │ │Help      │ │                                                      │   │
│  │ │          │ │ [Info Section - Professor Dashboard]                │   │
│  │ │──────────│ │                                                      │   │
│  │ │[User]    │ │                                                      │   │
│  │ │[Logout]  │ │                                                      │   │
│  │ └──────────┘ │                                                      │   │
│  │              │                                                      │   │
│  └──────────────┴──────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

SIDEBAR (Fixed Left)
├── Width: 256px (w-64)
├── Background: Dark gradient
├── Position: Fixed, always visible
├── Scrollable: Yes (overflow-y-auto)
└── Z-index: 40

MAIN CONTENT (Flexible)
├── Width: Remaining space
├── Background: Light gray
├── Scrollable: Yes
└── Z-index: 0

TOP NAVBAR
├── Height: 56px
├── Background: White
├── Border: Bottom gray
└── Z-index: 30
```

## Mobile Layout (<768px)

### Closed State
```
┌─────────────────────────────────────────┐
│ [Menu] Dashboard              [User]    │ ← Top Nav (56px)
├─────────────────────────────────────────┤
│                                         │
│ Welcome back, Professor!                │
│ user@campus.edu                         │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │   Classes   │   Students  │ Pending │ │
│ │      5      │     120     │    8    │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Quick Actions                           │
│ ┌─────────────────────────────────────┐ │
│ │ 📚 View Classes                     │ │
│ │ Manage your assigned subjects       │ │
│ └─────────────────────────────────────┘ │
│ ┌─────────────────────────────────────┐ │
│ │ ✓ Encode Grades                     │ │
│ │ Input and manage student grades     │ │
│ └─────────────────────────────────────┘ │
│ ┌─────────────────────────────────────┐ │
│ │ 🔔 Post Announcement                │ │
│ │ Notify your students                │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ [Info Section]                          │
│                                         │
└─────────────────────────────────────────┘
```

### Open State (Sidebar Visible)
```
┌─────────────────────────────────────────┐
│ ┌──────────┐ [Menu] Dashboard [User]    │
│ │ CAMPUS   │ ├─────────────────────────┤
│ │ Faculty  │ │                         │
│ │          │ │ Welcome back, Prof!     │
│ │ Dashboard│ │                         │
│ │ Classes  │ │ [Stats Cards]           │
│ │ Students │ │ [Quick Actions]         │
│ │ Grades   │ │ [Info Section]          │
│ │ Announce │ │                         │
│ │ Schedule │ │                         │
│ │ Settings │ │                         │
│ │ Help     │ │                         │
│ │ Logout   │ │                         │
│ │          │ │                         │
│ └──────────┘ │                         │
│ [Overlay]    │                         │
└─────────────────────────────────────────┘

SIDEBAR (Slide Drawer)
├── Width: 256px (w-64)
├── Position: Fixed, slides from left
├── Animation: translate-x-0 / -translate-x-full
├── Z-index: 40
└── Transition: 300ms ease-in-out

OVERLAY
├── Position: Fixed, full screen
├── Background: Black 50% opacity
├── Z-index: 30
└── Click to close
```

## Sidebar Structure

```
┌─────────────────────────────────────┐
│ LOGO SECTION (py-6, border-b)       │
│ ┌─────────────────────────────────┐ │
│ │ [Gold Icon] CAMPUS Faculty      │ │
│ │             Professor Portal    │ │
│ │ [X button on mobile]            │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ NAVIGATION (flex-1, overflow-y-auto)│
│                                     │
│ MAIN SECTION                        │
│ ┌─────────────────────────────────┐ │
│ │ [Icon] Dashboard                │ │
│ │ [Icon] My Classes               │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ─────────────────────────────────── │
│                                     │
│ MANAGEMENT SECTION                  │
│ ┌─────────────────────────────────┐ │
│ │ [Icon] Students                 │ │
│ │ [Icon] Encode Grades            │ │
│ │ [Icon] Announcements            │ │
│ │ [Icon] Schedule                 │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ─────────────────────────────────── │
│                                     │
│ SETTINGS SECTION                    │
│ ┌─────────────────────────────────┐ │
│ │ [Icon] Settings                 │ │
│ │ [Icon] Help & Support           │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ USER SECTION (border-t, py-4)       │
│ ┌─────────────────────────────────┐ │
│ │ Logged in as                    │ │
│ │ user@campus.edu                 │ │
│ │ ─────────────────────────────── │ │
│ │ [Icon] Log Out                  │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

## Navigation Button States

### Default State
```
┌─────────────────────────────────────┐
│ [Icon] Menu Item                    │
│ text-gray-300 hover:bg-gray-800     │
└─────────────────────────────────────┘
```

### Hover State
```
┌─────────────────────────────────────┐
│ [Icon] Menu Item                    │
│ text-white bg-gray-800              │
└─────────────────────────────────────┘
```

### Active State
```
┌─────────────────────────────────────┐
│ [Icon] Menu Item                    │
│ bg-[#F59E0B] text-white             │
│ shadow-lg shadow-[#F59E0B]/20       │
└─────────────────────────────────────┘
```

## Stats Cards

### Card Structure
```
┌──────────────────────────────────────┐
│ [Icon Badge]  [Status Badge]         │
│                                      │
│ Total Classes                        │
│ 5                                    │
│ Classes assigned this semester       │
└──────────────────────────────────────┘

ICON BADGE
├── Size: 48px (w-12 h-12)
├── Background: Color/10 (e.g., #F59E0B/10)
├── Icon: 24px (w-6 h-6)
└── Color: Primary color

STATUS BADGE
├── Size: Small
├── Background: Color/10
├── Text: Color/600
├── Padding: px-3 py-1
└── Rounded: Full

TITLE
├── Color: Gray-600
├── Size: Small (text-sm)
└── Margin: mb-1

VALUE
├── Color: Gray-900
├── Size: 4xl (text-4xl)
├── Weight: Bold
└── Margin: mb-0

SUBTITLE
├── Color: Gray-500
├── Size: xs (text-xs)
└── Margin: mt-3
```

## Quick Actions Grid

### Desktop (3 columns)
```
┌──────────────┬──────────────┬──────────────┐
│ [Icon]       │ [Icon]       │ [Icon]       │
│ View Classes │ Encode Grades│ Announcement │
│ Manage...    │ Input...     │ Notify...    │
└──────────────┴──────────────┴──────────────┘
```

### Mobile (1 column)
```
┌──────────────────────────────┐
│ [Icon]                       │
│ View Classes                 │
│ Manage your assigned...      │
└──────────────────────────────┘
┌──────────────────────────────┐
│ [Icon]                       │
│ Encode Grades                │
│ Input and manage...          │
└──────────────────────────────┘
┌──────────────────────────────┐
│ [Icon]                       │
│ Post Announcement            │
│ Notify your students         │
└──────────────────────────────┘
```

### Tablet (2 columns)
```
┌──────────────┬──────────────┐
│ [Icon]       │ [Icon]       │
│ View Classes │ Encode Grades│
│ Manage...    │ Input...     │
└──────────────┴──────────────┘
┌──────────────┬──────────────┐
│ [Icon]       │              │
│ Announcement │              │
│ Notify...    │              │
└──────────────┴──────────────┘
```

## Color Palette

### Sidebar
```
Background:
┌─────────────────────────────┐
│ #1a1a1a (top)               │
│ ↓ gradient ↓                │
│ #0f0f0f (bottom)            │
└─────────────────────────────┘

Text:
├── Primary: #ffffff (white)
├── Secondary: #d1d5db (gray-300)
├── Hover: #ffffff (white)
└── Disabled: #9ca3af (gray-400)

Borders:
├── Dividers: #374151 (gray-700)
└── Hover: #4b5563 (gray-600)
```

### Content Area
```
Background:
├── Page: #f9fafb (gray-50)
└── Cards: #ffffff (white)

Text:
├── Headings: #111827 (gray-900)
├── Body: #374151 (gray-700)
├── Secondary: #6b7280 (gray-500)
└── Disabled: #9ca3af (gray-400)

Borders:
├── Cards: #e5e7eb (gray-200)
├── Hover: #d1d5db (gray-300)
└── Focus: #f59e0b (gold)
```

### Accents
```
Primary (Gold):
├── Color: #F59E0B
├── Light: #F59E0B/10 (background)
├── Medium: #F59E0B/20 (hover)
└── Dark: #F59E0B (active)

Secondary (Blue):
├── Color: #2563eb
├── Light: #dbeafe (background)
└── Dark: #1e40af (hover)

Tertiary (Red):
├── Color: #dc2626
├── Light: #fee2e2 (background)
└── Dark: #991b1b (hover)
```

## Spacing System

```
Sidebar:
├── Padding: px-6 py-6 (24px)
├── Gap: space-y-2 (8px)
├── Divider: my-4 (16px)
└── Item: px-4 py-3 (16px, 12px)

Content:
├── Padding: p-6 md:p-8 (24px, 32px)
├── Gap: gap-6 (24px)
├── Card: p-6 (24px)
└── Item: p-5 (20px)

Cards:
├── Padding: p-6 (24px)
├── Gap: gap-4 (16px)
├── Border: 1px
└── Rounded: rounded-xl (12px)

Buttons:
├── Padding: px-4 py-3 (16px, 12px)
├── Rounded: rounded-lg (8px)
└── Gap: gap-3 (12px)
```

## Typography

```
Headings:
├── Page Title: text-3xl font-bold
├── Section: text-lg font-bold
├── Card Title: text-sm font-bold
└── Label: text-xs font-semibold

Body:
├── Primary: text-sm font-medium
├── Secondary: text-xs font-medium
├── Tertiary: text-xs font-normal
└── Disabled: text-xs font-normal

Numbers:
├── Large: text-4xl font-bold
├── Medium: text-2xl font-bold
└── Small: text-lg font-bold
```

## Shadows & Effects

```
Cards:
├── Default: border border-gray-200
├── Hover: hover:shadow-lg
└── Active: shadow-lg shadow-[#F59E0B]/20

Buttons:
├── Default: no shadow
├── Hover: hover:shadow-md
└── Active: shadow-lg shadow-[#F59E0B]/20

Transitions:
├── Duration: 200ms / 300ms
├── Timing: ease-in-out
└── Properties: all / colors / transform
```

## Responsive Breakpoints

```
Mobile:     < 768px  (md)
Tablet:     768px - 1024px
Desktop:    > 1024px

Sidebar:
├── Mobile:  -translate-x-full (hidden)
├── Tablet:  translate-x-0 (visible)
└── Desktop: translate-x-0 (visible)

Grid:
├── Mobile:  grid-cols-1
├── Tablet:  md:grid-cols-2
└── Desktop: md:grid-cols-3

Padding:
├── Mobile:  p-6
├── Tablet:  p-6
└── Desktop: p-8
```

---

**Visual Guide Version:** 1.0
**Last Updated:** May 15, 2026
**Status:** ✅ Complete
