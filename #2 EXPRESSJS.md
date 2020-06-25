# #2 EXPRESSJS

#### npm == Node Package Manager

- Node.js의 패키지를 관리하는 시스템
- Node.js를 깔면 같이 딸려옴



### npm init

- 패키지 이름부터 description 등등 정보를 초기화
- `package.json` 생성됨



### install Express

- `npm install express`
- `package.json` 이 들어있는 폴더에서 실행해야 함
  - 아니면 다른 곳에 `package.json`을 새로 생성해버림
- `node_modules` 가 설치됨
- `package.json` 에 `dependencies` 항목 추가됨
- `node_modules`  없이 `package.json` 만 있어도
  `npm install` 을 실행하면 버전에 맞는 패키지 알아서 설치해줌!



#### .gitignore

- git이 모듈이 설치되면 전부 체크함.
  - `.gitignore` 파일에 `node_modules` 를 적어줘서 git이 체크하지 않도록 해줌
- `.gitignore nodejs`  도 찾아서 추가해줌
- `package-lock.json`도 추가



### Hello World!

```javascript
const express = require('express');
const app = express();
const PORT = 4000;

function handleListening() {
    console.log(`Listening on: http://localhost:${PORT}`);
}

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(PORT);
```



> #### shortcut: npm start
>
> `package.json` 안에 
>
> ```javascript
> "scripts":{
>     "start": "node index.js"
> }
> ```



#### `app.get` : GET request

```js
function handleHome(req, res){
    res.send("Home");
}

app.get('/', handleHome);
```

- 매개변수 없이 `handleHome()` 만 전달해주면 request에 대한 response가 없어서 동작을 안 함
- 보통은 상태 메시지나 HTML 파일로 response 해줌
- 간단하게 `res.send()` 를 해준다



### Babel

- 최신 JS코드를 예전 JS 코드로 변환해줌

```js
// next-gen JS
const something = (a, b) => a * b;
```

```js
// browser-compatible JS
var something = function something(a, b) {
    return a * b;
};
```

- `npm install @babel/node`

- 많은 Presets 스테이지가 있는데 
  `stage-3` 는 쪼금만 변환됨
  `stage-0` 은 완전 실험적인 것
- 우리는 `env` 를 사용 (많이 적용되는데 엄청 실험적이지도 않은)
  - `npm install @babel/preset-env`



##### .babelrc

- node.js 와 자바스크립트 관련 설정을 넣을 파일

```js
// .babelrc
{
    "presets": ["@babel/preset-env"]
}
```

```js
// old
const express = require('express');
// new
import express from "express";
```

- `package.json` 에서 scripts 를 `babel-node index.js` 로 수정
- 에러가 뜰텐데, `npm install @babel/core` 해줌



##### arrow function

```js
// old
function handleHome(req, res){
    res.send("Home");
}
// new
const handleHome = (req, res) => res.send("Home");
```

- 중괄호를 넣지 않으면 암시적으로 `return`을 해줌
  - `return res.send("Home");` 과 마찬가지
- 중괄호로 감싸면 명시적으로 `return` 적어줘야 함

#### nodemon

- 서버를 껏다 키지 않아도, 파일을 '저장'하면 자동으로 새로고침 해줌
- nodemon은 프로그램 실행과는 별개임
  - `dependencies` 와 별개로 프로그래머가 사용하는 기능은 제외해줘야 함
  - `npm install nodemon -D` 
  - `package.json` 에 `devDependencies` 항목이 생김
    - 프로그램이 아닌 개발자가 필요한 기능

- `scripts` 를 `nodemon --exec babel-node index.js` 로 고쳐줌



> ##### ※`npm start` 를 하면 서버가 2번 시작되는 문제
>
> →babel이 코드를 바꿔주기 때문에 2번 저장된다
>
> - 딜레이를 줘야 함(2초 정도?)
> - `nodemon --exec babel-node index.js --delay 2`



### middleware

- 보통 웹은 user의 요청과 서버의 응답 사이에 어떤 처리가 있음
- 그걸 middleware 에서 처리 해준다
  - 유저의 로그인 여부 체크
  - 파일 전송할 때 가로채 upload 할 수 있음
  - 로그 작성

```js
const betweenHome = (req, res, next) => {
    console.log("Between");
    next();
};

app.get("/", betweenHome, handleHome);
```

- `next()` 를 안 넣어주면 진행이 안 됨
- `handleHome()` 함수 호출 전에 실행되는 함수
- 원하는 만큼의 미들웨어를 가질 수 있음



> ##### 미들웨어로 연결 끊기
>
> `next()` 를 넣지 않으면 더이상 진행이 안 된다.
>
> - 미들웨어에서 `res.send()` 해주면 라우트 전에 끝남



##### 모든 라우트에 미들웨어 적용

```js
app.use(betweenHome);
```

- 순서가 중요함
- `app.get` 이전
- 사용예
  - 모든 라우트에서 IP를 체크하고 거부할 IP가 들어오면 접속을 해제함



#### Morgan: middleware for logging

- `npm install morgan`

  ```js
  import morgan from "morgan";
  
  app.use(morgan("dev"));
  // GET /profile 304 - - 2.874ms
  ```

  

#### Helmet: middleware for security

- `npm install helmet`

  ```js
  import helmet from "helmet";
  
  app.use(helmet());
  ```

  

#### cookie-parser: middleware for cookie

- `npm install cookie-parser`

  ```js
  import cookieParser from "cookie-parser";
  
  app.use(cookieParser());
  ```

  



#### body-parser: middleware for body

- `npm install body-parser`

  ```js
  import bodyParser from "body-parser";
  
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));
  ```

  

### init.js

- ES6의 모듈 시스템을 사용해 다른 파일에 있는 코드를 활용할 수 있음

  ```js
  // app.js
  const app = express();
  
  export default app;
  ```

  - `export` 하면 다른 파일에서 `import` 해서 `app` 사용 가능

  ```js
  // init.js
  import app from "./app";
  
  const PORT = 4000;
  
  const handleListening = () => 
  	console.log("✅ Listening on");
  
  app.listen(PORT, handleListening);
  ```

  - `package.json` 의 `index.js` 을 `init.js` 으로 수정해줌



### router.js

- router는 route가 많이 담긴 파일을 의미함

```js
import express from "express";

export const userRouter = express.Router();

userRouter.get("/", (req, res) => res.send("user index"));
userRouter.get("/edit", (req, res) => res.send("user edit"));
userRouter.get("/password", (req, res) => res.send("user password"));
```

```js
// app.js
import { userRouter } from "./router";

app.use("/user", userRouter);
```

- `app.use` 
  - `/user` 에 접속하면 `userRouter` 에 있는 route를 모두 쓰겠다는 의미



### MVC pattern

##### Model : data

##### View : how does the data look

##### Control : function that looks for the data



- router 관리를 위해 `routers` 폴더 생성후 `userRouter.js` , `videoRouter.js` 생성
- 둘 다 `export default xxxRouter` 해줌
  - 변수만 export하는 게 아니라 파일 전체를 export

```js
// app.js
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import globalRouter from "./routers/globalRouter";

app.use("/", globalRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);
```

- `/`, `/join` , `/login` ... 을 위해 `globalRouter.js` 생성



#### routes.js

- route들을 한 곳에 모아두고 코드 중복을 막기 위해

  ```js
  // Global
  const HOME = "/";
  const JOIN = "/join";
  const LOGIN = "/login";
  const LOGOUT = "/logout";
  const SEARCH = "/search";
  
  // Users
  const USERS = "/users";
  const USER_DETAIL = "/:id"; // 콜론이 붙어있으면 문자 그대로가 아닌 변하는 값으로 인식함
  const EDIT_PROFILE = "/edit-profile";
  const CHANGE_PASSWORD = "/change-password";
  
  // Videos
  
  const VIDEOS = "/videos";
  const UPLOAD = "/upload";
  const VIDEO_DETAIL = "/:id";
  const EDIT_VIDEO = "/:id/edit";
  const DELETE_VIDEO = "/:id/delete";
  
  const routes = {
    home: HOME,
    join: JOIN,
    login: LOGIN,
    logout: LOGOUT,
    search: SEARCH,
    users: USERS,
    userDetail: USER_DETAIL,
    editProfile: EDIT_PROFILE,
    changePassword: CHANGE_PASSWORD,
    videos: VIDEOS,
    upload: UPLOAD,
    videoDetail: VIDEO_DETAIL,
    editVideo: EDIT_VIDEO,
    deleteVideo: DELETE_VIDEO,
  };
  
  export default routes;
  ```



```js
// app.js
import routes from "./routes"; 

app.use(routes.home, globalRouter);
app.use(routes.users, userRouter);
app.use(routes.videos, videoRouter);
```

```js
// globalRouter.js
import routes from "../routes"; // userRouter, videoRouter에도 똑같이 적용해줌

globalRouter.get(routes.home, (req, res) => res.send('Home'));
...
```



### controllers

- url과 함수를 분리해주기 위해 `controllers` 폴더를 만들고 각각의 `.js` 파일을 만듦
- 대개 각 프로젝트에 있는 각 모델마다 컨트롤러를 만듦

```js
// videoController.js
export const home = (req, res) => res.send("Home");
...
```

```js
// userController.js
export const join = (req, res) => res.send("Join");
export const login = (req, res) => res.send("Login");
export const logout = (req, res) => res.send("Logout");
...
```

- 이제 Router와 controller를 분리 해냄

  ```js
  //globalRouter.js
  import { home } from "../controllers/videoController"; //vscode 가 자동으로 import 해줌
  
  globalRouter.get(routes.home, home);
  ```

  



### pug: view endgine

`npm install pug`

```js
app.set('view engine', 'pug');
```

-  pug의 기본 디렉토리는 `/views` (views 디렉토리 만들어줌)
-  기본 디렉토리를 바꾸고 싶다면 `app.set('views')`  를 통해 바꿔줌(자세한 건 api 문서 참조)

-  pug는 템플릿 언어. 짧은 코드를 html 코드로 바꿔준다

```html
// home.pug
p Hello

// home.html
<p>Hello</p>
```

-  pug를 웹 사이트에 전송해주려면 `.render`

   ```js
   res.redner("home");
   // views 폴더 안의 home.pug 파일을 찾아 렌더링 해줌
   ```



#### main.pug

-  모든 템플릿의 베이스가 되는 파일

```js
doctype html
	html
		head
			title Wetube
		body
			main
				block content
			footer
				span &copy; WeTube
```

-  들여쓰기로 태그를 구분함
-  `block content` 에 다른 .pug 파일의 내용을 적어줄 수 있다

```js
// home.pug
extends layouts/main.pug

block content
	p Hello
```



#### partials

-  페이지의 일부분을 재활용하기 위한 목적으로 따로 만들어 둠
   ex) `header.pug`, `footer.pug`, `socialLogin.pug`

   ```
   // footer.pug
   footer.footer
   	.footer__icon
   		i.fab.fa-youtube
   	span.footer__text &copy; #{new Date().getFullYear()} WeTube
   ```

   -  `#{}` 을 쓰면 pug 파일 안에 자바스크립트를 쓸 수 있음

-  필요한 곳에 `include`  를 이용해 사용

```
// main.pug
...
include ../partials/footer
```



#### res.locals

-  local 변수/함수를 global하게 사용하도록 `app.use(middleware)` 를 해줌

```js
import routes from "./routes";

export const localMiddleware = (req, res, next) => {
    res.locals.siteName = "Wetube";
    res.locals.routes = routes;
    next();
}
```

-  전역적으로 `siteName` 을 `Wetube` 로 쓸 수 있고,
   `routes`를 쓰면 `routes.js` 를 자동으로 임포트 해줌

   ```
   // header.pug
   ...
   li
   	a(href=routes.join) Join
   ```

   

#### 한 템플릿에만 변수를 추가하기(템플릿마다 다른 정보를 가질 수 있도록)

```
// main.pug
#{pageTitle}
```

```js
// videoController.js
export const home = (req, res) => res.render("home", {pageTitle: "Home"});
export const search = (req, res) => res.render("search", {pageTitle: "Search"});
```



#### req.query.term

```
// search.pug
h3 Searching for: #{searchingby}
```

```js
// videoController.js
export const search = (req, res) => {
    const {
        query: {term: searchingBy}
    } = req;
    res.render("search", {pageTitle: "Search", searchingBy});
}

// ES6 이전 코드
const searchingBy = req.query.term;
```



>  #### `routes.js` 에 `/:id` 가 브라우저에 그대로 나옴
>
>  `/:id` 는 express에서 쓰이는 표현인데 브라우저는 그걸 몰라서
>  user/1/edit 가 아니라 user/:id/edit 으로 표현됨
>
>  ##### `routes.js` 의 라우트 값을 약간 수정
>
>  ```js
>  userDetail: (id) => {
>      if(id){
>          return `users/${id}`;
>      }else{
>          return USER_DETAIL;
>      }
>  }
>  ```
>
>  ```js
>  // userRouter.js
>  ...
>  userRouter.get(routes.userDetail(), userDetail);
>  // userDetail → userDetail()
>  ```
>
>  ```
>  // header.pug
>  ...
>  li
>  	a(href=routes.userDetail(user.id)) Profile
>  // 템플릿에서는 인자로 id가 필요하다
>  ```



#### fake db

```js
export const videos = {
    {
        id: 32957,
        title: 'Video awessome',
        description: 'This is something I love',
        views: 24,
        videoFile: "https://...",
    	creator:{
    		id: 1232,
    		name: "Nicolas",
    		email: "nico@las.com"
		}
	}
}
```

```js
// videoController.js
import {videos} from "../db";

export const home = (req, res) => {
    res.redner("home", {pageTitle: "Home", videos})
}
```

-  `home` 템플릿에 `videos` fake db가 전달되어서 title, id, views 등의 정보를 보여줄 수 있음



```
// home.pug
block content
	.videos
		each video in videos
			h1=video.title
			p=video.views
```

-  `each~in` : 파이썬의 for문 같이 순회하면서 데이터를 보여줌



#### mixins

-  웹사이트에서 계속 반복되는 코드를 복사-붙여넣기 하지 않고 재활용하는 방법
-  각각 다른 정보를 가지지만 같은 구조를 가지는 데이터를 표시하기 위한 방법

```
// videoBlock.pug
mixin videoBlock(video = {})
	h1=video.title
	p=video.description
```

```
// home.pug
include mixins/videoblock

block content
	.videos
		each item in videos
			+videoblock({
				title: item.title,
				description: item.description,
			})
```



#### Router().post

-  url에 정보가 나타나는 get
-  서버에 정보를 숨겨서 보내는 post

```js
// globalRouter.js

globalRouter.get(routes.join, getJoin);
globalRouter.post(routes.join, postJoin);
```

```js
// userController.js
import routes from "../routes";

export const postJoin = (req, res) => {
    const {
        body: {name, email, password, password2}
    } = req;
    if(password !== password2){
        res.status(400);            
        res.render("join", {pageTitle: "Join"});
    }else{
        res.redirect(routes.home);
    }

};
```



