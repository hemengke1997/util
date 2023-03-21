# react-component

## Features

- Dialog support `show` method
- toast better animation and is unified for pc and mobile

## Usage

### components

| components
| -------- 
| icons
| toast       
| Dialog   


```tsx
import { Dialog, toast } from '@minko-fe/react-component'

Dialog.show({ children: <div>hello world</div> })

toast.show({ content: <div>hello world</div> })
```


```tsx
import { AccountBookFilled } from '@minko-fe/react-component/icons'

<AccountBookFilled/>
```
