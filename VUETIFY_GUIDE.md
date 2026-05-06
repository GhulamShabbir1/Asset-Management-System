# Vuetify Setup Guide

Your project is now configured with **Vuetify 4** with a custom color scheme!

## Color Scheme Overview

Your custom color scheme includes:

### Primary Colors
- **Primary**: `#000000` (Black) - Main brand color
- **Primary Container**: `#131b2e` - Container backgrounds
- **On Primary**: `#ffffff` (White) - Text on primary backgrounds

### Secondary Colors
- **Secondary**: `#505f76` (Blue-gray)
- **Secondary Container**: `#d0e1fb` - Light blue container
- **On Secondary**: `#ffffff` (White)

### Tertiary Colors
- **Tertiary**: `#000000` (Black) - For accents
- **Tertiary Container**: `#002109` - Dark green
- **On Tertiary**: `#ffffff` (White)

### Surface Colors
- **Surface**: `#f7f9fb` - Main background
- **Surface Container**: `#eceef0` - Elevated surfaces
- **Inverse Surface**: `#2d3133` - Dark surfaces for light text
- **Surface Variant**: `#e0e3e5` - Slightly darker surface

### States
- **Error**: `#ba1a1a` (Red) - Error states
- **Success**: Derived from tertiary (Green)
- **Warning**: Orange tones
- **Info**: Blue tones

## File Structure

```
src/
├── plugins/
│   └── vuetify.ts           # Vuetify configuration with theme
├── views/
│   ├── Login.vue            # Login page with Vuetify card
│   ├── Home.vue             # Dashboard with stat cards
│   ├── Assets.vue           # Asset list with table
│   ├── AssetDetail.vue      # Asset detail with breadcrumbs
│   └── NotFound.vue         # 404 error page
└── App.vue                  # Root component with v-app
```

## Vuetify Components Used

### Layout Components
- **`v-app`** - Root application wrapper
- **`v-app-bar`** - Top navigation bar
- **`v-app-bar-nav-icon`** - Menu toggle button
- **`v-navigation-drawer`** - Side navigation menu
- **`v-main`** - Main content area
- **`v-container`** - Responsive container
- **`v-row`** / **`v-col`** - Grid system

### Card Components
- **`v-card`** - Card container
- **`v-card-title`** - Card heading
- **`v-card-text`** - Card content
- **`v-card-actions`** - Card action buttons

### Form Components
- **`v-text-field`** - Text input with label and icon
- **`v-form`** - Form wrapper

### Interactive Components
- **`v-btn`** - Button with ripple effect
- **`v-menu`** - Dropdown menu
- **`v-list`** / **`v-list-item`** - List items
- **`v-chip`** - Status/badge chips
- **`v-table`** - Data table
- **`v-progress-circular`** - Loading spinner

### Feedback Components
- **`v-alert`** - Alert/notification messages
- **`v-divider`** - Visual separator

### Utility Components
- **`v-icon`** - MDI icon display
- **`v-spacer`** - Flexible spacer
- **`v-breadcrumbs`** - Navigation breadcrumbs

## Using Vuetify Components

### Basic Button
```vue
<v-btn color="primary" @click="handleClick">
  Click Me
</v-btn>
```

### Text Input
```vue
<v-text-field
  v-model="email"
  label="Email"
  prepend-icon="mdi-email"
  type="email"
  required
></v-text-field>
```

### Card
```vue
<v-card>
  <v-card-title>Title</v-card-title>
  <v-card-text>Content here</v-card-text>
  <v-card-actions>
    <v-btn>Action</v-btn>
  </v-card-actions>
</v-card>
```

### Alert
```vue
<v-alert type="error" variant="tonal">
  Error message
</v-alert>
```

### Table
```vue
<v-table>
  <thead>
    <tr>
      <th>Header 1</th>
      <th>Header 2</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="item in items" :key="item.id">
      <td>{{ item.name }}</td>
      <td>{{ item.value }}</td>
    </tr>
  </tbody>
</v-table>
```

### Status Chip
```vue
<v-chip
  :color="item.status === 'active' ? 'success' : 'error'"
  label
>
  {{ item.status }}
</v-chip>
```

## Color Classes

You can use color classes throughout your components:

```vue
<!-- Background colors -->
<div class="bg-primary">Primary background</div>
<div class="bg-secondary">Secondary background</div>
<div class="bg-surface">Surface background</div>

<!-- Text colors -->
<div class="text-primary">Primary text</div>
<div class="text-on-surface">Text on surface</div>
<div class="text-error">Error text</div>

<!-- Other utilities -->
<div class="elevation-12">High elevation shadow</div>
<div class="rounded">Rounded corners</div>
<div class="pa-4">Padding all sides</div>
<div class="my-4">Margin Y-axis</div>
```

## Vuetify Icons (MDI)

All Material Design Icons are available with the `mdi-` prefix:

```vue
<!-- Navigation icons -->
<v-icon>mdi-home</v-icon>
<v-icon>mdi-folder-open</v-icon>
<v-icon>mdi-account-circle</v-icon>

<!-- Action icons -->
<v-icon>mdi-plus</v-icon>
<v-icon>mdi-pencil</v-icon>
<v-icon>mdi-delete</v-icon>
<v-icon>mdi-download</v-icon>

<!-- Status icons -->
<v-icon>mdi-check-circle</v-icon>
<v-icon>mdi-alert-circle</v-icon>
<v-icon>mdi-alert-octagon</v-icon>
<v-icon>mdi-package-variant</v-icon>

<!-- Search for more icons at: https://materialdesignicons.com/ -->
```

## Grid System

Vuetify uses a 12-column grid system:

```vue
<v-row>
  <!-- Full width on mobile, half on tablet, quarter on desktop -->
  <v-col cols="12" sm="6" md="3">
    Content
  </v-col>
</v-row>
```

Breakpoints:
- `xs` (Extra small): < 600px
- `sm` (Small): 600px - 960px
- `md` (Medium): 960px - 1264px
- `lg` (Large): 1264px - 1904px
- `xl` (Extra large): 1904px+

## Spacing Classes

```vue
<!-- Padding: p{direction}-{size} -->
<div class="pa-4">Padding all sides (16px)</div>
<div class="px-4">Padding horizontal</div>
<div class="py-2">Padding vertical</div>

<!-- Margin: m{direction}-{size} -->
<div class="ma-4">Margin all sides</div>
<div class="mx-auto">Margin horizontal auto (center)</div>
<div class="my-6">Margin vertical</div>

<!-- Size scale: 1=4px, 2=8px, 4=16px, 6=24px, 8=32px -->
```

## Flex Utilities

```vue
<!-- Flexbox utilities -->
<div class="d-flex">Display flex</div>
<div class="d-flex justify-center">Center horizontally</div>
<div class="d-flex align-center">Center vertically</div>
<div class="d-flex justify-space-between">Space between</div>
<v-spacer></v-spacer><!-- Flexible spacer in flex -->
```

## Text Utilities

```vue
<!-- Typography -->
<h1 class="text-h1">Heading 1</h1>
<h4 class="text-h4">Heading 4</h4>
<p class="text-body1">Body text</p>
<p class="text-body2">Small body text</p>
<p class="text-overline">Overline text</p>
<p class="text-caption">Caption text</p>

<!-- Text styling -->
<div class="font-weight-bold">Bold text</div>
<div class="text-center">Centered text</div>
<div class="text-medium-emphasis">Medium emphasis</div>
<div class="text-disabled">Disabled text</div>
```

## Theme Customization

To customize the theme further, edit `src/plugins/vuetify.ts`:

```typescript
const lightTheme = {
  colors: {
    primary: '#yourcolor',
    // ... more colors
  },
}

const vuetify = createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: lightTheme.colors,
      },
    },
  },
})
```

## Dark Mode

To add dark mode support:

1. Add dark theme to `src/plugins/vuetify.ts`:
```typescript
const darkTheme = {
  colors: {
    // Dark mode colors
    primary: '#ffffff',
    surface: '#121212',
    // ...
  },
}

const vuetify = createVuetify({
  theme: {
    themes: {
      light: { /* ... */ },
      dark: {
        dark: true,
        colors: darkTheme.colors,
      },
    },
  },
})
```

2. Toggle theme in your component:
```typescript
import { useTheme } from 'vuetify'

const theme = useTheme()
theme.global.name.value = 'dark' // or 'light'
```

## Development

Start the development server:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

## Resources

- [Vuetify Documentation](https://vuetifyjs.com/)
- [Material Design Icons](https://materialdesignicons.com/)
- [Vuetify Components](https://vuetifyjs.com/en/components/)
- [Color System](https://vuetifyjs.com/en/features/theme/)

## Next Steps

1. ✅ Vuetify is installed and configured
2. ✅ Custom color scheme is applied
3. ✅ All views are styled with Vuetify components
4. Next: Create reusable component library
5. Next: Add more complex forms and dialogs
6. Next: Implement real API integration

---

Your project is ready to use Vuetify! Start building beautiful UIs with these components. 🎨
