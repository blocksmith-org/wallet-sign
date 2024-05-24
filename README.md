## 签名流程
1. 安装依赖库  
`npm install`
2. 拷贝配置文件  
`cp env.template .env`
3. 编辑.env 文件，其中，MNEMONIC 是助记词，MESSAGE 是签名消息  
**请手动输入，不要复制粘贴助记词**
4. 进行签名  
`npm run sign`