# Storj
A node wrapper for uplink which adds missing feature for recursive uploading a folder

# Installation
```
yarn global add @dcrystalj/storj
```

# Usage
Just replace uplink with storj
```
storj cp ./ sj://your-bucket/here/
```

by default it will upload only missing files. To skip this check use `--forceReplace` flag

# Todo
[] Add
[] migrate to typescript
