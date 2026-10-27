# Social App — Route Posts Assignment

React + TypeScript + Vite + Tailwind CSS project.

## Run on Windows / VS Code

1. Extract this project folder.
2. Open the `Social` folder in VS Code.
3. Open Terminal and run:
   ```bash
   npm install
   npm run dev
   ```
4. Open the local URL Vite prints in the terminal.

## Features in this version

- Register and login pages.
- Auth token stored in `localStorage`; protected routes redirect to login.
- Home feed and create post with optional image.
- Post details with comments and add comment with optional image.
- Edit/delete post actions.
- Edit/delete comment actions.
- Profile page with user's posts.
- Change password page linked from the navigation bar.
- React Query invalidation after create/update/delete actions and toast feedback.

## API

Base URL: `https://route-posts.routemisr.com`

All protected requests use `Authorization: Bearer <token>`.

Note: API permissions and accepted payload fields are controlled by the Route Posts backend. If an action returns an API error, the UI displays the backend message when available. The public endpoint overview documents post update but does not explicitly list a post-delete endpoint, so verify that action against the instructor's Postman collection.
