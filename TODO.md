# TODO - History API integration (Asset Assignment Records)

## Step 1: Inspect & prepare mapping
- [x] Update `AssetHistoryModal.vue` to render API-mapped timeline items from AssignmentRecord-derived props.
- [x] Add mapper logic inside `HistoryView.vue` converting `assignment_id/assign_date/status/return_date/is_active/assigned_by` into UI fields.


## Step 2: Integrate API fetch on modal open
- [x] Update `src/views/HistoryView.vue`:
  - [x] Call `getAssignmentHistory(assetId)` when opening the modal.
  - [x] Add loading state.
  - [x] Add error state (message + safe fallbacks).
  - [x] Add AbortController/request cancellation to avoid race conditions.


## Step 3: Replace mock modal history usage
- [ ] Remove dependency on `asset.history` mock data.

## Step 4: Build & quick verification
- [ ] Run `npm run build` (or dev server) and manually verify:
  - [ ] Asset history loads
  - [ ] Network error / timeout handled
  - [ ] Rapid switching does not show stale data
  - [ ] Empty history handled gracefully

