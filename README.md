# vtb-bigip-api

## API trung giao giao tiếp với BIG-IP
API này đứng giữa user/app và các instance F5 BIG-IP, chỉ thực hiện một số chức năng cần thiết thay vì phơi toàn bộ API của BIG-IP
## Cài đặt
Yêu cầu máy chủ có cài nodejs, npm và các module cần thiết (xem file package.json). Ngoài ra, để chạy trơn tru, có thể cần thêm module pm2 và hoặc đóng gói trong container nữa thì càng tốt.

Download source về:
```
git clone https://github.com/biennt/vtb-bigip-api.git
```

Cài đặt các package cần thiết (express, axios..)
```
cd vtb-bigip-api
npm install
```

Xong rồi có thể chạy trực tiếp bằng node
```
node index.js
```

Hoặc chạy bằng nodemon (trong lúc phát triển, thay đổi thì nên dùng cái này)
```
nodemon index.js
```

Hoặc dùng pm2 (cài đặt bằng `npm install pm2@latest -g`):
```
pm2 start app.js
```
