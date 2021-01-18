# teamwork-static

## Build Setup

```bash
# clone the project
git clone http://git.longhu.net/ap-teamwork-platform/frontend/web-teamwork-home-pc.git

# enter the project directory
cd web-teamwork-home-pc

# install dependency
npm install

# develop
npm run serve
```

This will automatically open http://localhost:8080

## Build

```bash
# build for test environment
npm run build:stage

# build for production environment
npm run build:prod
```

## Advanced

```bash
# preview the release environment effect
npm run preview

# preview the release environment effect + static resource analysis
npm run preview -- --report

# code format check
npm run lint

# code format check and auto fix
npm run lint -- --fix
```
### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).