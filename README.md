<h1 align="center">一个简单的博客系统</h1>
<p>旨在了解全栈开发流程，搭建一个自用的个人博客。</p>

<h2>技术栈：</h2>  
<ul>
  <li><code>Vue</code> : 前端框架，配以<code>Element-UI</code>快速建站。</li>
  <li><code>Express</code> : 服务器框架</li>
  <li><code>MongoDB</code> : 数据库</li>
  <li><code>Mongoose</code> : <code>Node</code>框架，用于操作<code>MongoDB</code></li>
</ul>

<h2>本地构建</h2>

<pre>
  <code>
    // 先clone到本地,修改config/config.example.js里面的设置,并改文件名为config.js

    // 更改ssr/config/config.example.js里面的设置并改文件名为config.js

    // 更改src/admin/assets/js/config.js里面的设置
    
  </code>
</pre>

<pre>
  <code>
    # 进入到 /src/admin 下

    npm install

    npm run build

    # 根目录下

    npm install

    npm run dev

    npm run addAdmin
    
    # 打开 http://localhost:3000/admin,可查看博客后台管理系统
    # 打开 http://localhost:3000/blog,可查看博客页面
  </code>
</pre>

<h2>开发流程</h2>
<h4>服务端：<h4>

  - [X] 登录
  - [X] 用户的增删改查
  - [X] 文章的增删改查
  - [X] 标签的增删改查
  - [X] 分类的增删改查
  - [X] 文章关联分类
  - [X] 文章关联标签
  - [X] 评论的增删改查
  - [X] 递归删除查询
  - [X] 错误日志收集
  - [X] 删除分类时清空相关的文章的分类关联
  - [X] 删除标签时删除相关的文章的标签关联
  - [X] 文章的筛选排序
  - [X] 访问量统计
  - [X] 限制图片上传的大小,格式
  - [ ] 对表单进行数据校验
  - [X] 博客页面专用API
  - [X] 图片文件传存七牛云

<h4>后台管理端：<h4>  

  - [X] 登录  
  - [X] axios的封装
  - [X] api的封装
  - [X] 用户管理  
  - [X] 文章管理  
  - [X] 标签管理  
  - [X] 分类管理
  - [X] 评论管理
  - [ ] 概览  
  - [ ] 对表单进行数据校验  
  - [X] 文章增加海报的上传

<h4>博客页面：<h4>  

  - [X] 页面结构设计  
  - [X] 服务器端渲染(SSR) 
  - [X] 响应式布局
  - [X] 登录
  - [X] 注册
  - [X] 首页
  - [X] 文章详情页
  - [X] 评论系统
  - [X] 标签筛选
  - [X] 前端表单数据校验
  - [X] msgBox插件
  - [ ] 搜索页
  - [X] 热门文章
  - [X] 全局进度条
  - [ ] 画廊(延后)
  - [ ] 关于(延后)


<p>蜗速开发中...</p>