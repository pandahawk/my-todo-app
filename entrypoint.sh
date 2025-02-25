#!/bin/bash

# Run migrations
npx typeorm-ts-node-commonjs migration:run -d data-source.ts

# Run the app
npm run start:prod