---
sidebar_position: 2
---
# 工程化(基于vitejs)

[webpack]: https://webpack.docschina.org/ 	"webpack"
[create-react-app]: https://create-react-app.dev/ "create-react-app"

[umi]: 	https://umijs.org/zh-CN/docs "umi"

[node.js]: https://nodejs.org/zh-cn/ "node.js"
[pnpm]: https://pnpm.io/ "pnpm"
[npm]: https://www.npmjs.com/	"npm"
[n]:  https://github.com/tj/n		"n"
[brew]: https://brew.sh/ "brew"
[nvm]: https://github.com/nvm-sh/nvm	"nvm"
[prettier]: https://prettier.io/ "prettier"
[airbnb]: https://github.com/airbnb/javascript "airbnb"
[vscode]: https://code.visualstudio.com/ "vscode"
[vitejs]: https://cn.vitejs.dev/ "vitejs"
[antd]: https://ant-design.gitee.io/index-cn "antd"
[less]: https://lesscss.org/ "less"
[tailwindcss]: https://tailwindcss.com/	"tailwindcss"
[eslint]: https://eslint.org/ "eslint"
[vscode-eslint]: https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint "vscode-eslint"
[vscode-prettier]: https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode "vscode-prettier"

## 创建项目

如果比较熟悉[webpack][]也可以使用[create-react-app][],[umi][]或自己手动写一个,为了有更加流畅的开发体验,本教程选择基于[esbuild][]的更加快速的[vite][]来构建开发环境

### 安装与配置[node.js][]

> 如果没有安装[brew][]请先安装

**建议:安装到GLOBAL里面的东西统一使用一个包管理器,我这里使用[pnpm][]**

安装[node.js][]

```shell
~ brew install node
```

配置[npm][]淘宝镜像

```shell
~ npm config set registry https://registry.npm.taobao.org
```

安装[pnpm][]

```shell
~ npm install -g pnpm
```

配置[pnpm][]淘宝镜像

```shell
~ pnpm config set registry https://registry.npm.taobao.org
```

安装镜像管理工具

```shell
~ pnpm add nrm -g
```

建议安装一个[node][node.js]版本管理工具比如[n][]或者[nvm][]

```shell
~ pnpm add n -g
```

#### 使用[Vite][]创建项目

在你的编码目录下初始化一个项目

```shell
~ pnpx create-vite
```

提示`Install the following package: create-vite@latest?`,按`y`

`Project name:`是你的项目目录和`package.json`中的项目名称,随意填

`Select a framework`框架选择中按方向键选择`react`

` Select a variant`选择`react-ts`

`cd {你的Project name目录}`

执行`pnpm i`安装依赖

## 代码规范化

具体代码与配置请自行查看源代码

### 代码风格

配置[airbnb][]的eslint规则并整合[prettier][],并且经过一定的客制化同时配合vscode可达到完美的编码体验

```shell
pnpm add typescript \
eslint \
prettier \
@typescript-eslint/parser \
eslint-config-airbnb-typescript \
eslint-plugin-import \
eslint-plugin-jsx-a11y \
eslint-plugin-react \
eslint-plugin-react-hooks \
@typescript-eslint/eslint-plugin \
jest \
eslint-plugin-jest \
eslint-config-prettier \
eslint-plugin-prettier \
eslint-plugin-unused-imports -D
```

#### 配置内容

为了让`eslint`能规范化自定义的文件,比如`.eslintrc.js`本身,使用一个新建的继承自`tsconfig.json`的`tsconfig.eslint.json`作为`@typescript-eslint/parser`的配置文件

```javascript
...
plugins: ['@typescript-eslint', 'jest', 'prettier', 'import', 'unused-imports'],
extends: [
    // 兼容typescript的airbnb规范
   'airbnb-typescript',
    // react hooks的airbnb规范
    'airbnb/hooks',

    // typescript的eslint插件
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',

    // 支持jest
    'plugin:jest/recommended',

    // 使用prettier格式化代码
    // 整合typescript-eslint与prettier
    'prettier',
    'plugin:prettier/recommended',
],
parserOptions: {
    ...
    project: './tsconfig.eslint.json',
},
```

#### 一些重要的规则

> 其余配置自行查看代码

`eslint-plugin-unused-imports`用于自动删除未使用的导入,对不是'_'前缀且未使用变量报错

```javascript
...
 'no-unused-vars': 0,
 '@typescript-eslint/no-unused-vars': 0,
 'unused-imports/no-unused-imports': 1,
 'unused-imports/no-unused-vars': [
    'error',
    {
        vars: 'all',
        args: 'none',
        ignoreRestSiblings: true,
    },
]
```

`import`插件,`import/order`可以按照自己的需求配置

```javascript
// 导入模块的顺序
'import/order': [
     'error',
     {
         pathGroups: [
             {
                 pattern: '@/**',
                 group: 'external',
                 position: 'after',
             },
         ],
         alphabetize: { order: 'asc', caseInsensitive: false },
         'newlines-between': 'always-and-inside-groups',
         warnOnUnassignedImports: true,
     },
],
// 导入的依赖不必一定要在dependencies的文件
'import/no-extraneous-dependencies': [
    'error',
     {
         devDependencies: [
             '**/*.test.{ts,js}',
             '**/*.spec.{ts,js}',
             'build/**/*.{ts,js}',
             'vite.config.ts',
         ],
     },
],
```

最后需要配置一下`.prettierrc`,和`.editorconfig`,并且把一些它们各自需要忽略的目录和文件分别添加到`.eslintignore`和`.prettierignore`,最后把`git`仓库需要忽略的目录和文件写入`.gitignore`

### Tsconfig配置

tsconfig.json文件中添加一个`@`作为根目录映射符,其它的配置按需要更改

```json
{
    "compilerOptions": {
        // ...
        "paths": {
            "@/*": ["src/*"]
        }
    },
    "include": [
        "./src",
        "./typings/**/*.d.ts",
    ]
}
```

`tsconfig.eslint.json`

```json
{
    "extends": "./tsconfig.json",
    "include": ["./src", "./test", "./typings", "./build", "**.js", "**.ts"]
}
```

## 配置[vitejs][]

### 基础配置

安装`deepmerge`用于合并配置对象

```shell
~ pnpm add deepmerge -D
```

创建一个`build`目录专门用于放置[vitejs][]的配置文件

`Configure`类型是外部`vite.config.ts`文件中自定义额外配置的回调函数的类型

```typescript
// build/types.ts
export type Configure = (params: ConfigEnv, isBuild: boolean) => UserConfig;
```

`getPlugins`函数用于设置插件

```typescript
// build/plugins/index.ts
export function getPlugins(isBuild: boolean) {
    const vitePlugins: (Plugin | Plugin[])[] = [reactRefresh()];

    return vitePlugins;
}
```

`getConfig`函数用于生成最终配置

```typescript
// build/config.ts
export const getConfig = (
    params: ConfigEnv,
    configure?: Configure,
): UserConfig => {
    const isBuild = params.command === 'build';
    return merge(
        {
            resolve: {
                // 添加别名
                alias: {
                    '/@': pathResolve('src'),
                },
            },
            css: {},
            plugins: getPlugins(isBuild),
            // 启动端口
            server: { port: 4000 },
        },
        typeof configure === 'function' ? configure(params, isBuild) : {},
        {
            arrayMerge: (_d, s, _o) => Array.from(new Set([..._d, ...s])),
        },
    );
};

```

使用配置

```typescript
// vite.config.ts
export default (params: ConfigEnv): UserConfig => getConfig(params);
```

### 支持`react17`风格

如果需要支持`react17`风格(即不需要在每个页面写`import React from 'react'`)的话

> 一般情况下不需要

先把`tsconfg.json`中的`"jsx": "react"`改为`"jsx": "react-jsx"`,然后添加如下配置

```typescript
// build/config.ts
export const getConfig = (
    params: ConfigEnv,
    configure?: Configure,
): UserConfig => {
    const isBuild = params.command === 'build';
    return merge(
        {
            ...
            esbuild: {
                jsxInject: `import React from 'react'`,
            },
        },
      ...
    );
};
```

### 支持[antd][]与[less][]

安装[less][]与[antd][]

```shell
~ pnpm add antd
~ pnpm add less -D
```

定制主题

> `modules`配置用于转换`css`变量名称格式

```typescript
// build/config.ts
return merge(
  {
    ...
    css: {
        modules: {
            localsConvention: 'camelCaseOnly',
        },
        preprocessorOptions: {
            less: {
                javascriptEnabled: true,
                javascriptEnabled: true,
                modifyVars: {},
            },
        },
    },
  }
)
```

按需导入

安装`vite-plugin-style-import`

```shell
~ pnpm add vite-plugin-style-import -D
```

配置插件

```typescript
// build/plugins/antd.ts
export function antdPlugin(isBuild: boolean) {
    if (!isBuild) return [];
    const antd = styleImport({
        libs: [
            {
                libraryName: 'antd',
                esModule: true,
                resolveStyle: (name) => {
                    return `antd/es/${name}/style/index`;
                },
            },
        ],
    });
    return antd;
}
```

加载该插件

```typescript
// build/plugins/index.ts
export function getPlugins(isBuild: boolean) {
    const vitePlugins: (Plugin | Plugin[])[] = [];
    vitePlugins.push(reactRefresh());
    vitePlugins.push(antdPlugin(isBuild));
    return vitePlugins;
}
```

效果测试

```typescript
// src/App.tsx
const App: FC = () => (
    <div className="App">
        <Button type="primary">Button</Button>
    </div>
);
```

在`main.tsx`如下设置,这是为了在开发环境中使用[antd][]样式

```typescript
// src/main.tsx
if (import.meta.env.DEV) {
    import('antd/dist/antd.less');
}
```

因为只在生产环境按需加载,所以执行以下命令在生产环境下测试

```shell
~ pnpm build && pnpm serve
```

### 支持[tailwindcss][]

> `postcss`可以按自己需求配置,或者不配置也没关系

安装[tailwincss][]与vite插件

```shell
~ pnpm add tailwindcss@latest postcss@latest autoprefixer@latest -D
```

初始化[tailwindcss][]

```typescript
npx tailwindcss init -p
```

配置[tailwindcss][]

```javascript
module.exports = {
    // 在生产环境中清除未使用的样式
    purge: {
        enable: process.env.NODE_ENV === 'production',
        content: ['./index.html', './src/**/*.{ts,tsx}'],
    },
    darkMode: 'class',
    theme: {
        extend: {},
    },
    variants: {
        extend: {},
    },
    plugins: [],
};
```

## 开发工具

推荐使用[vscode][]作为开发工具

> VSCode已经自带同步配置和插件的功能,建议启用

### [vscode][]

安装[vscode][]

```shell
~ brew install vscode
```

安装[eslint插件][vscode-eslint]和[prettier插件][vscode-prettier]

```shell
~ code --install-extension dbaeumer.vscode-eslint \
  && code esbenp.prettier-vscode
```

按`cmd+,`选择偏好设置->工作空间,配置[eslint插件][vscode-eslint]

```json
{
    "editor.formatOnSave": false,
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true
    }
}

```

为了确保[pnpm][]安装的package可以拥有像npm,yarn一样的本地目录的提示效果,请在vscode底部选择工作区版本或者安装[nighty](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-next)插件并选择vscode版本

### 调试

按`shift+cmd+d`创建`lanunch.json`,按如下配置即可通过浏览器调试

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome",
      "url": "http://localhost:3100",
      "webRoot": "${workspaceFolder}/src",
      "sourceMaps": true
    },
  ]
}

```