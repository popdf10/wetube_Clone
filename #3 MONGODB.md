# #3. MONGODB

- MongoDB는 NoSQL
  - 더 적은 규칙과 더 적은 절차고 작업이 가능한 데이터베이스



#### `mongod`

- mongoDB 실행시키는 명령어



#### `mongo`



### Mongoose

- mongodb와 JS를 연결해주는 nodeJS의 어댑터
- `npm install mongoose`

```js
// db.js
import mongoose from "mongoose";

mongoose.connect("mongodb://localhost:27017/we-tube",
    {
    	useNewUrlParser: true,
	    useFindAndModify: false
	}
);
```

- 매개변수로 string으로 된 Databse를 받는다
  - 어디에 Database가 저장되어 있는지 알려주는 string
- `useNewUrlParser` , `useFindAndModify` : mongoose에 설정을 넘겨주는 방식



```js
const db = mongoose.connection;

const handleOpen = () => console.log("✅ Connected to DB!");

const handleError = () => console.log(`❌ Erorr on DB Connection: ${error}`);

db.once("open", handleOpen);
db.on("error");
```

- db를 open



```js
// init.js

import "./db";
```



### dotenv

- `npm install dotenv`
- 유저데이터나 URL로 부터 정보를 외부로 숨기고 싶을 때

```
// .env
MONGO_URL="mongodb://localhost:27017/we-tube"
PORT=4000
```

```js
// db.js
import dotenv from "dotenv";
dotenv.config

mongoose.connect(process.env.MONGO_URL);
```

```js
// init.js
import dotenv from "dotenv";
dotenv.config

const PORT = process.env.PORT || 4000;
```



### Model

- `models/Video.js` 를 생성
- model: document name. 실제 데이터
- schema: 모델이 어떻게 생겼는지 정의함

```js
import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema({
    fileUrl: {
    	type: String,
	    required: "File URL is required"
	  },
      title: {
        type: String,
        required: "Tilte is required"
      },
      description: String,
      views: {
        type: Number,
        default: 0
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
});

const model = mongoose.model("Video", VideoSchema);

export default model;
```

- model을 만들어도 db에서는 알지 못함. 따로 연결을 해줘야 한다

  ```js
  // init.js
  import "./models/Video"
  ```

  

#### Comment

```js
// Comments.js
import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: "Text is required"
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
});

const model = mongoose.model("Comment", CommentSchema);
export default model;
```



### Commnet와 Video 관계 설정

1. Comment에 Video의 ID를 저장하거나
2. Video 가 ID의 array를 가지고 있는다



#### 1번 방법

```js
// Comment.js

const CommentSchema = new mongoose.Schema({
    video: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video" // ObjectId가 어디에서 온 것인지 알려줌
    }
});
```



#### 2번 방법

```js
// Video.js

const VideoSchema = new mongoose.Schema({
    comments: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
   		}
    ]
});
```





### `async`

- JS는 기본적으로 함수에서 데이터를 처리할 때 처리가 끝날 때까지 기다리지 않음
- `async` 키워드를 함수 앞에 붙이면 함수 안의 특정 부분을 꼭 기다렸다가 진행되도록 만들어줌
- `await` 키워드를 붙인 곳에 해당
  - `await` 키워드를 쓰고 `async` 를 안 붙여주면 에러 발생

```js
// videoController.js
import Video from "../models/Video";

export const home = async (req, res) => {
    const videos = await Video.find({});
    res.render("home", {pageTitle: "Home", videos});
}
```

- `await` 부분이 끝나야(성공적으로 끝나지 않아도 됨. 우선 끝나기만 하면) 다음 줄인`res.render` 가 실행됨



#### try/catch

- `await` 에서 예외가 발생할 수 있다.

```js
try{
    const videos = await Video.find({});
    res.render("home", {pageTitle: "Home", videos});
} catch(error) {
	console.log(error);
    res.render("home", {pageTitle: "Home", videos: []});
}
```





### Upload

- .pug 파일에서 파일을 업로드할 때 비디오만 들어오도록 설정해야 함

  ```
  // upload.pug
  ...
  input(type="file", id="file", name="videoFile", required=true, accept="video/*")
  ```

  

#### multer

- file의 URL을 반환하는 미들웨어
- `npm install multer`

```js
// middlewares.js
import multer from "multer";

const multerVideo = multer({dest: "videos/"});
...
export const uploadVideo = multerVideo.single("videoFile");
```

- `single()`은 오직 하나의 파일만 업로드 할 수 있게 함
- 매개변수(`videoFile`)는 파일로 들어온 `name` 

```js
// videoRouter.js

videoRouter.post(routes.upload, uploadVideo, postUpload);
// postUpload 에 미들웨어 추가해줌
```

```js
// videoControler.js

export const postUpload = async (req, res) => {
    const {
        body: {title, description},
        file: {path}
    } = req;
    const newVideo = await Video.create({
        fileUrl: path,
        title,
        description
    });
    res.redirect(routes.videoDetail(newVideo.id));
};
```

- `async` 로 `newVideo` 를 만들어 준다
- post 할 때 file의 path 부분을 가져와 사용할 것임
- `newVideo` 에 들어가는 부분은 `fileUrl`, `title`, `description`
- 업로드 한 후 해당 비디오 디테일 화면으로 리다이렉트



#### `express.static()`

- 주어진 디렉토리에서 파일을 전달하는 새로운 미들웨어 함수

```js
// app.js
app.use("uploads", express.static("uploads"))
```

- url 에서 /uploads 를 하면 express가 "uploads" 라는 디렉토리의 파일을 보여준다





#### videoDetail 컨트롤러 수정

```js
// videoController.js
export const videoDetail = async (req, res) => {
    const{
        params: {id}
    } = req;
    try{
	    const video = await Video.findById(id);
		res.render("videoDetail", { pageTitle: video.title, video });
    }catch(error){
        console.log(error);
        res.redirect(routes.home);
    } 
}
```



#### videoDetail 템플릿 수정

```
// videoDetail.pug
extends layouts/main

block content
    .video__player
        video(src=`/${video.fileUrl}`, width=250, hegith=250)
    .video__info
        a(href=routes.editVideo(video.id)) Edit video
        h5.video__title=video.title
        span.video__views=video.views
        p.video__description=video.description
    .video__comments
        if video.comments.length === 1
            span.video__comment-number 1 comment
        else
            span.video__comment-number #{video.comments.length} comments
```

```js
// routes.js
const routes = {
    editVideo: (id) => {
        if(id) {
            return `/videos/${id}/edit`;
        }else {
            return EDIT_VIDEO;
        }
    }
}
```

```js
// videoRouter.js
videoRouter.get(routes.editVideo(), editVideo);
// editVideo를 editVideo()로 
```

- 이전처럼 `getEditVideo`, `postEditVideo` 를 만들어줌
- 라우터에도 추가해준다

```js
// videoController.js
export const postEditVideo = async (req, res) => {
  const {
    params: { id },
    body: { title, description },
  } = req;
  try {
    await Video.findOneAndUpdate({ _id: id }, { title, description });
    res.redirect(routes.videoDetail(id));
  } catch (error) {
    res.redirect(routes.home);
  }
};
```

- `findOneAndUpdate` 함수에 아이디와 바꿀 매개변수를 전달해줌



#### Delete Video

- 비디오 삭제는 get만 있고 post는 없음

```js
export const deleteVideo = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    await Video.findOneAndRemove({ _id: id });
  } catch (error) {
    console.log(error);
  }
  res.redirect(routes.home);
};
```

- `findOneAndRemove()` 매개변수로 아이디를 넣어주면 해당 비디오 삭제



#### Search Video

```js
export const search = async (req, res) => {
  const {
    query: { term: searchingBy },
  } = req;
  let videos = [];
  try {
    videos = await Video.find({
      title: { $regex: searchingBy, $options: "i" },
    });
  } catch (error) {
    console.log(error);
  }
  res.render("search", { pageTitle: "Search", searchingBy, videos });
};
```



#### regex: 정규표현식

- `$regex`: 단어가 포함된 데이터를 찾아줌
- `$options`: 대소문자 구분없이 찾아줌 (insensitive)