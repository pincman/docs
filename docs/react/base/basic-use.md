---
sidebar_position: 1
---
# 入门基础

[immer.js]: https://immerjs.github.io/immer/	"immer.js"

## 状态与副作用

### `useState`

用于改变组件内的状态,例

```tsx
const StateDemo: FC = () => {
    const [count, setCount] = useState(1);
    const [isShow, toggleShow] = useState(true);

    return (
        <div>
            <p>{count}</p>
            <Button onClick={() => setCount(count + 1)}>增加</Button>
            <p className="pt-5">{isShow ? <span> I'm show now </span> : null}</p>
            <Button onClick={() => toggleShow(!isShow)}>{isShow ? '显示' : '隐藏'}</Button>
        </div>
    );
};

export default StateDemo;
```

### `useEffect`

在状态不同的生命周期执行副作用

#### 简单用法

每次状态更新都执行所有没有依赖的`useEffect`,以下代码'toggle ghost'这一条在`resize`浏览器时也会触发

```tsx
const EffectDemo: FC = () => {
    const [ghost, setGhost] = useState<boolean>(false);
    const [width, setWidth] = useState(window.innerWidth);
    const toggleGhostBtn = () => setGhost(!ghost);
    const resizeHandle = () => setWidth(window.innerWidth);
    useEffect(() => {
        window.addEventListener('resize', resizeHandle);
    });
    useEffect(() => {
        console.log('toggle ghost');
    });
    return (
        <div>
            <p>{ghost ? 'ghost' : '普通'}按钮</p>
            <Button type="primary" onClick={toggleGhostBtn} ghost={ghost}>
                切换按钮样式
            </Button>
            <p className="pt-5">宽度为: {width}</p>
        </div>
    );
};
```

#### 依赖更新

通过`useEffect`的第二个参数,可以指定其依赖的变量,只有此变量的状态更改时才会执行副作用函数,如果第二个参数为空,则只在第一次渲染和重新渲染时触发

```tsx
const EffectDemo: FC = () => {
    ...
    useEffect(() => {
        // changeWidth
    }, [width]);
    useEffect(() => {
        console.log('toggle ghost');
    }, [ghost]);
   useEffect(() => {
        console.log('只在第一次或重新渲染组件时触发');
    }, []);
};
```

#### 清理监听

在监听`width`的`useEffect`中,每次改变`width`的状态,都会添加一个`resize`事件,这会极大的耗费浏览器占用的内存,通过一个返回值的方式,即可在下一次`width`状态改变后与添加新的`resize`监听前,取消上次添加的`resize`监听事件

````tsx
const EffectDemo: FC = () => {
    ...
    useEffect(() => {
        window.addEventListener('resize', resizeHandle);
        return () => {
            window.removeEventListener('resize', resizeHandle);
        };
    }, [width]);
};
````

#### 异步执行

在`useEffect`中执行异步函数的语法如下,其实就是在原函数里调用一个`async`打头的立即函数

```typescript
useEffect(() => {
    (async () => {})();
});
```

以下示例代码让按钮在变成`ghost`之后1s再变红色

```tsx

const EffectDemo: FC = () => {
    const [red, setRed] = useState<boolean>(false);
    useEffect(() => {
        (async () => {
            await new Promise((resolve, reject) => setTimeout(() => resolve(true), 1000));
            setRed(ghost);
        })();
    }, [ghost]);
    return (
        <div>
            <Button type="primary" onClick={toggleGhostBtn} ghost={ghost} danger={red}>
                切换按钮样式
            </Button>
        </div>
    );
};
```

### `useLayoutEffect`

与`useEffect`几乎一样,但是具有**防闪烁**作用,比如下面的代码

```typescript
const StateDemo: FC = () => {
    const [count, setCount] = useState(1);
    const [isShow, toggleShow] = useState(true);
    useLayoutEffect(() => {
        if (count === 0) setCount(Math.floor(Math.random() * 100));
    }, [count]);
    return (
        <div>
            <p>{count}</p>
            <Button onClick={() => setCount(0)}>随机数</Button>
...
        </div>
    );
};

export default StateDemo;
```

如果使用`useEffect`在点击按钮时,它会在渲染屏幕后异步调用,而`useLayoutEffect`则会把所有逻辑先计算完毕最后一次性渲染,所以它会阻塞渲染,所以除非必须要用,一般情况下基本用`useEffect`

### `useContext`

用于向后代组件透传一个值,以创建一个语言选择器为例

定义一个语言列表变量

```typescript
const langs: LangType[] = [
    { name: 'en', label: 'english' },
    { name: 'zh-CN', label: '简体中文' },
];
```

创建一个`context`

```typescript
const localContext = createContext<LangStateProps>({
    lang: langs[0],
    setLang: (lang: LangType) => {},
});
```

创建`provider`包装器

```tsx
const LocalProvider: FC<LangStateProps> = ({ lang, setLang, children }) => {
    useEffect(() => {
        setLang(lang);
    }, [lang]);
    return (
        <>
            <localContext.Provider value={{ lang, setLang }}>{children}</localContext.Provider>
        </>
    );
};
```

创建`Local`组件

```tsx
const Local: FC = ({ children }) => {
    const [lang, setLang] = useState(langs[0]);
    return (
        <LocalProvider lang={lang} setLang={setLang}>
            {children}
        </LocalProvider>
    );
};
```

把`App.tsx`中的所有节点包含于`Local`组件

```tsx
const App: FC = () => {
    return (
        <Local>
        ...
        </Local>
    );
};
export default App;
```

语言选择组件

```tsx
const Lang: FC = () => {
    const { lang, setLang } = useContext(localContext);
    const changeLang = (value: string) => {
        const current = langs.find((item) => item.name === value);
        current && setLang(current);
    };
    return (
        <>
            <Select defaultValue={lang.name} style={{ width: 120 }} onChange={changeLang}>
                {langs.map(({ name, label }) => (
                    <Option key={name} value={name}>
                        {label || name}
                    </Option>
                ))}
            </Select>
        </>
    );
};
```

显示当前语言

```tsx
const CurrentLang: FC = () => {
    const { lang } = useContext(localContext);
    return <div>当前语言: {lang.label || lang.name}</div>;
};
```

在`App.tsx`中使用以上两个组件

```tsx
const App: FC = () => {
    return (
        <Local>
                ...
                <LangSelector />
                <CurrentLang />
        </Local>
    );
};
export default App;
```

### `useReducer`

使用`Context`+`useReducer`可以实现轻量级的全局状态管理

以实现一个简单的应用配置功能为例(包含标题设置和暗黑模式切换)

#### 编写类型

```typescript
// 可选择的主题模式
export type ThemeMode = 'light' | 'dark';
// 初始化应用配置
export type ConfigType = {
    title?: string;
    theme?: ThemeMode;
};
// 合并默认配置后的最终应用配置状态
export type ConfigStateType = Required<ConfigType>;
// 可用的reducer操作
export enum ConfigureActionType {
    SET_TITLE = 'change_title',
    CHANGE_THEME = 'change_theme',
}
// 传入给dispatch触发器的数据
export type ConfigureAction =
    | { type: ConfigureActionType.SET_TITLE; value: string }
    | { type: ConfigureActionType.CHANGE_THEME; value: ThemeMode };
// 透传给子组件的context
export interface ConfigureContextType {
    state: ConfigStateType;
    dispatch: Dispatch<ConfigureAction>;
}
```

#### 创建`Context`

```typescript
// 透传配置状态与dispatch
export const ConfigureContext = createContext<ConfigureContextType | null>(null);
```

#### 状态操作

为了确保数据的唯一性不被污染,使用[immer.js][]操作数据

```typescript
export const configReducer: Reducer<ConfigStateType, ConfigureAction> = produce((draft, action) => {
    switch (action.type) {
        // 设置标题
        case ConfigureActionType.SET_TITLE:
            draft.title = action.value;
            break;
        // 设置主题
        case ConfigureActionType.CHANGE_THEME:
            draft.theme = action.value;
            break;
        default:
            break;
    }
});
```

#### 包装器组件

- 合并默认配置和初始化配置
- 使用`useEffect`创建在标题或主题状态改变时引发的副作用钩子
- 把配置状态和`dispatch`传给`ConfigureContext`

```tsx
const Configure: FC<{ config?: ConfigType }> = ({ config = {}, children }) => {
    const [state, dispatch] = useReducer(
        configReducer,
        config,
        (c) =>
            ({
                title: 'react app',
                theme: 'light',
                ...c,
            } as ConfigStateType),
    );
    useEffect(() => {
        const html = document.getElementsByTagName('html')[0];
        if (state.theme === 'dark') {
            html.classList.add('dark');
        } else {
            html.classList.remove('dark');
        }
    }, [state.theme]);
    useEffect(() => {
        document.title = state.title;
    }, [state.title]);
    return (
        <ConfigureContext.Provider value={{ state, dispatch }}>
            {children}
        </ConfigureContext.Provider>
    );
};
```

#### 主题选择组件

```tsx
const Theme = () => {
    const context = useContext(ConfigureContext);
    if (!context) return null;
    const { state, dispatch } = context;
    const toggleTheme = () =>
        dispatch({
            type: ConfigureActionType.CHANGE_THEME,
            value: state.theme === 'light' ? 'dark' : 'light',
        });
    return (
        <div>
            <span>切换主题</span>
            <Switch
                checkedChildren="🌛"
                unCheckedChildren="☀️"
                onChange={toggleTheme}
                checked={state.theme === 'dark'}
                defaultChecked={state.theme === 'dark'}
            />
        </div>
    );
};
```

#### 标题设置组件

```tsx
const Title: FC = () => {
    const context = useContext(ConfigureContext);
    if (!context) return null;
    const { state, dispatch } = context;
    const changeTitle = (e: React.ChangeEvent<HTMLInputElement>) =>
        dispatch({
            type: ConfigureActionType.SET_TITLE,
            value: e.target.value,
        });
    return (
        <div>
            <span>设置标题</span>
            <Input placeholder="标题" value={state.title} onChange={changeTitle} />
        </div>
    );
};
```

#### 在`App.tsx`中使用

```tsx
<Configure>
  ...
  <Theme />
  <Title />
</Configure>
```

## 自定义Hooks

为了更加便捷的使用`dispatch`,可以通过自定义一个hooks的方式来封装一些方法

```typescript
const useConfig = () => {
    const context = useContext(ConfigureContext);
    const { state = defaultConfig, dispatch } = context ?? {};
    const toggleTheme = () =>
        dispatch &&
        dispatch({
            type: ConfigureActionType.CHANGE_THEME,
            value: state.theme === 'light' ? 'dark' : 'light',
        });
    const changeTitle = (value: string) =>
        dispatch &&
        dispatch({
            type: ConfigureActionType.SET_TITLE,
            value,
        });
    return { config: state, toggleTheme, changeTitle };
};
```

有了自定的hooks之后就可以直接在组件中使用了

```tsx
const Theme: FC = () => {
    const {
        config: { theme },
        toggleTheme,
    } = useConfig();
    return (
        <div>
            <span>切换主题</span>
            <Switch
                checkedChildren="🌛"
                unCheckedChildren="☀️"
                onChange={toggleTheme}
                checked={theme === 'dark'}
                defaultChecked={theme === 'dark'}
            />
        </div>
    );
};
const Title: FC = () => {
    const {
        config: { title },
        changeTitle,
    } = useConfig();
    return (
        <div>
            <span>设置标题</span>
            <Input placeholder="标题" value={title} onChange={(e) => changeTitle(e.target.value)} />
        </div>
    );
};
```

## 性能优化

### `useMemo`

`useMemo`拥有个两个参数,一个回调函数和一个依赖项数组,回调函数必须返回一个值,只有在依赖项发生改变的时候,才会重新调用此函数,返回一个新的值.

回调函数的返回值可以是一个`普通类型的值`(例如`字符串`,`布尔值`,`数组`,`对象`等)也可以是一个`函数`,甚至是一个`react组件`,如果返回值是一个函数,则其作用就与`useCallback`一样

以下代码在每次`config`发生改变时,另一个组件的`console.log`也会调用

```tsx
const Theme: FC = () => {
    const {
        config: { theme },
        toggleTheme,
    } = useConfig();
    console.log('render theme component');
    return (...组件代码);
};
const Title: FC = () => {
    const {
        config: { title },
        changeTitle,
    } = useConfig();
    console.log('render title component');
   return (...组件代码);
};
```

这样会在每次的`input`敲入一个字符时就会导致`Theme`组件重新渲染,极大的浪费了性能,可以通过`useMemo`做一下优化

```tsx
const Theme: FC = () => {
    const {
        config: { theme },
        toggleTheme,
    } = useConfig();
    return useMemo(() => {
        console.log('render theme component');
        return (...组件代码);
    }, [theme]);
};
const Title: FC = () => {
    const {
        config: { title },
        changeTitle,
    } = useConfig();
    return useMemo(() => {
        console.log('render title component');
        return (...组件代码);
    }, [title]);
};
```

现在更改其中一个组件只会执行自己组件里的`console.log`了

### `useCallback`

现在把`Theme`和`Title`两个组件放在一起作为`ConfigPanel`的子组件,并取消原来的`useMemo`包装,而改用`memo`包装

> `React.memo`包装的组件,只有当`props`改变之后才会重新渲染,`memo`是浅对比

```tsx
const Theme: FC<{ theme: ThemeMode; toggleTheme: () => void }> = memo(({ theme, toggleTheme }) => {
    console.log('render theme component');
    return (...组件代码);
});
const Title: FC<{ title: string; changeTitle: (value: string) => void }> = memo(
    ({ title, changeTitle }) => {
        console.log('render title component');
        return (...组件代码);
    },
);
const ConfigPanel: FC = () => {
    const { config, toggleTheme, changeTitle } = useConfig();
    return (
        <>
            <Theme theme={config.theme} toggleTheme={toggleTheme} />
            <Title title={config.title} changeTitle={changeTitle} />
        </>
    );
};
```

这时会发现`Theme`子组件中执行`toggleTheme`也会导致`Title`组件重新渲染,原因是`changeTitle`函数不是固定的,父组件重选渲染后会导致产生新的`changeTitle`变量,现在尝试使用`useCallback`包装,是其只在`title`改变时才产生新值,`toggleTheme`也一样

```typescript
const useConfig = () => {
    const context = useContext(ConfigureContext);
    const { state = defaultConfig, dispatch } = context ?? {};
    const toggleTheme = useCallback(
        () =>
            dispatch &&
            dispatch({
                type: ConfigureActionType.CHANGE_THEME,
                value: state.theme === 'light' ? 'dark' : 'light',
            }),
        [state.theme],
    );

    const changeTitle = useCallback(
        (value: string) =>
            dispatch &&
            dispatch({
                type: ConfigureActionType.SET_TITLE,
                value,
            }),
        [state.title],
    );
    return { config: state, toggleTheme, changeTitle };
};
```

现在执行`toggleTheme`并不会导致`Title`组件重新渲染了,反之亦然

## 组件引用

### `useRef`

创建`ref`对象,其`.current`属性被初始化为传入的参数,其`current`属性是可以通过赋值主动改变,而 `ref` 对象本身在组件的整个生命周期内保持不变

#### 生命周期不变对象

以下代码通过使用`useRef`保存上一次的变量,无论`count`如何改变都不会执行`console.log`,因为`ref`对象本身是不变的.而由于`useEffect`和`useLayoutEffect`都是生命周期钩子,与外部是异步的,所以`ref.current`虽然会在钩子中被赋值为最新值,而其外部则保持上一次的值.

```tsx
const StateDemo: FC = () => {
    ...
    const ref = useRef(count);
    useLayoutEffect(() => {
        ref.current = count;
        if (count === 0) setCount(Math.floor(Math.random() * 100));
    }, [count]);
    useEffect(() => {
        console.log('ref has changed');
    }, [ref]);
    return (
        <div>
            <p>{count}</p>
            <p>{ref.current}</p>
            <Button onClick={() => setCount(count + 1)}>增加</Button>
            ...
        </div>
    );
};

```

#### 与`forwardRef`结合

通过`forwardRef`可以把`useRef`的值与`dom`节点绑定,从而可以操控原生的`dom`节点

```tsx
const CustomInput = forwardRef((props = {}, ref: Ref<any>) => (
    <input ref={ref} type="text" {...props} />
));
const RefDemo: FC = () => {
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
            inputRef.current.value = 'useRef';
        }
    });
    return (
        <>
            <CustomInput ref={inputRef} />
        </>
    );
};
export default RefDemo;
```

### `useImperativeHandle`


